const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /api/orders - Submit e-commerce order
router.post('/', (req, res) => {
  const { customer_name, email, address, city, postal_code, items, total_amount } = req.body;

  if (!customer_name || !customer_name.trim()) {
    return res.status(400).json({ error: 'Customer name is required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  if (!address || !address.trim() || !city || !city.trim() || !postal_code || !postal_code.trim()) {
    return res.status(400).json({ error: 'Complete shipping address is required' });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Cart must contain at least one item' });
  }

  const parsedTotal = parseFloat(total_amount);
  if (isNaN(parsedTotal) || parsedTotal <= 0) {
    return res.status(400).json({ error: 'Valid order total is required' });
  }

  const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
  const itemsJson = JSON.stringify(items);

  const query = `
    INSERT INTO orders (order_number, customer_name, email, address, city, postal_code, total_amount, items_json, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Confirmed')
  `;

  db.run(
    query,
    [orderNumber, customer_name.trim(), email.trim(), address.trim(), city.trim(), postal_code.trim(), parsedTotal, itemsJson],
    function (err) {
      if (err) {
        console.error('Error saving order:', err);
        return res.status(500).json({ error: 'Failed to record order' });
      }

      res.status(201).json({
        success: true,
        message: 'Order placed successfully!',
        order: {
          id: this.lastID,
          order_number: orderNumber,
          customer_name: customer_name.trim(),
          email: email.trim(),
          address: `${address.trim()}, ${city.trim()} ${postal_code.trim()}`,
          total_amount: parsedTotal,
          items_count: items.length,
          status: 'Confirmed',
          created_at: new Date().toISOString()
        }
      });
    }
  );
});

// GET /api/orders - Get recent orders
router.get('/', (req, res) => {
  db.all('SELECT * FROM orders ORDER BY created_at DESC LIMIT 50', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    const formatted = rows.map((r) => ({
      ...r,
      items: JSON.parse(r.items_json || '[]')
    }));
    res.json({ success: true, count: formatted.length, orders: formatted });
  });
});

module.exports = router;
