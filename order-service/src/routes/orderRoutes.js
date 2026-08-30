const express = require("express");

const authenticateToken =
    require("../middleware/authMiddleware");

const {
    createOrder,
    getMyOrders,
    completeOrder
} = require("../controllers/orderController");

const router = express.Router();


// ==========================================
// CREATE ORDER
// ==========================================

router.post(
    "/",
    authenticateToken,
    createOrder
);


// ==========================================
// GET MY ORDERS
// ==========================================

router.get(
    "/my",
    authenticateToken,
    getMyOrders
);


// ==========================================
// COMPLETE ORDER
// ==========================================

router.put(
    "/:id/complete",
    authenticateToken,
    completeOrder
);


module.exports = router;

