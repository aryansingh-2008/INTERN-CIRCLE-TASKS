const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /api/contact - Submit contact form from Portfolio
router.post('/', (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) {
    return res.status(400).json({ error: 'Valid email address is required' });
  }

  if (!message || message.trim().length < 5) {
    return res.status(400).json({ error: 'Message must be at least 5 characters long' });
  }

  const query = `
    INSERT INTO contact_messages (name, email, subject, message)
    VALUES (?, ?, ?, ?)
  `;

  db.run(query, [name.trim(), email.trim(), (subject || '').trim(), message.trim()], function (err) {
    if (err) {
      console.error('Error saving contact message:', err);
      return res.status(500).json({ error: 'Database error saving message' });
    }

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been received.',
      data: {
        id: this.lastID,
        name: name.trim(),
        email: email.trim(),
        subject: (subject || '').trim(),
        message: message.trim(),
        created_at: new Date().toISOString()
      }
    });
  });
});

// GET /api/contact - View all messages
router.get('/', (req, res) => {
  db.all('SELECT * FROM contact_messages ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve messages' });
    }
    res.json({ success: true, count: rows.length, messages: rows });
  });
});

module.exports = router;
