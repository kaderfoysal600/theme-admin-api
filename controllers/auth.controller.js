import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js"; 
import bcrypt from "bcryptjs";

// --- Admin Signup (use ONCE, then delete route) ---
export const adminSignup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Require strong password (basic example, can add zxcvbn lib)
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/.test(password)) {
      return res.status(400).send({
        message:
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
      });
    }

    const admin = new Admin({ username, email, password });
    await admin.save();

    res.status(201).send({ message: "Admin registered successfully!" });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).send({ message: "Username or Email already exists." });
    }
    res.status(500).send({ message: error.message });
  }
};

// --- Admin Login ---
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).send({ message: "Admin not found" });
    }

    const passwordIsValid = await admin.comparePassword(password);

    if (!passwordIsValid) {
      return res.status(401).send({ message: "Invalid credentials" });
    }

    // Secure JWT token
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h", algorithm: "HS512" } // stronger algorithm
    );

    res.status(200).send({
      id: admin._id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
      accessToken: token,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
