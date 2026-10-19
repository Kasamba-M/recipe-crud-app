const API = 'http://localhost:3000/api/recipes';

async function loadRecipes() {
  try {
    const res = await fetch(API);
    const data = await res.json();
    const table = document.getElementById('recipeTable');
    table.innerHTML = '';
    data.forEach(r => {
      table.innerHTML += `<tr>
        <td>${r.id}</td>
        <td><strong>${r.title}</strong><br><small>${r.ingredients.substring(0,40)}...</small></td>
        <td>${r.cooking_time || '-'}m</td>
        <td>${r.difficulty || '-'}</td>
        <td>${r.category || '-'}</td>
        <td class="actions">
          <button onclick="editRecipe(${r.id})">Edit</button>
          <button onclick="deleteRecipe(${r.id})">Delete</button>
        </td></tr>`;
    });
  } catch (err) {
    console.error('API not reachable. Is backend running?', err);
  }
}

document.getElementById('recipeForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('id').value;
  const payload = {
    title: document.getElementById('title').value,
    ingredients: document.getElementById('ingredients').value,
    instructions: document.getElementById('instructions').value,
    cooking_time: document.getElementById('cooking_time').value ? parseInt(document.getElementById('cooking_time').value) : null,
    difficulty: document.getElementById('difficulty').value,
    category: document.getElementById('category').value
  };
  
  const method = id ? 'PUT' : 'POST';
  const url = id ? `${API}/${id}` : API;
  
  await fetch(url, {
    method,
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(payload)
  });
  
  resetForm();
  loadRecipes();
});

async function editRecipe(id) {
  const res = await fetch(`${API}/${id}`);
  const r = await res.json();
  document.getElementById('id').value = r.id;
  document.getElementById('title').value = r.title;
  document.getElementById('ingredients').value = r.ingredients;
  document.getElementById('instructions').value = r.instructions;
  document.getElementById('cooking_time').value = r.cooking_time;
  document.getElementById('difficulty').value = r.difficulty;
  document.getElementById('category').value = r.category;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function deleteRecipe(id) {
  if (!confirm('Are you sure you want to delete this recipe?')) return;
  await fetch(`${API}/${id}`, { method: 'DELETE' });
  loadRecipes();
}

function resetForm() {
  document.getElementById('recipeForm').reset();
  document.getElementById('id').value = '';
}

// Load on start
loadRecipes();