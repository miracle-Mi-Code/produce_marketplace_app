const { query, isPgConnected, mockStore, pool } = require('../config/db');
const ListingModel = require('./listingModel');

class OrderModel {
  static async create({ buyer_id, listing_id, quantity, notes }) {
    const qty = parseFloat(quantity);
    const listing = await ListingModel.findById(listing_id);

    if (!listing) {
      throw new Error('Listing not found');
    }

    if (listing.status !== 'available') {
      throw new Error('This listing is no longer available for orders');
    }

    const availableQty = parseFloat(listing.quantity);
    if (qty <= 0) {
      throw new Error('Order quantity must be greater than zero');
    }

    if (qty > availableQty) {
      throw new Error(`Requested quantity (${qty} ${listing.unit}) exceeds available stock (${availableQty} ${listing.unit})`);
    }

    const unitPriceSnapshot = parseFloat(listing.price_per_unit);
    const totalPrice = unitPriceSnapshot * qty;
    const farmerId = listing.farmer_id;

    if (isPgConnected()) {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');

        // Create Order
        const insertOrderSql = `
          INSERT INTO orders (buyer_id, listing_id, farmer_id, quantity, unit_price_snapshot, total_price, status, notes)
          VALUES ($1, $2, $3, $4, $5, $6, 'pending', $7)
          RETURNING *
        `;
        const orderRes = await client.query(insertOrderSql, [
          buyer_id, listing_id, farmerId, qty, unitPriceSnapshot, totalPrice, notes || null
        ]);

        // Deduct Stock
        const remainingQty = availableQty - qty;
        const newStatus = remainingQty <= 0 ? 'sold_out' : 'available';

        const updateListingSql = `
          UPDATE listings
          SET quantity = $1, status = $2
          WHERE id = $3
        `;
        await client.query(updateListingSql, [remainingQty, newStatus, listing_id]);

        await client.query('COMMIT');
        return orderRes.rows[0];
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
    }

    // Fallback Mock Store logic
    const remainingQty = availableQty - qty;
    listing.quantity = remainingQty;
    if (remainingQty <= 0) {
      listing.status = 'sold_out';
    }

    const newOrder = {
      id: mockStore.orders.length + 1,
      buyer_id: parseInt(buyer_id),
      listing_id: parseInt(listing_id),
      farmer_id: parseInt(farmerId),
      quantity: qty,
      unit_price_snapshot: unitPriceSnapshot,
      total_price: totalPrice,
      status: 'pending',
      notes: notes || '',
      created_at: new Date(),
      updated_at: new Date()
    };
    mockStore.orders.unshift(newOrder);
    return newOrder;
  }

