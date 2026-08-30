const pool = require("../config/db");


// ==========================================
// CREATE ORDER
// ==========================================

async function createOrder(userId, totalAmount) {

    const [result] = await pool.query(
        `INSERT INTO orders (user_id, total_amount)
         VALUES (?, ?)`,
        [userId, totalAmount]
    );

    return {
        id: result.insertId,
        user_id: userId,
        total_amount: totalAmount,
        status: "pending"
    };
}


// ==========================================
// GET MY ORDERS
// ==========================================

async function getOrdersByUser(userId) {

    const [rows] = await pool.query(
        `SELECT *
         FROM orders
         WHERE user_id = ?
         ORDER BY created_at DESC`,
        [userId]
    );

    return rows;
}


// ==========================================
// COMPLETE ORDER
// ==========================================

async function completeOrder(
    orderId,
    userId
) {

    const [result] = await pool.query(

        `UPDATE orders
         SET status = 'completed'
         WHERE id = ?
         AND user_id = ?
         AND status = 'pending'`,

        [
            orderId,
            userId
        ]
    );


    if (result.affectedRows === 0) {

        return null;

    }


    const [rows] = await pool.query(

        `SELECT *
         FROM orders
         WHERE id = ?
         AND user_id = ?`,

        [
            orderId,
            userId
        ]
    );


    return rows[0];

}


module.exports = {

    createOrder,

    getOrdersByUser,

    completeOrder

};

