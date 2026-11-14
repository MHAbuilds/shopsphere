const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error("Admin environment variables are missing");
    }

    if (ADMIN_PASSWORD.length < 8) {
      throw new Error("Admin password must be at least 8 characters");
    }

    const existingAdmin = await User.findOne({
      email: ADMIN_EMAIL.toLowerCase()
    });

    if (existingAdmin) {
      throw new Error("This email already exists. Choose a new admin email.");
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL.toLowerCase(),
      password: hashedPassword,
      role: "admin"
    });

    console.log("ShopSphere admin created successfully!");
  } catch (error) {
    console.error(error.message);
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();