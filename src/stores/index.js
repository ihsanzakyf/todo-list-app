import { defineStore } from 'pinia'
import router from '../router'
import axios from 'axios'

export const useStore = defineStore('main', {
  state: () => ({
    token: localStorage.getItem('token') || sessionStorage.getItem('token'),
    profile: (() => {
      const profileData = localStorage.getItem('profile') || sessionStorage.getItem('profile')
      try {
        return profileData ? JSON.parse(profileData) : null
      } catch {
        return null
      }
    })(),
    baseUrl: 'http://94.74.86.174:8080/api',
  }),

  actions: {
    async getData({ url, config }) {
      const endpoint = this.baseUrl + url
      const options = {
        ...this.getAuthHeaders(),
        ...config,
      }

      try {
        return await axios.get(endpoint, options)
      } catch (error) {
        this.handleError(error)
        throw error
      }
    },

    async postData({ url, params }, config = {}) {
      const endpoint = this.baseUrl + url
      const payload = params
      let options = config
      options.headers = {
        ...options.headers,
        ...this.getAuthHeaders().headers,
      }

      try {
        return await axios.post(endpoint, payload, options)
      } catch (error) {
        this.handleError(error)
        throw error
      }
    },

    async putData({ url, params }) {
      const endpoint = this.baseUrl + url
      const options = this.getAuthHeaders()
      try {
        return await axios.put(endpoint, params, options)
      } catch (error) {
        this.handleError(error)
        throw error
      }
    },

    async deleteData({ url, config }) {
      const _url = this.baseUrl + url
      const _config = {
        ...this.getAuthHeaders(),
        ...config,
      }

      try {
        return await axios.delete(_url, _config)
      } catch (error) {
        this.handleError(error)
        throw error
      }
    },

    getAuthHeaders() {
      return {
        headers: {
          Authorization: 'Bearer ' + this.token,
        },
      }
    },

    handleError(error) {
      if (error.response && error.response.status === 401) {
        this.logout()
      } else {
        console.error('API Error:', error)
      }
    },

    setUser(user) {
      this.profile = user
      const data = JSON.stringify(user)
      localStorage.setItem('profile', data)
    },

    setToken(token) {
      this.token = token
      localStorage.setItem('token', token)
    },

    logout() {
      this.clearUserData()
      router.push('/auth/login')
    },

    clearUserData() {
      this.token = null
      this.profile = null
      localStorage.removeItem('token')
      localStorage.removeItem('profile')
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('profile')
    },
  },
})
