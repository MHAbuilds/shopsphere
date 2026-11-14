const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

// Dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalCustomers = await User.countDocuments({ role: "customer" });
    const totalOrders = await Order.countDocuments();

    const revenueResult = await Order.aggregate([
      { $match: { orderStatus: { $ne: "Cancelled" } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);

    const lowStockProducts = await Product.countDocuments({
      stock: { $lte: 5 }
    });

    const recentOrders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalProducts,
      totalCustomers,
      totalOrders,
      totalRevenue: revenueResult[0]?.total || 0,
      lowStockProducts,
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all customers
exports.getCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: "customer" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders for admin
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const allowedStatuses = [
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled"
    ];

    if (!allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({
        message: "Invalid order status"
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (["Cancelled", "Delivered"].includes(order.orderStatus)) {
      return res.status(400).json({
        message: "This order cannot be updated"
      });
    }

    if (orderStatus === "Cancelled") {
      for (const item of order.items) {
        await Product.updateOne(
          { _id: item.product },
          { $inc: { stock: item.quantity } }
        );
      }
    }

    order.orderStatus = orderStatus;
    await order.save();

    res.json({
      message: "Order status updated",
      order
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};