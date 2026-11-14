const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Place order using Cash on Delivery
exports.placeOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    if (
      !shippingAddress?.fullName ||
      !shippingAddress?.phone ||
      !shippingAddress?.address ||
      !shippingAddress?.city ||
      !shippingAddress?.pincode
    ) {
      return res.status(400).json({
        message: "Please complete your shipping address"
      });
    }

    const cart = await Cart.findOne({ user: req.user._id })
      .populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    const orderItems = [];
    let totalAmount = 0;

    for (const item of cart.items) {
      const product = item.product;

      if (!product) {
        return res.status(400).json({
          message: "A product in your cart is unavailable"
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `${product.name} has insufficient stock`
        });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        brand: product.brand,
        image: product.image,
        price: product.price,
        quantity: item.quantity
      });

      totalAmount += product.price * item.quantity;
    }

    // Reduce stock after validating all cart items
    for (const item of cart.items) {
      const updated = await Product.updateOne(
        {
          _id: item.product._id,
          stock: { $gte: item.quantity }
        },
        { $inc: { stock: -item.quantity } }
      );

      if (updated.modifiedCount !== 1) {
        return res.status(409).json({
          message: "Stock changed. Please review your cart and try again."
        });
      }
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod: "COD",
      totalAmount
    });

    cart.items = [];
    await cart.save();

    res.status(201).json({
      message: "Order placed successfully",
      order
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Customer order history
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Customer order details
exports.getMyOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Customer cancellation
exports.cancelMyOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!["Placed", "Processing"].includes(order.orderStatus)) {
      return res.status(400).json({
        message: "This order can no longer be cancelled"
      });
    }

    // Restore product stock
    for (const item of order.items) {
      await Product.updateOne(
        { _id: item.product },
        { $inc: { stock: item.quantity } }
      );
    }

    order.orderStatus = "Cancelled";
    await order.save();

    res.json({
      message: "Order cancelled successfully",
      order
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};