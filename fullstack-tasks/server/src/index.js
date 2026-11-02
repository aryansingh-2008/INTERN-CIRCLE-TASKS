const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const db = require('./db');
const contactRoutes = require('./routes/contact');
const productsRoutes = require('./routes/products');
const ordersRoutes = require('./routes/orders');
const weatherRoutes = require('./routes/weather');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// API Health Check
app.get('/api/health', (req, res) => {
  db.get('SELECT COUNT(*) as msgCount FROM contact_messages', (err, msgRow) => {
    db.get('SELECT COUNT(*) as orderCount FROM orders', (err2, orderRow) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: 'SQLite 3 (Connected)',
        contact_messages_count: msgRow ? msgRow.msgCount : 0,
        orders_count: orderRow ? orderRow.orderCount : 0
      });
    });
  });
});

// Mount Routes
app.use('/api/contact', contactRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/weather', weatherRoutes);

// Serve built React client in production
const clientDistPath = path.resolve(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send('API Server is running. Frontend dev server is on port 3000/5173.');
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(` ScamShield Full-Stack Backend API running on port ${PORT}`);
  console.log(` Local:   http://localhost:${PORT}`);
  console.log(` Network: http://192.168.0.132:${PORT}`);
  console.log(` Health:  http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);
});
