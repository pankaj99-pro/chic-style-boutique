const Order = require('../models/Order');

/**
 * Create a new order
 * POST /api/orders
 */
const createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,      // 'stripe' | 'cod' | 'razorpay'     // 'paid' | 'pending'
      subtotal,
      shippingCost,
      tax,
      total,
      orderId   // use this for Stripe OR Razorpay order id
    } = req.body;

    // 1️⃣ Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item'
      });
    }

    // 2️⃣ Validate shipping address
    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.address
    ) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address is required'
      });
    }

    // 3️⃣ Validate payment method
    if (!paymentMethod || !['stripe', 'cod', 'razorpay'].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Valid payment method is required'
      });
    }

    // 4️⃣ Prevent duplicate online orders (Stripe / Razorpay)
    if (orderId && paymentMethod !== 'cod') {
      const existingOrder = await Order.findOne({ orderId });
      if (existingOrder) {
        return res.status(200).json({
          success: true,
          message: 'Order already exists',
          data: existingOrder
        });
      }
    }

    // 5️⃣ Decide paymentStatus
    let finalPaymentStatus = 'pending';
    if (paymentMethod === 'cod') {
      finalPaymentStatus = 'pending';
    } else {
      finalPaymentStatus = 'paid';
    }

    console.log(finalPaymentStatus);

    // 6️⃣ Decide orderStatus
    let finalOrderStatus = 'confirmed';

    // 7️⃣ Create order
    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      paymentStatus: finalPaymentStatus,
      orderStatus: finalOrderStatus,
      subtotal,
      shippingCost,
      tax,
      total,
      stripeSessionId : orderId, // store Razorpay orderId here also
      currency: 'INR'
    });

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order
    });

  } catch (error) {
    console.error('Create order error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

/**
 * Get user's orders
 * GET /api/orders
 */
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

/**
 * Get single order by ID
 * GET /api/orders/:id
 */
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    }).lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
};

/**
 * Admin: Get all orders
 * GET /api/admin/orders
 */
const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (status && status !== 'all') {
      query.orderStatus = status;
    }

    const orders = await Order.find(query)
      .populate('user', 'email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

/**
 * Admin: Update order status
 * PUT /api/admin/orders/:id/status
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    
    const updateFields = {};
    if (orderStatus) updateFields.orderStatus = orderStatus;
    if (paymentStatus) updateFields.paymentStatus = paymentStatus;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    ).populate('user', 'email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order',
      error: error.message
    });
  }
};

/**
 * Admin: Get order statistics
 * GET /api/admin/orders/stats
 */
const getOrderStats = async (req, res) => {
  try {
    const [
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      codOrders,
      stripeOrders
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ orderStatus: 'pending' }),
      Order.countDocuments({ orderStatus: 'processing' }),
      Order.countDocuments({ orderStatus: 'shipped' }),
      Order.countDocuments({ orderStatus: 'delivered' }),
      Order.countDocuments({ paymentMethod: 'cod' }),
      Order.countDocuments({ paymentMethod: 'stripe' })
    ]);

    // Calculate total revenue
    const revenueResult = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } }
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    res.json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        codOrders,
        stripeOrders,
        totalRevenue
      }
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order statistics',
      error: error.message
    });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getOrderStats
};
