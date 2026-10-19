const Database = require('better-sqlite3');
const path = require('path');
require('dotenv').config();

const dbPath = process.env.DB_PATH || './recipes.db';
const db = new Database(dbPath);

// Create table - Part A: id + 6 fields + timestamps
db.exec(`
  CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    ingredients TEXT NOT NULL,
    instructions TEXT NOT NULL,
    cooking_time INTEGER,
    difficulty TEXT,
    category TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

// Populate 10 records if empty
const count = db.prepare('SELECT COUNT(*) as c FROM recipes').get().c;
if (count === 0) {
  const insert = db.prepare(`
    INSERT INTO recipes (title, ingredients, instructions, cooking_time, difficulty, category)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  
  const samples = [
    ['Nshima with Vegetables','Mealie meal, water, rape, tomatoes','Boil water, add mealie meal and stir until thick, serve with fried vegetables','30','Easy','Zambian'],
    ['Chicken Curry','Chicken, curry powder, onions, tomatoes, oil','Fry onions, add chicken and curry, add tomatoes, simmer 20 mins','45','Medium','Dinner'],
    ['Fried Rice','Rice, eggs, carrots, soy sauce, oil','Cook rice, stir fry carrots, add eggs and soy sauce, mix with rice','25','Easy','Lunch'],
    ['Beef Stew','Beef, potatoes, carrots, spices, oil','Brown beef, add veggies and water, cook until tender','60','Medium','Dinner'],
    ['Kapenta','Kapenta, tomatoes, onions, oil, salt','Fry onions and tomatoes, add washed kapenta, fry 10 mins','20','Easy','Lunch'],
    ['Pancakes','Flour, milk, eggs, sugar, butter','Mix flour milk eggs sugar, fry small portions in butter','15','Easy','Breakfast'],
    ['Village Chicken','Village chicken, salt, oil','Clean chicken, season with salt, grill over fire until cooked','90','Hard','Zambian'],
    ['Spaghetti Bolognese','Spaghetti, minced meat, tomato sauce, onions','Boil spaghetti, cook mince with onions, add sauce, mix','40','Medium','Dinner'],
    ['Vegetable Soup','Mixed veg, salt, water, tomatoes','Chop veg, boil with water and tomatoes until soft','35','Easy','Starter'],
    ['Banana Bread','Bananas, flour, sugar, eggs, baking powder','Mash bananas, mix all ingredients, bake at 180C for 50 mins','70','Medium','Dessert']
  ];
  
  const insertMany = db.transaction((rows) => {
    for (const row of rows) insert.run(...row);
  });
  insertMany(samples);
  console.log('10 sample recipes inserted');
}

module.exports = db;