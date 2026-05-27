<script setup>
import { ref, onMounted } from 'vue'

const API = 'http://localhost:4000/api/items'
const items = ref([])
const form = ref({ name: '', description: '', price: '' })
const editId = ref(null)

async function load() {
  items.value = await fetch(API).then(r => r.json())
}

async function save() {
  if (editId.value) {
    await fetch(`${API}/${editId.value}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })
    editId.value = null
  } else {
    await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })
  }
  form.value = { name: '', description: '', price: '' }
  load()
}

function startEdit(item) {
  editId.value = item.id
  form.value = { name: item.name, description: item.description, price: item.price }
}

async function remove(id) {
  await fetch(`${API}/${id}`, { method: 'DELETE' })
  load()
}

onMounted(load)
</script>

<template>
  <main>
    <div class="container">
      <h1>🛒 Items Manager</h1>

      <form @submit.prevent="save" class="form">
        <input v-model="form.name" placeholder="Name" required />
        <input v-model="form.description" placeholder="Description" />
        <input v-model="form.price" placeholder="Price" type="number" step="0.01" min="0" />
        <button type="submit">{{ editId ? '✏️ Update' : '➕ Add' }}</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td><strong>{{ item.name }}</strong></td>
            <td>{{ item.description }}</td>
            <td>₱{{ Number(item.price).toFixed(2) }}</td>
            <td>
              <button class="btn-edit" @click="startEdit(item)">Edit</button>
              <button class="btn-delete" @click="remove(item.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

main {
  min-height: 100vh;
  background: #f0f4f8;
  display: flex;
  justify-content: center;
  padding: 40px 16px;
}

.container {
  background: white;
  border-radius: 12px;
  padding: 32px;
  width: 100%;
  max-width: 750px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

h1 {
  font-size: 1.8rem;
  margin-bottom: 24px;
  color: #2d3748;
}

.form {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.form input {
  flex: 1;
  min-width: 120px;
  padding: 10px 12px;
  border: 1px solid #cbd5e0;
  border-radius: 8px;
  font-size: 0.95rem;
  outline: none;
  transition: border 0.2s;
}

.form input:focus {
  border-color: #667eea;
}

.form button {
  padding: 10px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: background 0.2s;
}

.form button:hover {
  background: #5a67d8;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #667eea;
  color: white;
}

th, td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

tbody tr:hover {
  background: #f7fafc;
}

.btn-edit {
  padding: 6px 12px;
  background: #48bb78;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-right: 6px;
  transition: background 0.2s;
}

.btn-edit:hover {
  background: #38a169;
}

.btn-delete {
  padding: 6px 12px;
  background: #fc8181;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-delete:hover {
  background: #e53e3e;
}
</style>