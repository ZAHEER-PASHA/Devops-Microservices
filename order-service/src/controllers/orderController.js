const orderService =
    require("../services/orderService");


// ==========================================
// CREATE ORDER
// ==========================================

async function createOrder(req, res) {

    try {

        const userId =
            req.user.userId;

        const {
            total_amount
        } = req.body;


        if (
            total_amount === undefined ||
            total_amount <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "total_amount must be greater than 0"

            });

        }


        const order =
            await orderService.createOrder(
                userId,
                total_amount
            );


        res.status(201).json({

            success: true,

            message:
                "Order created successfully",

            order

        });


    } catch (error) {

        console.error(
            "Create order error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to create order"

        });

    }

}


// ==========================================
// GET MY ORDERS
// ==========================================

async function getMyOrders(req, res) {

    try {

        const userId =
            req.user.userId;


        const orders =
            await orderService
                .getOrdersByUser(userId);


        res.json({

            success: true,

            orders

        });


    } catch (error) {

        console.error(
            "Get orders error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to get orders"

        });

    }

}


// ==========================================
// COMPLETE ORDER
// ==========================================

async function completeOrder(req, res) {

    try {

        const userId =
            req.user.userId;

        const orderId =
            Number(req.params.id);


        if (
            !Number.isInteger(orderId) ||
            orderId <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid order ID"

            });

        }


        const order =
            await orderService.completeOrder(
                orderId,
                userId
            );


        if (!order) {

            return res.status(404).json({

                success: false,

                message:
                    "Order not found or already completed"

            });

        }


        res.json({

            success: true,

            message:
                "Order completed successfully",

            order

        });


    } catch (error) {

        console.error(
            "Complete order error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to complete order"

        });

    }

}


module.exports = {

    createOrder,

    getMyOrders,

    completeOrder

};

