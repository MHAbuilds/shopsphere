const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");

// Get wishlist
exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id })
      .populate("products");

    res.json(wishlist || { products: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add product to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = new Wishlist({
        user: req.user._id,
        products: []
      });
    }

    if (!wishlist.products.some(id => id.toString() === productId)) {
      wishlist.products.push(productId);
    }

    await wishlist.save();
    await wishlist.populate("products");

    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove product from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.products.pull(req.params.productId);

    await wishlist.save();
    await wishlist.populate("products");

    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = exports;