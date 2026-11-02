const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../../database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
    initTables();
  }
});

function initTables() {
  db.serialize(() => {
    // 1. Contact Messages Table (For Project 01: Portfolio)
    db.run(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT,
        message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Products Table (For Project 05: E-Commerce Store)
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        price REAL NOT NULL,
        rating REAL NOT NULL,
        reviews_count INTEGER DEFAULT 0,
        description TEXT NOT NULL,
        image TEXT NOT NULL,
        badge TEXT,
        stock INTEGER DEFAULT 25
      )
    `, () => {
      seedProductsIfEmpty();
    });

    // 3. Orders Table (For Project 05: E-Commerce Orders)
    db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_number TEXT UNIQUE NOT NULL,
        customer_name TEXT NOT NULL,
        email TEXT NOT NULL,
        address TEXT NOT NULL,
        city TEXT NOT NULL,
        postal_code TEXT NOT NULL,
        total_amount REAL NOT NULL,
        items_json TEXT NOT NULL,
        status TEXT DEFAULT 'Confirmed',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  });
}

function seedProductsIfEmpty() {
  db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
    if (err || row.count > 0) return;

    console.log('Seeding initial products catalogue into database...');
    const seedData = [
      {
        name: 'Ergonomic Mechanical Keyboard',
        category: 'Peripherals',
        price: 89.99,
        rating: 4.9,
        reviews_count: 142,
        description: 'Hot-swappable tactile switches with aluminum top plate and custom low-profile PBT keycaps.',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
        badge: 'Best Seller',
        stock: 18
      },
      {
        name: 'Precision Wireless Coding Mouse',
        category: 'Peripherals',
        price: 49.99,
        rating: 4.8,
        reviews_count: 98,
        description: 'Multi-device pairing, infinite hyper-fast scroll wheel, and ergonomic thumb rest for 12hr sessions.',
        image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80',
        badge: 'Staff Pick',
        stock: 24
      },
      {
        name: 'Ultra-Clear 4K USB-C Hub',
        category: 'Hardware',
        price: 39.50,
        rating: 4.7,
        reviews_count: 67,
        description: '7-in-1 multi-port adapter: 4K 60Hz HDMI, 100W Power Delivery, SD/TF reader, and dual USB 3.0.',
        image: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=600&q=80',
        badge: 'Top Value',
        stock: 35
      },
      {
        name: 'Designing Data-Intensive Applications',
        category: 'Books',
        price: 44.95,
        rating: 5.0,
        reviews_count: 310,
        description: 'The definitive guide to distributed architectures, reliability, scalability, and maintainable systems by Martin Kleppmann.',
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
        badge: 'Must Read',
        stock: 15
      },
      {
        name: 'ANC Studio Monitor Headphones',
        category: 'Audio',
        price: 129.00,
        rating: 4.9,
        reviews_count: 84,
        description: 'Active noise cancelling wireless headphones with 40-hour battery life and neutral sound curve.',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
        badge: 'Premium',
        stock: 12
      },
      {
        name: 'Clean Code: Handbook of Agile Craftsmanship',
        category: 'Books',
        price: 38.00,
        rating: 4.8,
        reviews_count: 220,
        description: 'Robert C. Martin introduces the revolutionary paradigm for writing readable, maintainable software.',
        image: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?auto=format&fit=crop&w=600&q=80',
        badge: 'Classic',
        stock: 20
      },
      {
        name: 'Minimalist Desk Mat (900x400mm)',
        category: 'Accessories',
        price: 24.99,
        rating: 4.7,
        reviews_count: 115,
        description: 'Water-resistant micro-woven cloth surface with anti-fray stitched edges and natural rubber grip base.',
        image: 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?auto=format&fit=crop&w=600&q=80',
        badge: null,
        stock: 40
      },
      {
        name: 'Monitor Light Bar with Wireless Dial',
        category: 'Hardware',
        price: 59.99,
        rating: 4.8,
        reviews_count: 73,
        description: 'Asymmetric optical glare-free screen lamp with auto-dimming ambient light sensor and color temperature control.',
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
        badge: 'Popular',
        stock: 14
      }
    ];

    const stmt = db.prepare(`
      INSERT INTO products (name, category, price, rating, reviews_count, description, image, badge, stock)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    seedData.forEach((p) => {
      stmt.run(p.name, p.category, p.price, p.rating, p.reviews_count, p.description, p.image, p.badge, p.stock);
    });

    stmt.finalize();
    console.log('Seeded 8 initial products.');
  });
}

module.exports = db;
