<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/stores'

const route = useRoute()
const store = useStore()
const itemDetail = ref(null)

const fetchItem = async () => {
  try {
    const res = await store.getData({
      url: `/checklist/${route.params.checklistId}/item/${route.params.itemId}`,
    })
    itemDetail.value = res.data?.data
  } catch (err) {
    alert('Gagal memuat detail item.')
  }
}

onMounted(() => {
  fetchItem()
})
</script>

<template>
  <div class="container py-5">
    <h2>Detail Item</h2>

    <div v-if="itemDetail">
      <p><strong>Nama:</strong> {{ itemDetail.name }}</p>
      <p>
        <strong>Status:</strong>
        <span class="badge" :class="itemDetail.itemCompletionStatus ? 'bg-success' : 'bg-danger'">
          {{ itemDetail.itemCompletionStatus ? 'Selesai' : 'Belum' }}
        </span>
      </p>
    </div>
    <div v-else>
      <p>Memuat detail item...</p>
    </div>
  </div>
</template>
