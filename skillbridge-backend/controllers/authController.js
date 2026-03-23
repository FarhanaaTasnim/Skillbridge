export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  res.json({
    message: "User registered successfully",
    user: { name, email }
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  res.json({
    token: "sample-jwt-token",
    user: { email }
  });
};