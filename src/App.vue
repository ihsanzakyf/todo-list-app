<script setup>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const hideLayout = computed(() => {
  return ['/', '/login', '/register'].includes(route.path)
})
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <Header v-if="!hideLayout" />
    <main class="flex-grow-1 py-4">
      <router-view />
    </main>
    <Footer v-if="!hideLayout" />
  </div>
</template>
