<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/stores'

const store = useStore()
const route = useRoute()

const items = ref([])
const newItemName = ref('')
const loading = ref(false)
const editingItemId = ref(null)
const editItemName = ref('')

const fetchData = async () => {
  try {
    const res = await store.getData({
      url: `/checklist/${route.params.id}/item`,
    })
    items.value = res.data?.data || []
  } catch (err) {
    alert('Gagal memuat detail checklist.')
  }
}

const createItem = async () => {
  if (!newItemName.value.trim()) return alert('Nama item harus diisi.')
  loading.value = true
  try {
    await store.postData({
      url: `/checklist/${route.params.id}/item`,
      paramsg: { itemName: newItemName.value },
    })
    newItemName.value = ''
    await fetchData()
  } catch (err) {
    alert('Gagal menambahkan item.')
  } finally {
    loading.value = false
  }
}

const updateItemStatus = async (checklistId, itemId, status) => {
  try {
    await store.putData({
      url: `/checklist/${checklistId}/item/${itemId}`,
      params: { itemCompletionStatus: status },
    })
    await fetchData()
  } catch (err) {
    alert('Gagal mengubah status item.')
  }
}

const renameItem = async (checklistId, itemId) => {
  if (!editItemName.value.trim()) return alert('Nama tidak boleh kosong')
  try {
    await store.putData({
      url: `/checklist/${checklistId}/item/rename/${itemId}`,
      params: { itemName: editItemName.value },
    })
    editingItemId.value = null
    await fetchData()
  } catch (err) {
    alert('Gagal mengganti nama item.')
  }
}

const deleteItem = async (checklistId, itemId) => {
  if (!confirm('Yakin ingin menghapus item ini?')) return
  try {
    await store.deleteData({
      url: `/checklist/${checklistId}/item/${itemId}`,
    })
    await fetchData()
  } catch (err) {
    alert('Gagal menghapus item.')
  }
}

const startEdit = (item) => {
  editingItemId.value = item.id
  editItemName.value = item.name
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="container py-5">
    <h2 class="mb-4">Detail Item</h2>

    <form @submit.prevent="createItem" class="mb-4">
      <div class="input-group">
        <input
          type="text"
          class="form-control form-control-sm rounded-cs"
          v-model="newItemName"
          placeholder="Nama item baru"
        />
        <button class="btn btn-sm btn-primary rounded-cs" type="submit" :disabled="loading">
          Tambah
        </button>
      </div>
    </form>

    <div v-if="items.length">
      <ul class="list-group">
        <li
          v-for="item in items"
          :key="item.id"
          class="list-group-item d-flex justify-content-between align-items-center"
        >
          <span v-if="editingItemId !== item.id" @click="startEdit(item)" style="cursor: pointer">
            {{ item.name }} -
            <span class="badge" :class="item.itemCompletionStatus ? 'bg-success' : 'bg-danger'">
              {{ item.itemCompletionStatus ? 'Selesai' : 'Belum' }}
            </span>
          </span>

          <span v-else>
            <input
              v-model="editItemName"
              @keyup.enter="renameItem(route.params.id, item.id)"
              @blur="renameItem(route.params.id, item.id)"
              class="form-control d-inline-block"
              style="width: auto; display: inline-block; margin-right: 10px"
            />
            <span class="badge" :class="item.itemCompletionStatus ? 'bg-success' : 'bg-danger'">
              {{ item.itemCompletionStatus ? 'Selesai' : 'Belum' }}
            </span>
          </span>

          <div>
            <router-link
              :to="`/checklists/${route.params.id}/item/${item.id}`"
              class="btn btn-sm btn-outline-primary me-2 rounded-cs"
              >Lihat Detail</router-link
            >

            <button
              class="btn btn-sm btn-outline-success me-2 rounded-cs"
              @click="updateItemStatus(route.params.id, item.id, !item.itemCompletionStatus)"
            >
              {{ item.itemCompletionStatus ? 'Jadikan Belum' : 'Jadikan Selesai' }}
            </button>
            <button
              class="btn btn-sm btn-outline-danger rounded-cs"
              @click="deleteItem(route.params.id, item.id)"
            >
              Hapus
            </button>
          </div>
        </li>
      </ul>
    </div>

    <div v-else>
      <p class="text-muted">Tidak ada item ditemukan.</p>
    </div>
  </div>
</template>

<style scoped>
.rounded-cs {
  border-radius: 10px;
}
</style>
