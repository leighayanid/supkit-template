<template>
  <div
    class="
      submit-form
      rounded
      border border-dashed border-slate-900
      p-5
      dark:border-slate-50
    "
  >
    <h1 class="mb-4 text-lg">📓 Add note</h1>
    <div class="form-group mb-2 flex flex-col">
      <label for="title">Title</label>
      <input
        id="title"
        v-model="title"
        type="text"
        class="border-b bg-slate-800 p-2 text-sm text-white"
        required
        name="title"
      />
    </div>

    <div class="form-group flex flex-col">
      <label for="description">Description</label>
      <textarea
        id="description"
        v-model="description"
        class="border-b bg-slate-800 p-2 text-sm text-white"
        required
        name="description"
      />
    </div>
    <button
      class="mt-2 w-full rounded bg-slate-800 p-2 text-white"
      @click="saveNotes"
      :disabled="loading"
    >
      {{ loading ? 'Saving note..' : 'Submit' }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '@/utils/supabase'

// todo add validations
const title = ref('')
const description = ref('')
const loading = ref(false)

const saveNotes = async () => {
  if (!title.value || !description.value) {
    return
  }

  try {
    loading.value = true
    await supabase.from('notes').insert({
      title: title.value,
      description: description.value,
      user_id: supabase.auth.user().id
    })

    title.value = ''
    description.value = ''
    this.$emit('cancel')
  } catch (e) {
    console.error('Error adding document: ', e)
  } finally {
    loading.value = false
  }
}
</script>
