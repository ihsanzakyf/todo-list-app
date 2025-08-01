<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from '@/stores'

const store = useStore()
const checklists = ref([])
const loading = ref(false)
const error = ref(null)

const fetchData = async () => {
  loading.value = true
  error.value = null
  try {
    const res = await store.getData({ url: '/checklist' })
    checklists.value = res.data.data || []
  } catch (err) {
    error.value = 'Gagal memuat checklist'
  } finally {
    loading.value = false
  }
}

const handleDelete = async (id) => {
  const konfirmasi = confirm('Yakin ingin menghapus checklist ini?')
  if (!konfirmasi) return

  try {
    await store.deleteData({ url: `/checklist/${id}` })
    fetchData()
  } catch (err) {
    const msg = err?.response?.data?.message
    if (msg?.includes('ConstraintViolationException') || msg?.includes('FOREIGN KEY')) {
      alert('Checklist tidak bisa dihapus karena masih memiliki item.')
    } else {
      alert('Gagal menghapus checklist.')
    }
  }
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="container py-5">
    <h2 class="mb-4">Halaman Checklist</h2>

    <div v-if="loading" class="text-muted">Memuat data...</div>
    <div v-else-if="error" class="text-danger">{{ error }}</div>
    <div v-else-if="checklists.length === 0" class="text-muted">Belum ada checklist.</div>

    <ul v-else class="list-group">
      <li v-for="checklist in checklists" :key="checklist.id" class="list-group-item">
        <div class="d-flex justify-content-between align-items-center">
          <strong>{{ checklist.name }}</strong>

          <div class="d-flex gap-2">
            <router-link
              class="btn btn-sm btn-outline-primary rounded-cs"
              :to="`/checklists/${checklist.id}/item`"
            >
              Detail
            </router-link>
            <button
              @click="handleDelete(checklist.id)"
              class="btn btn-sm btn-outline-danger rounded-cs"
            >
              Hapus
            </button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.rounded-cs {
  border-radius: 10px;
}
</style>
