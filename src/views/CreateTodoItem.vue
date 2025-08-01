<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from '@/stores'

const store = useStore()
const route = useRoute()
const router = useRouter()
const itemName = ref('')
const submitted = ref(false)
const loading = ref(false)

const handleSubmit = async () => {
  submitted.value = true
  if (!itemName.value) return

  loading.value = true
  try {
    await store.postData({
      url: `/checklist/${route.params.id}/item`,
      params: { itemName: itemName.value },
    })
    router.push(`/checklists/${route.params.id}`)
  } catch (err) {
    alert('Gagal membuat item.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="container py-5">
    <h2>Buat Item Checklist</h2>
    <form @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label>Nama Item</label>
        <input
          v-model="itemName"
          class="form-control"
          :class="{ 'is-invalid': submitted && !itemName }"
          placeholder="Contoh: Beli susu"
        />
        <div class="invalid-feedback">Nama item wajib diisi.</div>
      </div>
      <button class="btn btn-success" :disabled="loading">
        <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
        Tambah
      </button>
    </form>
  </div>
</template>
