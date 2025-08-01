import { createRouter, createWebHistory } from 'vue-router'

import LoginPage from '@/views/LoginPage.vue'
import RegisterPage from '@/views/RegisterPage.vue'
import ChecklistPage from '@/views/ChecklistPage.vue'
import ChecklistDetailPage from '@/views/ChecklistDetailPage.vue'
import CreateChecklist from '@/views/CreateChecklist.vue'
import CreateTodoItem from '@/views/CreateTodoItem.vue'
import TodoItemDetailPage from '@/views/TodoItemDetailPage.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/checklists', component: ChecklistPage },
  { path: '/checklists/create', component: CreateChecklist },
  { path: '/checklists/:id', component: ChecklistDetailPage, props: true },
  { path: '/checklists/:id/items/create', component: CreateTodoItem, props: true },
  { path: '/items/:id', component: TodoItemDetailPage, props: true },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const publicPages = ['/login', '/register']
  const authRequired = !publicPages.includes(to.path)

  if (authRequired && !token) {
    return next('/login')
  }

  next()
})

export default router
