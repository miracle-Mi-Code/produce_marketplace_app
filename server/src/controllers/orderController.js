const OrderModel = require('../models/orderModel');

const createOrder = async (req, res, next) => {
  try {
    const buyer_id = req.user.id;
    const { listing_id, quantity, notes } = req.body;

    const order = await OrderModel.create({
      buyer_id,
      listing_id,
      quantity,
      notes
    });

    res.status(201).json({
      message: 'Order placed successfully',
      order
    });
  } catch (err) {
    if (err.message.includes('stock') || err.message.includes('not found') || err.message.includes('available')) {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const buyer_id = req.user.id;
    const orders = await OrderModel.findByBuyer(buyer_id);
    res.json({ orders });
  } catch (err) {
    next(err);
  }
};

const getReceivedOrders = async (req, res, next) => {
  try {
    const farmer_id = req.user.id;
    const orders = await OrderModel.findByFarmer(farmer_id);
    res.json({ orders });
  } catch (err) {
    next(err);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    if (!status) {
      return res.status(400).json({ error: 'Status field is required' });
    }

    const updatedOrder = await OrderModel.updateStatus(id, status, userId, userRole);
    res.json({
      message: `Order status updated to ${status}`,
      order: updatedOrder
    });
  } catch (err) {
    if (err.message.includes('Unauthorized') || err.message.includes('Buyers can only')) {
      return res.status(403).json({ error: err.message });
    }
    if (err.message.includes('not found') || err.message.includes('Invalid order status')) {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getReceivedOrders,
  updateOrderStatus
};
