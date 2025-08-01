<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/stores'

const store = useStore()
const route = useRoute()
const item = ref(null)

onMounted(async () => {
  try {
    const res = await store.getData({ url: `/checklist/item/${route.params.id}` })
    item.value = res.data?.data
  } catch (err) {
    alert('Gagal memuat detail item.')
  }
})
</script>

<template>
  <div class="container py-5">
    <h2>Detail Item</h2>
    <div v-if="item">
      <p><strong>Nama:</strong> {{ item.name }}</p>
      <p><strong>Status:</strong> {{ item.status ? 'Selesai' : 'Belum' }}</p>
    </div>
    <div v-else>Loading...</div>
  </div>
</template>
