const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiration } = require('../config/auth.config');
const multer = require("multer");
const path = require("path");
const transporter = require('../config/email.config');
const { generateOTP } = require('../utils/otp.utils');

const otpStorage = {};
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary (add this at the top of your file)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) // Append the current timestamp to the filename to avoid conflicts
  },
});

const uploadss = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (extName && mimeType) {
      return cb(null, true);
    } else {
      cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiryTime = new Date();
    otpExpiryTime.setMinutes(otpExpiryTime.getMinutes() + 10); // OTP valid for 10 minutes

    otpStorage[email] = {
      otp,
      fullName,
      password,
      expiry: Date.now() + 5 * 60 * 1000
    };

    // Send OTP email
    const mailOptions = {
      from: `${process.env.EMAIL_USER}`,
      to: email,
      subject: 'Verify Your Email - OTP',
      html: `<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #000000; color: #ffffff;">
  <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #161b22; border-radius: 8px; border: 1px solid #7d3ff3; box-shadow: 0px 4px 10px rgba(125, 63, 243, 0.5);">
    <h1 style="text-align: center; color: #7538e0; margin-bottom: 20px;">Email Verification</h1>
    <p style="font-size: 16px; margin-bottom: 10px;">Hello <span style="color: #dcbcff;">${fullName}</span>,</p>
    <p style="font-size: 16px; margin-bottom: 20px; color: #ffffff;">Thank you for signing up! Please use the following One-Time Password (OTP) to verify your email:</p>
    <div style="text-align: center; margin: 20px 0;">
      <span style="font-size: 24px; font-weight: bold; color: #b083f9; background-color: #21262d; padding: 10px 20px; border-radius: 4px; display: inline-block; border: 1px solid #9448f1;">${otp}</span>
    </div>
    <p style="font-size: 16px; margin-bottom: 20px; color: #ffffff;">This OTP will expire in <strong style="color: #dcbcff;">10 minutes</strong>.</p>
    <hr style="border: 1px solid #7d3ff3; margin: 30px 0;">
    <p style="font-size: 14px; color: #c9d1d9; text-align: center;">If you did not request this email, please ignore it or contact support if you have concerns.</p>
    <p style="text-align: center; margin-top: 20px;">
      <a href="#" style="text-decoration: none; font-size: 14px; color: #7538e0; font-weight: bold;">Visit Our Website</a>
    </p>
  </div>
</body>`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: 'OTP has been sent to your email!'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error sending OTP',
      error: error.message
    });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Check if OTP exists in storage and matches
    const storedData = otpStorage[email];

    if (!storedData || storedData.otp !== otp || storedData.expiry < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    // Create new user with stored data
    const user = new User({
      fullName: storedData.fullName,
      email: email,
      password: storedData.password
    });

    await user.save();

    // Clear OTP from storage after successful verification
    delete otpStorage[email];

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error verifying OTP',
      error: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const role = "admin";
    // Generate token
    const token = jwt.sign({ id: user._id, role }, jwtSecret, {
      expiresIn: jwtExpiration
    });

    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    // Handle file upload
    uploadss.single("profileImage")(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      const userId = req.params.userId;
      const updates = req.body;

      // If a profile image is uploaded, upload to Cloudinary
      if (req.file) {
        try {
          const result = await cloudinary.uploader.upload(req.file.path);
          updates.profileImage = result.secure_url;
        } catch (cloudinaryError) {
          return res.status(400).json({ error: "Error uploading image to Cloudinary" });
        }
      }

      const user = await User.findByIdAndUpdate(userId, updates, { new: true });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({
        message: "User updated successfully",
        user,
      });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiryTime = new Date();
    otpExpiryTime.setMinutes(otpExpiryTime.getMinutes() + 10);

    // Store OTP in storage
    otpStorage[email] = {
      otp,
      expiry: Date.now() + 10 * 60 * 1000
    };

    // Send OTP email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset - OTP',
      html: `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset OTP</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #000;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border: 1px solid #dddddd;
            border-radius: 8px;
            box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .email-header {
            background-color: #7538e0;
            color: white;
            padding: 20px;
            text-align: center;
        }
        .email-body {
            padding: 20px;
        }
        .email-body h1 {
            font-size: 22px;
            color: #333333;
            margin-bottom: 20px;
        }
        .email-body p {
            font-size: 16px;
            color: #555555;
            line-height: 1.6;
        }
        .otp-code {
            display: inline-block;
            background:#7538e0;
            color: #ffffff;
            padding: 10px 20px;
            font-size: 20px;
            font-weight: bold;
            border-radius: 4px;
            margin: 20px 0;
        }
        .email-footer {
            background-color: #f7f7f7;
            color: #888888;
            text-align: center;
            padding: 15px;
            font-size: 12px;
            border-top: 1px solid #eeeeee;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h2>Password Reset Request</h2>
        </div>
        <div class="email-body">
            <h1>Password Reset</h1>
            <p>Your OTP for password reset is:</p>
            <div class="otp-code">${otp}</div>
            <p>This OTP will expire in <strong>10 minutes</strong>.</p>
            <p>If you did not request a password reset, please ignore this email.</p>
        </div>
        <div class="email-footer">
            <p>&copy; 2024 YourCompany. All rights reserved.</p>
        </div>
    </div>
</body>
</html>

      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending OTP', error: error.message });
  }
};

exports.verifyForgotPasswordOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const storedData = otpStorage[email];

    if (!storedData || storedData.otp !== otp || storedData.expiry < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying OTP', error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = newPassword;
    await user.save();

    // Clear OTP from storage
    delete otpStorage[email];

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating password', error: error.message });
  }
};

