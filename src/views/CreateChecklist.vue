<script setup>
import { ref } from 'vue'
import { useStore } from '@/stores'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const checklistName = ref('')
const submitted = ref(false)
const loading = ref(false)
const error = ref(null)

const handleSubmit = async () => {
  submitted.value = true
  if (!checklistName.value) return

  loading.value = true
  error.value = null

  try {
    const res = await store.postData({
      url: '/checklist',
      params: {
        name: checklistName.value,
      },
    })

    if (res.data?.statusCode === 2000) {
      router.push('/checklists')
    } else {
      error.value = res.data?.errorMessage || 'Gagal membuat checklist.'
    }
  } catch (err) {
    error.value = err?.response?.data?.errorMessage || 'Terjadi kesalahan saat menyimpan data.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="container py-5">
    <h2 class="mb-4">Buat Checklist Baru</h2>

    <form @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label class="form-label">Nama Checklist</label>
        <input
          v-model="checklistName"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': submitted && !checklistName }"
          placeholder="Masukkan nama checklist"
        />
        <div class="invalid-feedback">Nama checklist wajib diisi</div>
      </div>

      <div v-if="error" class="alert alert-danger">{{ error }}</div>

      <button type="submit" class="btn btn-primary" :disabled="loading">
        <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
        Simpan Checklist
      </button>
    </form>
  </div>
</template>