  static async findByBuyer(buyer_id) {
    if (isPgConnected()) {
      const sql = `
        SELECT o.*,
               l.produce_name, l.unit, l.photo_url, l.location as listing_location,
               f.name as farmer_name, f.phone as farmer_phone, f.email as farmer_email
        FROM orders o
        JOIN listings l ON o.listing_id = l.id
        JOIN users f ON o.farmer_id = f.id
        WHERE o.buyer_id = $1
        ORDER BY o.created_at DESC
      `;
      const res = await query(sql, [buyer_id]);
      return res.rows;
    }

    return mockStore.orders
      .filter(o => o.buyer_id === parseInt(buyer_id))
      .map(o => {
        const listing = mockStore.listings.find(l => l.id === o.listing_id);
        const farmer = mockStore.users.find(u => u.id === o.farmer_id);
        return {
          ...o,
          produce_name: listing ? listing.produce_name : 'Produce Item',
          unit: listing ? listing.unit : 'unit',
          photo_url: listing ? listing.photo_url : null,
          listing_location: listing ? listing.location : '',
          farmer_name: farmer ? farmer.name : 'Farmer',
          farmer_phone: farmer ? farmer.phone : '',
          farmer_email: farmer ? farmer.email : ''
        };
      })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  static async findByFarmer(farmer_id) {
    if (isPgConnected()) {
      const sql = `
        SELECT o.*,
               l.produce_name, l.unit, l.photo_url, l.location as listing_location,
               b.name as buyer_name, b.phone as buyer_phone, b.email as buyer_email, b.state as buyer_state, b.lga as buyer_lga
        FROM orders o
        JOIN listings l ON o.listing_id = l.id
        JOIN users b ON o.buyer_id = b.id
        WHERE o.farmer_id = $1
        ORDER BY o.created_at DESC
      `;
      const res = await query(sql, [farmer_id]);
      return res.rows;
    }

    return mockStore.orders
      .filter(o => o.farmer_id === parseInt(farmer_id))
      .map(o => {
        const listing = mockStore.listings.find(l => l.id === o.listing_id);
        const buyer = mockStore.users.find(u => u.id === o.buyer_id);
        return {
          ...o,
          produce_name: listing ? listing.produce_name : 'Produce Item',
          unit: listing ? listing.unit : 'unit',
          photo_url: listing ? listing.photo_url : null,
          listing_location: listing ? listing.location : '',
          buyer_name: buyer ? buyer.name : 'Buyer',
          buyer_phone: buyer ? buyer.phone : '',
          buyer_email: buyer ? buyer.email : '',
          buyer_state: buyer ? buyer.state : '',
          buyer_lga: buyer ? buyer.lga : ''
        };
      })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  static async findById(id) {
    if (isPgConnected()) {
      const sql = `SELECT * FROM orders WHERE id = $1`;
      const res = await query(sql, [id]);
      return res.rows[0] || null;
    }

    return mockStore.orders.find(o => o.id === parseInt(id)) || null;
  }

  static async updateStatus(id, newStatus, userId, userRole) {
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(newStatus)) {
      throw new Error(`Invalid order status: ${newStatus}`);
    }

    const order = await this.findById(id);
    if (!order) {
      throw new Error('Order not found');
    }

    // Permission check: Farmer owning listing OR Buyer placing order can manage/cancel
    const isFarmer = order.farmer_id === parseInt(userId);
    const isBuyer = order.buyer_id === parseInt(userId);

    if (!isFarmer && !isBuyer) {
      throw new Error('Unauthorized to update this order');
    }

    // Buyer can only cancel pending orders
    if (isBuyer && !isFarmer) {
      if (newStatus !== 'cancelled') {
        throw new Error('Buyers can only cancel pending orders');
      }
      if (order.status !== 'pending') {
        throw new Error('Order can no longer be cancelled by buyer as it is processed');
      }
    }

    const previousStatus = order.status;

    if (isPgConnected()) {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');

        const updateOrderSql = `
          UPDATE orders
          SET status = $1, updated_at = CURRENT_TIMESTAMP
          WHERE id = $2
          RETURNING *
        `;
        const res = await client.query(updateOrderSql, [newStatus, id]);
        const updatedOrder = res.rows[0];

        // Restore stock if cancelled
        if (newStatus === 'cancelled' && previousStatus !== 'cancelled') {
          const restoreStockSql = `
            UPDATE listings
            SET quantity = quantity + $1,
                status = CASE WHEN status = 'sold_out' THEN 'available' ELSE status END
            WHERE id = $2
          `;
          await client.query(restoreStockSql, [order.quantity, order.listing_id]);
        }

        await client.query('COMMIT');
        return updatedOrder;
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
    }

    // Mock Store update
    order.status = newStatus;
    order.updated_at = new Date();

    if (newStatus === 'cancelled' && previousStatus !== 'cancelled') {
      const listing = mockStore.listings.find(l => l.id === order.listing_id);
      if (listing) {
        listing.quantity = parseFloat(listing.quantity) + parseFloat(order.quantity);
        if (listing.status === 'sold_out') {
          listing.status = 'available';
        }
      }
    }

    return order;
  }
}

module.exports = OrderModel;
