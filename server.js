const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// User schema
const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
});
const User = mongoose.model("User", userSchema);
//parrot schema
const parrotSchema = new mongoose.Schema({
  name: { type: String, required: true },
  intro: { type: String },
  imageUrl: { type: String },
  instagram: { type: String },
  twitter: { type: String },
  addedBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
const Parrot = mongoose.model("Parrot", parrotSchema);

// Contact schema
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
});
const Contact = mongoose.model("Contact", contactSchema);

// Signup route
app.post("/api/signup", async (req, res) => {
  const { username, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    const user = new User({ username, email, password: hashed });
    await user.save();
    res.status(201).json({ username, email }); // Return username and email
  } catch (err) {
    res.status(400).json({ error: "Email already exists" });
  }
});

// Login route
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "Invalid credentials" });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: "Invalid credentials" });
  res.json({ username: user.username, email: user.email });
});
// parrot submission route
app.post("/api/parrots", async (req, res) => {
  const { name, intro, instagram, twitter, imageUrl, addedBy } = req.body;
  try {
    const parrot = new Parrot({
      name,
      intro,
      instagram,
      twitter,
      imageUrl,
      addedBy,
    });
    await parrot.save();
    res.status(201).json({ message: "Parrot added!" });
  } catch (err) {
    res.status(400).json({ error: "Could not add parrot" });
  }
});
app.get("/api/parrots", async (req, res) => {
  try {
    const parrots = await Parrot.find().sort({ createdAt: -1 });
    res.json(parrots);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch parrots" });
  }
});

// Contact form route
app.post("/api/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;
  try {
    const contact = new Contact({ name, email, subject, message });
    await contact.save();
    res.status(201).json({ message: "Message sent!" });
  } catch (err) {
    res.status(400).json({ error: "Could not send message" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
