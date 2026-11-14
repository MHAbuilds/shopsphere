const express = require("express");
const router = express.Router();

const {
  placeOrder,
  getMyOrders,
  getMyOrderById,
  cancelMyOrder
} = require("../controllers/orderController");

const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.post("/", placeOrder);
router.get("/my-orders", getMyOrders);
router.get("/:id", getMyOrderById);
router.put("/:id/cancel", cancelMyOrder);

module.exports = router;