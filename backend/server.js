require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// GET /api/recipes -> List all records
app.get('/api/recipes', (req, res) => {
  const recipes = db.prepare('SELECT * FROM recipes ORDER BY id DESC').all();
  res.json(recipes);
});

// GET /api/recipes/:id -> Get one record
app.get('/api/recipes/:id', (req, res) => {
  const recipe = db.prepare('SELECT * FROM recipes WHERE id = ?').get(req.params.id);
  if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
  res.json(recipe);
});

// POST /api/recipes -> Create a record
app.post('/api/recipes', (req, res) => {
  const { title, ingredients, instructions, cooking_time, difficulty, category } = req.body;
  if (!title || !ingredients || !instructions) {
    return res.status(400).json({ error: 'title, ingredients, instructions are required' });
  }
  const result = db.prepare(`
    INSERT INTO recipes (title, ingredients, instructions, cooking_time, difficulty, category)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(title, ingredients, instructions, cooking_time, difficulty, category);
  
  const newRecipe = db.prepare('SELECT * FROM recipes WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(newRecipe);
});

// PUT /api/recipes/:id -> Update a record
app.put('/api/recipes/:id', (req, res) => {
  const { title, ingredients, instructions, cooking_time, difficulty, category } = req.body;
  const result = db.prepare(`
    UPDATE recipes SET title=?, ingredients=?, instructions=?, cooking_time=?, difficulty=?, category=?, updated_at=CURRENT_TIMESTAMP
    WHERE id=?
  `).run(title, ingredients, instructions, cooking_time, difficulty, category, req.params.id);
  
  if (result.changes === 0) return res.status(404).json({ error: 'Recipe not found' });
  const updated = db.prepare('SELECT * FROM recipes WHERE id = ?').get(req.params.id);
  res.json(updated);
});

// DELETE /api/recipes/:id -> Delete a record
app.delete('/api/recipes/:id', (req, res) => {
  const result = db.prepare('DELETE FROM recipes WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Recipe not found' });
  res.json({ message: 'Deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
  console.log(`Try: http://localhost:${PORT}/api/recipes`);
});