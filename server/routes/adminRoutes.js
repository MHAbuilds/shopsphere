const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
  getCustomers,
  getAllOrders,
  updateOrderStatus
} = require("../controllers/adminController");

const {
  protect,
  adminOnly
} = require("../middleware/authMiddleware");

router.use(protect, adminOnly);

router.get("/dashboard", getDashboardStats);
router.get("/customers", getCustomers);
router.get("/orders", getAllOrders);
router.put("/orders/:id/status", updateOrderStatus);

module.exports = router;