
const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const mongoose = require("mongoose");
const Product = require("./models/Product");

const products = [
  {
    name: "Hydrating Face Cleanser",
    brand: "GlowCare",
    category: "Skincare",
    description: "A gentle daily cleanser for fresh and hydrated skin.",
    price: 299,
    image: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=600",
    stock: 30
  },
  {
    name: "Vitamin C Face Serum",
    brand: "GlowCare",
    category: "Skincare",
    description: "A lightweight serum for a brighter-looking complexion.",
    price: 499,
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600",
    stock: 25
  },
  {
    name: "Daily Moisturizer",
    brand: "SkinBloom",
    category: "Skincare",
    description: "A daily moisturizer for soft and nourished skin.",
    price: 349,
    image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600",
    stock: 20
  },
  {
    name: "Matte Liquid Lipstick",
    brand: "ColorPop",
    category: "Makeup",
    description: "A comfortable matte lipstick for everyday makeup.",
    price: 399,
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600",
    stock: 40
  },
  {
    name: "Natural Glow Foundation",
    brand: "ColorPop",
    category: "Makeup",
    description: "A lightweight foundation with a natural-looking finish.",
    price: 599,
    image: "https://images.unsplash.com/photo-1631214540242-6e2b2e3b7b5e?w=600",
    stock: 15
  },
  {
    name: "Nourishing Hair Shampoo",
    brand: "HairAura",
    category: "Haircare",
    description: "A gentle shampoo for clean and manageable hair.",
    price: 279,
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600",
    stock: 35
  },
  {
    name: "Repair Hair Serum",
    brand: "HairAura",
    category: "Haircare",
    description: "A smoothing serum for dry and frizzy hair.",
    price: 449,
    image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600",
    stock: 18
  },
  {
    name: "Floral Eau de Parfum",
    brand: "AromaNest",
    category: "Fragrance",
    description: "A fresh floral fragrance for everyday use.",
    price: 799,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600",
    stock: 12
  },

  {
    name: "Rose Water Toner",
    brand: "SkinBloom",
    category: "Skincare",
    description: "A refreshing toner for a fresh and hydrated feel.",
    price: 249,
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600",
    stock: 25
  },
  {
    name: "Aloe Vera Gel",
    brand: "GlowCare",
    category: "Skincare",
    description: "A lightweight gel for everyday skincare.",
    price: 199,
    image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600",
    stock: 30
  },
  {
    name: "Gentle Face Scrub",
    brand: "SkinBloom",
    category: "Skincare",
    description: "A gentle exfoliating scrub for smooth-feeling skin.",
    price: 299,
    image: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=600",
    stock: 20
  },
  {
    name: "Hydrating Sheet Mask",
    brand: "GlowCare",
    category: "Skincare",
    description: "A convenient sheet mask for a refreshing skincare session.",
    price: 149,
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600",
    stock: 40
  },
  {
    name: "Peach Lip Gloss",
    brand: "Muse Beauty",
    category: "Makeup",
    description: "A glossy peach lip finish for everyday looks.",
    price: 299,
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600",
    stock: 30
  },
  {
    name: "Soft Glam Eyeshadow Palette",
    brand: "Muse Beauty",
    category: "Makeup",
    description: "Versatile neutral shades for soft glam makeup.",
    price: 699,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600",
    stock: 15
  },
  {
    name: "Liquid Concealer",
    brand: "ColorPop",
    category: "Makeup",
    description: "A blendable concealer for an even-looking finish.",
    price: 349,
    image: "https://images.unsplash.com/photo-1631214540242-6e2b2e3b7b5e?w=600",
    stock: 22
  },
  {
    name: "Volumizing Mascara",
    brand: "Muse Beauty",
    category: "Makeup",
    description: "A mascara for defined and fuller-looking lashes.",
    price: 399,
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600",
    stock: 25
  },
  {
    name: "Coconut Hair Conditioner",
    brand: "HairAura",
    category: "Haircare",
    description: "A nourishing conditioner for soft and manageable hair.",
    price: 329,
    image: "https://images.unsplash.com/photo-1600612253971-422e7f7faeb6?w=600",
    stock: 25
  },
  {
    name: "Argan Hair Oil",
    brand: "Root & Ritual",
    category: "Haircare",
    description: "A lightweight hair oil for a smooth-looking finish.",
    price: 399,
    image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600",
    stock: 20
  },
  {
    name: "Vanilla Mist",
    brand: "AromaNest",
    category: "Fragrance",
    description: "A sweet and warm vanilla-inspired fragrance mist.",
    price: 499,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600",
    stock: 18
  },
  {
    name: "Fresh Floral Body Mist",
    brand: "Noir Botanica",
    category: "Fragrance",
    description: "A fresh floral-inspired body mist for everyday use.",
    price: 449,
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600",
    stock: 20
  }
];

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    for (const product of products) {
      await Product.updateOne(
        { name: product.name },
        { $set: product },
        { upsert: true }
      );
    }

    console.log("ShopSphere sample products added successfully!");
  } catch (error) {
    console.error("Product seeding error:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

seedProducts();
