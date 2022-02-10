// stores/counter.js
import { defineStore } from 'pinia'
import { supabase } from '@/utils/supabase'

export const useSupaAuth = defineStore('auth', {
  state: () => ({
    user: null,
    errMsg: null,
    loading: false
  }),
  actions: {
    async login(email, password) {
      try {
        this.loading = true
        const { data } = await supabase.auth.signIn({ email, password })
        if (data) this.user = data
        this.errMsg = null
      } catch (err) {
        this.errMsg = err.message
      } finally {
        this.loading = false
      }
    },
    async register(email, password) {
      try {
        this.loading = true
        const { data } = await supabase.auth.signUp({ email, password })
        this.user = data
        this.errMsg = null
      } catch (err) {
        this.errMsg = err.message
      } finally {
        this.loading = false
      }
    },
    async handleSignOut() {
      await supabase.auth.signOut()
      this.user = null
    }
  },
  getters: {
    isLoading(state) {
      return state.loading
    }
  }
})
