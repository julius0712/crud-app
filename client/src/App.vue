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
            <td>{{ item.name }}</td>
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
  width: 100vw;
  background: #0f172a;
  display: flex;
  justify-content: center;
  padding: 40px 16px;
}

.container {
  background: #1e293b;
  border-radius: 16px;
  padding: 32px;
  width: 100%;
  max-width: 900px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  height: fit-content;
}

h1 {
  font-size: 1.8rem;
  margin-bottom: 24px;
  color: #f1f5f9;
  letter-spacing: 0.5px;
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
  padding: 10px 14px;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #f1f5f9;
  outline: none;
  transition: border 0.2s;
}

.form input::placeholder {
  color: #64748b;
}

.form input:focus {
  border-color: #3b82f6;
}

.form button {
  padding: 10px 20px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  transition: background 0.2s;
}

.form button:hover {
  background: #2563eb;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #0f172a;
}

th {
  padding: 12px 16px;
  text-align: left;
  color: #94a3b8;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

td {
  padding: 14px 16px;
  text-align: left;
  border-bottom: 1px solid #1e293b;
  color: #e2e8f0;
}

tbody tr {
  background: #0f172a;
  transition: background 0.2s;
}

tbody tr:hover {
  background: #1e3a5f;
}

.btn-edit {
  padding: 6px 14px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-right: 6px;
  font-weight: 600;
  transition: background 0.2s;
}

.btn-edit:hover {
  background: #059669;
}

.btn-delete {
  padding: 6px 14px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}

.btn-delete:hover {
  background: #dc2626;
}
</style>