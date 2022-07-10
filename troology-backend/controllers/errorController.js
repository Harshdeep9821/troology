exports.error = (req, res) => {
  try {
    res.status(404).json({ status: "NotFound", message: "Invalid Endpoint" });
  } catch (error) {
    res.status(500).json({ status: "Error", message: error.message });
  }
};

// this is error file
