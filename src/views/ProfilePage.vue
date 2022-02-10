<template>
  <div class="container">
    <h1 class="mb-5 text-lg">Profile Information</h1>
    <div class="flex items-center justify-center">
      <div class="box h-fit w-full rounded bg-slate-800 p-10">
        <div
          class="mb-3 flex w-full flex-col items-center space-y-2 text-center"
        >
          <img
            :src="photourl || 'https://via.placeholder.com/150'"
            alt=""
            class="h-20 w-20 rounded-full"
          />
          <button @click="uploadProfilePhoto">Upload</button>
        </div>
        <div class="space-y-3">
          <span v-if="!first_name" class="flex text-white"
            >Update your profile <PencilIcon class="ml-2 h-5 w-5"
          /></span>
          <div class="flex flex-col">
            <label for="name" class="text-sm text-white"> First Name </label>
            <input
              v-model="first_name"
              class="w-full border-b bg-slate-800 p-2 text-sm text-white"
              placeholder="First Name"
            />
          </div>
          <div class="flex flex-col">
            <label for="lastName" class="text-sm text-white">Last Name</label>
            <input
              v-model="last_name"
              class="w-full border-b bg-slate-800 p-2 text-sm text-white"
              placeholder="Last Name"
            />
          </div>
          <div class="flex flex-col">
            <label for="username" class="text-sm text-white">Username</label>
            <input
              v-model="username"
              class="w-full border-b bg-slate-800 p-2 text-sm text-white"
              placeholder="Username"
            />
          </div>
          <div class="flex flex-col">
            <label for="photourl" class="text-sm text-white">Photo URL</label>
            <input
              v-model="photourl"
              class="w-full border-b bg-slate-800 p-2 text-sm text-white"
              placeholder="Photo URL"
            />
          </div>

          <button
            class="w-full rounded bg-slate-900 p-2 text-white"
            @click="updateProfile"
          >
            Update Profile
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { PencilIcon } from '@heroicons/vue/solid'
import { computed, inject, onMounted, ref, reactive } from 'vue'
import { supabase } from '@/utils/supabase'
import { useUser } from '@/stores/user'

const toast = inject('toast')
const user = useUser()

let userData = reactive([])

const first_name = ref('')
const last_name = ref('')
const username = ref('')
const photourl = ref('')
const email = ref('')

onMounted(async () => {
  await user.getUserProfile()
  userData = { ...user.user[0] }
  first_name.value = userData.first_name
  last_name.value = userData.last_name
  username.value = userData.username
  photourl.value = userData.avatar_url
  email.value = supabase.auth.user().email
})

function uploadProfilePhoto() {
  const file = document.querySelector('input[type=file]').files[0]
  // TODO: upload file
}

const updateProfile = async () => {
  await user.updateProfileInfo({
    first_name: first_name.value,
    last_name: last_name.value,
    username: username.value,
    avatar_url: photourl.value
  })
  toast.show('Profile Updated', {
    duration: 1000,
    type: 'success'
  })
}
</script>