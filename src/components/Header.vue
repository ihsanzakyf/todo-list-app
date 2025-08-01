<script setup>
import { useStore } from '@/stores'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const logout = () => {
  store.token = ''
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<template>
  <header class="bg-primary text-white py-3 shadow-sm">
    <div class="container d-flex justify-content-between align-items-center">
      <h4 class="m-0">📝 To-Do App</h4>

      <nav class="d-flex gap-3 align-items-center">
        <router-link to="/checklists" class="text-white text-decoration-none fw-bold"
          >Checklist</router-link
        >
        <router-link to="/checklists/create" class="text-white text-decoration-none fw-bold"
          >Buat Checklist</router-link
        >
        <button class="btn btn-sm btn-light rounded-cs" @click="logout">Logout</button>
      </nav>
    </div>
  </header>
</template>

<style scoped>
nav a.router-link-exact-active {
  text-decoration: underline;
}

.rounded-cs {
  border-radius: 10px;
}
</style>
