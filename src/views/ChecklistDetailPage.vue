<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/stores'

const store = useStore()
const route = useRoute()
const checklist = ref(null)

const fetchData = async () => {
  try {
    const res = await store.getData({ url: `/checklist/${route.params.id}` })
    checklist.value = res.data?.data
  } catch (err) {
    alert('Gagal memuat detail checklist.')
  }
}

onMounted(fetchData)
</script>

<template>
  <div class="container py-5">
    <h2 class="mb-4">Detail Checklist</h2>

    <div v-if="checklist">
      <h5>Nama Checklist:</h5>
      <p>{{ checklist.name }}</p>

      <h6>Status Selesai:</h6>
      <p>{{ checklist.checklistCompletionStatus ? 'Selesai' : 'Belum selesai' }}</p>

      <div v-if="checklist.items && checklist.items.length">
        <h6>Item:</h6>
        <ul>
          <li v-for="item in checklist.items" :key="item.id">
            {{ item.name }} - {{ item.itemCompletionStatus ? 'Selesai' : 'Belum' }}
          </li>
        </ul>
      </div>
    </div>
    <div v-else>
      <p>Memuat data checklist...</p>
    </div>
  </div>
</template>
