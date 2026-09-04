const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill all fields"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters"
      });
    }

    const exists = await User.findOne({ email });

    // Existing account but not verified
    if (exists && !exists.verified) {
      const verificationToken = crypto.randomBytes(32).toString("hex");

      exists.verificationToken = verificationToken;
      await exists.save();

      const verificationLink =
        `http://localhost:5000/api/auth/verify/${verificationToken}`;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Pizza Delivery - Verify Your Email",
        text: `Welcome to Pizza Delivery!

Please verify your email:

${verificationLink}`
      });

      return res.json({
        message: "Verification email sent again. Please check your email."
      });
    }

    if (exists) {
      return res.status(400).json({
        message: "Email already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString("hex");

    await User.create({
      name,
      email,
      password: hashedPassword,
      verificationToken
    });

    const verificationLink =
      `http://localhost:5000/api/auth/verify/${verificationToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Pizza Delivery - Verify Your Email",
      text: `Welcome to Pizza Delivery!

Please verify your email:

${verificationLink}`
    });

    res.json({
      message: "Registration successful. Please check your email to verify your account."
    });

  } catch (error) {
    console.log("Registration error:", error.message);

    res.status(500).json({
      message: "Server error"
    });
  }
});

// EMAIL VERIFICATION
router.get("/verify/:token", async (req, res) => {
  try {
    const user = await User.findOne({
      verificationToken: req.params.token
    });

    if (!user) {
      return res.status(400).send("Invalid or expired verification link.");
    }

    user.verified = true;
    user.verificationToken = null;

    await user.save();

    res.send("Email verified successfully! You can now login.");

  } catch (error) {
    console.log("Verification error:", error.message);
    res.status(500).send("Verification failed.");
  }
});

// LOGIN + JWT
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter email and password"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    if (!user.verified) {
      return res.status(400).json({
        message: "Please verify your email first"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Incorrect password"
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.log("Login error:", error.message);

    res.status(500).json({
      message: "Server error"
    });
  }
});

module.exports = router;