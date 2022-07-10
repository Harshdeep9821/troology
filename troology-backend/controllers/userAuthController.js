const { OAuth2Client } = require("google-auth-library");
const User = require("./../models/userModel");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const jwt = require("jsonwebtoken");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res, message) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIES_EXPIRES_IN * 24 * 62 * 62 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  user.password = undefined;
  res.cookie("bearerToken", token, cookieOptions);
  res.status(statusCode).json({
    status: "success",
    message: message,
    data: {
      user,
      token,
    },
  });
};

const googleAuth = async (token) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
  } catch (error) {
    return "error";
  }
};
exports.checkUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      res.status(200).json({ status: "ok", message: "user exists" });
    } else {
      res.status(404).json({ status: "notFound", message: "user not found" });
    }
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { token, address, mobileNumber } = req.body;
    const payload = await googleAuth(token);
    if (payload === "error") {
      res.status(401).json({ status: "error", message: "invalid token" });
    } else {
      const user = await User.findOne({ email: payload.email });
      if (user) {
        createSendToken(user, 200, res, "User login Successfully");
      } else {
        const newUser = await User.create({
          email: payload.email,
          name: payload.name,
          photo: payload.picture,
          address,
          mobileNumber,
        });
        createSendToken(newUser, 201, res, "User register Successfully");
      }
    }
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { token } = req.body;
    const payload = await googleAuth(token);
    if (payload === "error") {
      res.status(401).json({ status: "error", message: "invalid token" });
    } else {
      const user = await User.findOne({ email: payload.email });
      if (user) {
        createSendToken(user, 200, res, "User login Successfully");
      } else {
        res
          .status(401)
          .json({ status: "unauthorized", message: "User is not register" });
      }
    }
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ status: "success", message: "Successfully", user });
  } catch (error) {
    res
      .status(401)
      //   .clearCookie("bearerToken")
      .json({ status: "unauthorized", message: "unauthorized User" });
  }
};

exports.logout = async (req, res) => {
  try {
    res
      .status(200)
      .clearCookie("bearerToken")
      .json({ message: "Logout successfully", status: "Success" });
  } catch (error) {
    res.status(500).clearCookie("bearerToken").json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

exports.protect = async (req, res, next) => {
  try {
    let token;

    const cookie = req.headers.cookie.split("; ")[1];

    if (cookie && cookie.startsWith("bearer")) {
      token = cookie.split("=")[1];
    }

    if (!token) {
      res.status(401).json({
        status: "unauthorized",
        message: "you are not logged in ! please log in to get access",
      });
    } else {
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);
      currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        res.status(500).clearCookie().json({
          status: "success",
          message: "Something went wrong",
        });
      } else {
        req.user = currentUser;
        next();
      }
    }
  } catch (error) {
    res.status(401).json({
      status: "unauthorized",
      message: "you are not logged in ! please log in to get error access",
    });
  }
};
