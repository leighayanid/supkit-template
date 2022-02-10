import { defineStore } from 'pinia'
import { supabase } from '@/utils/supabase'

export const useUser = defineStore('user', {
  state: () => ({
    user: [],
    errMsg: null,
    loading: false
  }),
  actions: {
    async getUserProfile() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select()
          .match({ id: supabase.auth.user().id })
        if (data) {
          this.user = data
        }
      } catch (err) {
        console.log(err)
      }
    },
    async updateProfileInfo(data) {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .update({
            first_name: data.first_name,
            last_name: data.last_name,
            username: data.username,
            avatar_url: data.avatar_url
          })
          .match({ id: supabase.auth.user().id })
        if (profile) {
          console.log('Profile updated')
        } else {
          console.log(error)
        }
      } catch (err) {
        console.log(err.message)
      }
    },
    async updateEmailInfo(email) {
      try {
        const user = await supabase.fro
        this.user = user
      } catch (err) {
        console.log(err)
      }
    }
  },
  getters: {
    firstName: (state) => {
      return state.user.first_name
    },
    lastName: (state) => {
      return state.user.last_name
    },
    username: (state) => {
      return state.user.username
    },
    email: (state) => {
      return state.user.email
    },
    avatar: (state) => {
      return state.user.avatar_url
    }
  }
})
