<script setup>
import { ref } from 'vue'
import { useStore } from '@/stores'
import router from '@/router'

const store = useStore()
const username = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const submitted = ref(false)

const handleRegister = async () => {
  submitted.value = true

  if (!username.value || !email.value || !password.value) {
    return
  }

  loading.value = true
  try {
    const res = await store.postData({
      url: '/register',
      params: {
        username: username.value,
        email: email.value,
        password: password.value,
      },
    })

    if (res.data?.statusCode === 2000) {
      alert('Registrasi berhasil, silakan login.')
      router.push('/login')
    } else {
      alert(res.data?.errorMessage || 'Registrasi gagal.')
    }
  } catch (err) {
    const errMsg = err?.response?.data?.errorMessage || 'Terjadi kesalahan saat mendaftar.'
    alert(errMsg)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="container min-vh-100 d-flex justify-content-center align-items-center">
    <div
      class="card rounded-cs shadow-sm p-4"
      style="min-width: 350px; max-width: 400px; width: 100%"
    >
      <h3 class="text-center mb-4">Register</h3>

      <form @submit.prevent="handleRegister" novalidate>
        <div class="mb-3">
          <label class="form-label">Username</label>
          <input
            v-model="username"
            type="text"
            :class="[
              'form-control',
              'form-control-sm',
              'rounded-cs',
              submitted && !username ? 'is-invalid' : '',
            ]"
            placeholder="Username"
          />
          <div class="invalid-feedback">Username wajib diisi</div>
        </div>

        <div class="mb-3">
          <label class="form-label">Email</label>
          <input
            v-model="email"
            type="email"
            :class="[
              'form-control',
              'form-control-sm',
              'rounded-cs',
              submitted && !email ? 'is-invalid' : '',
            ]"
            placeholder="Email"
          />
          <div class="invalid-feedback">Email wajib diisi</div>
        </div>

        <div class="mb-3">
          <label class="form-label">Password</label>
          <input
            v-model="password"
            type="password"
            :class="[
              'form-control',
              'form-control-sm',
              'rounded-cs',
              submitted && !password ? 'is-invalid' : '',
            ]"
            placeholder="Password"
          />
          <div class="invalid-feedback">Password wajib diisi</div>
        </div>

        <button type="submit" class="btn btn-sm btn-success w-100 rounded-cs" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          Register
        </button>

        <div class="text-center mt-3">
          <small>Sudah punya akun? <router-link to="/login">Login</router-link></small>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.rounded-cs {
  border-radius: 10px;
}
</style>
