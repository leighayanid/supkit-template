<script setup>
import { ref, onMounted } from 'vue'
import { useSupaAuth } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { LogoutIcon } from '@heroicons/vue/solid'
import ToggleTheme from './ToggleTheme.vue'
import { supabase } from '../utils/supabase'

const router = useRouter()
const loggedIn = ref(false)
const auth = useSupaAuth()

onMounted(() => {
  supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
      loggedIn.value = true
    } else {
      loggedIn.value = false
    }
  })
})

const handleSignOut = () => {
  auth.handleSignOut()
  router.go('/')
}
</script>

<template>
  <div>
    <nav class="flex">
      <router-link to="/" class="flex-1"><h1>⚡ SupKit</h1></router-link>
      <ul class="flex space-x-5">
        <li><router-link to="/crud">CRUD</router-link></li>
        <span v-if="loggedIn" class="flex space-x-4">
          <li><router-link to="/profile">Profile</router-link></li>
          <button
            v-if="loggedIn"
            class="flex items-center space-x-2 rounded border px-2"
            @click="handleSignOut"
          >
            <LogoutIcon class="h-4 w-4" />
          </button>
        </span>
        <span v-else class="flex space-x-4">
          <li><router-link to="/login">Login</router-link></li>
          <li><router-link to="/register">Register</router-link></li>
        </span>
        <li><ToggleTheme /></li>
      </ul>
    </nav>
  </div>
</template>
