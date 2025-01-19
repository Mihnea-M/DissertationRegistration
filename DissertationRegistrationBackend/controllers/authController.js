const { User, Student, Professor } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const passwordSalt = parseInt(process.env.PASSWORD_SALT);

const register = async (req, res) => {
  const { username, password, role, name, email, studentNumber, department } =
    req.body;

  if (!username || !password || !role || !name || !email) {
    return res
      .status(400)
      .json({
        message: "Username, password, role, name and email are required",
      });
  }

  try {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, passwordSalt);
    const user = await User.create({
      username,
      password: hashedPassword,
      role,
      name,
      email,
    });

    if (role === "student") {
      await Student.create({
        userId: user.id,
        studentNumber,
        department,
      });
    } else if (role === "professor") {
      await Professor.create({
        userId: user.id,
        department,
      });
    }

    res.status(201).json({
      message: "User created successfully",
      user: { id: user.id, username: user.username, role: user.role },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const logout = (req, res) => {
  res.clearCookie("auth_token");
  res.json({ message: "Logout successful" });
};

const checkSession = (req, res) => {
  const token = req.cookies.auth_token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({
      user: { id: decoded.id, name: decoded.name, role: decoded.role },
    });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: "Session expired" });
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  }
};

module.exports = { register, login, logout, checkSession };
