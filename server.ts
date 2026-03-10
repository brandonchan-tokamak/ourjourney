import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database('renovation.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    title TEXT,
    content TEXT NOT NULL,
    room TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS contributions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    person TEXT NOT NULL,
    amount REAL DEFAULT 0,
    month TEXT NOT NULL,
    notes TEXT
  );

  CREATE TABLE IF NOT EXISTS furniture (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    url TEXT,
    image_url TEXT,
    notes TEXT,
    room TEXT,
    price REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

try {
  db.exec('ALTER TABLE furniture ADD COLUMN price REAL DEFAULT 0');
} catch (e) {
  // Ignore if column already exists
}

const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use('/uploads', express.static(UPLOADS_DIR));

  // API Routes
  app.get('/api/items', (req, res) => {
    const { room } = req.query;
    let query = 'SELECT * FROM items ORDER BY created_at DESC';
    let params: any[] = [];
    if (room && room !== 'All') {
      query = 'SELECT * FROM items WHERE room = ? ORDER BY created_at DESC';
      params.push(room);
    }
    const items = db.prepare(query).all(...params);
    res.json(items);
  });

  app.post('/api/items', (req, res) => {
    const { type, title, content, room } = req.body;
    const stmt = db.prepare('INSERT INTO items (type, title, content, room) VALUES (?, ?, ?, ?)');
    const info = stmt.run(type, title, content, room);
    res.json({ id: info.lastInsertRowid });
  });

  app.delete('/api/items/:id', (req, res) => {
    const stmt = db.prepare('DELETE FROM items WHERE id = ?');
    stmt.run(req.params.id);
    res.json({ success: true });
  });

  app.post('/api/upload', (req, res) => {
    const { filename, data } = req.body;
    const base64Data = data.replace(/^data:image\/\w+;base64,/, "");
    const uniqueFilename = Date.now() + '-' + filename;
    const filepath = path.join(UPLOADS_DIR, uniqueFilename);
    fs.writeFileSync(filepath, base64Data, 'base64');
    res.json({ url: `/uploads/${uniqueFilename}` });
  });

  app.get('/api/contributions', (req, res) => {
    const items = db.prepare('SELECT * FROM contributions ORDER BY month DESC').all();
    res.json(items);
  });

  app.post('/api/contributions', (req, res) => {
    const { person, amount, month, notes } = req.body;
    const stmt = db.prepare('INSERT INTO contributions (person, amount, month, notes) VALUES (?, ?, ?, ?)');
    const info = stmt.run(person, amount, month, notes);
    res.json({ id: info.lastInsertRowid });
  });

  app.put('/api/contributions/:id', (req, res) => {
    const { person, amount, month, notes } = req.body;
    const stmt = db.prepare('UPDATE contributions SET person = ?, amount = ?, month = ?, notes = ? WHERE id = ?');
    stmt.run(person, amount, month, notes, req.params.id);
    res.json({ success: true });
  });

  app.delete('/api/contributions/:id', (req, res) => {
    const stmt = db.prepare('DELETE FROM contributions WHERE id = ?');
    stmt.run(req.params.id);
    res.json({ success: true });
  });

  app.get('/api/furniture', (req, res) => {
    const { room } = req.query;
    let query = 'SELECT * FROM furniture ORDER BY created_at DESC';
    let params: any[] = [];
    if (room && room !== 'All') {
      query = 'SELECT * FROM furniture WHERE room = ? ORDER BY created_at DESC';
      params.push(room);
    }
    const items = db.prepare(query).all(...params);
    res.json(items);
  });

  app.post('/api/furniture', (req, res) => {
    const { title, url, image_url, notes, room, price } = req.body;
    const stmt = db.prepare('INSERT INTO furniture (title, url, image_url, notes, room, price) VALUES (?, ?, ?, ?, ?, ?)');
    const info = stmt.run(title, url, image_url, notes, room, price || 0);
    res.json({ id: info.lastInsertRowid });
  });

  app.delete('/api/furniture/:id', (req, res) => {
    const stmt = db.prepare('DELETE FROM furniture WHERE id = ?');
    stmt.run(req.params.id);
    res.json({ success: true });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
