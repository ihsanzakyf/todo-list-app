<script setup>
import { ref } from 'vue'
import { useStore } from '@/stores'
import router from '@/router'

const store = useStore()
const username = ref('')
const password = ref('')
const loading = ref(false)
const submitted = ref(false)

const handleLogin = async () => {
  submitted.value = true

  if (!username.value || !password.value) return

  loading.value = true
  try {
    const res = await store.postData({
      url: '/login',
      params: {
        username: username.value,
        password: password.value,
      },
    })

    if (res.data?.statusCode === 2110 && res.data?.data?.token) {
      const token = res.data.data.token
      store.setToken(token)
      await router.push('/checklists')
    } else {
      alert(res.data?.errorMessage || 'Login gagal.')
    }
  } catch (error) {
    const errMsg =
      error?.response?.data?.errorMessage || 'Login gagal. Periksa username atau password.'
    alert(errMsg)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="container min-vh-100 d-flex justify-content-center align-items-center">
    <div class="card rounded-cs shadow p-4" style="min-width: 350px; max-width: 400px; width: 100%">
      <h3 class="text-center mb-4">Login</h3>

      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label class="form-label">Username</label>
          <input
            v-model="username"
            type="text"
            :class="[
              'form-control form-control-sm rounded-cs',
              submitted && !username ? 'is-invalid' : '',
            ]"
            placeholder="Username"
          />
          <div class="invalid-feedback">Username wajib diisi</div>
        </div>

        <div class="mb-3">
          <label class="form-label">Password</label>
          <input
            v-model="password"
            type="password"
            :class="[
              'form-control form-control-sm rounded-cs',
              submitted && !password ? 'is-invalid' : '',
            ]"
            placeholder="Password"
          />
          <div class="invalid-feedback">Password wajib diisi</div>
        </div>

        <!-- <div class="form-check mb-3">
          <input type="checkbox" class="form-check-input" v-model="rememberMe" id="rememberMe" />
          <label class="form-check-label" for="rememberMe">Remember me</label>
        </div> -->

        <button type="submit" class="btn btn-sm btn-primary w-100 rounded-cs" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          Login
        </button>

        <div class="text-center mt-3">
          <small>
            Belum punya akun?
            <router-link to="/register">Daftar di sini</router-link>
          </small>
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
