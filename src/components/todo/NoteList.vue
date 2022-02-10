<template>
  <div>
    <div class="grid grid-cols-2 gap-3">
      <NoteListItem
        v-for="(note, index) in notes"
        :key="note.id"
        data-test="note-list"
        :note="note"
        :loading="loading"
        @delete-note="deleteNote(note, index)"
        @show-modal="showModal(note)"
      />
    </div>

    <note-modal
      v-model="show"
      name="edit"
      @cancel="cancel"
      @confirm="updateNote(params)"
    >
      <template #title><h1 class="mb-2">Edit Note</h1></template>
      <template #default="{ params }">
        <div
          class="
            submit-form
            rounded
            border border-dashed border-slate-900
            p-5
            dark:border-slate-50
          "
        >
          <div class="form-group mb-2 flex flex-col">
            <label for="title">Title</label>
            <input
              id="title"
              v-model="params.title"
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
              v-model="params.description"
              class="border-b bg-slate-800 p-2 text-sm text-white"
              required
              name="description"
            />
          </div>
          <button
            class="mt-2 w-full rounded bg-slate-800 p-2 text-white"
            @click="updateNote(params)"
          >
            {{ loading ? 'Updating note..' : 'Update' }}
          </button>
        </div>
      </template>
    </note-modal>
  </div>
</template>

<script setup>
import {
  onMounted,
  ref,
  inject,
  onErrorCaptured,
  computed,
  onUnmounted
} from 'vue'
import NoteModal from '@/components/todo/NoteModal.vue'
import NoteListItem from './NoteListItem.vue'
import { supabase } from '@/utils/supabase'

// inject
const toast = inject('toast')
const vfm = inject('$vfm')

// variables
const notes = ref([])
const show = ref(false)
const error = ref(null)
const loading = ref(false)

onErrorCaptured((err) => {
  error.value = err.message
})

onMounted(async () => {
  const { data, error } = await supabase
    .from('notes')
    .select()
    .match({ user_id: supabase.auth.user().id })

  notes.value = data

  subscribeToNotes()
})

// delete note
const deleteNote = async (note) => {
  try {
    loading.value = true
    toast.info(`Deleting note...`, {
      position: 'top-right',
      duration: 1000
    })
    await supabase.from('notes').delete().match({ id: note.id })
    toast.success(`Note deleted`, {
      position: 'top-right',
      duration: 1000
    })
  } catch (error) {
    console.error('Error deleting note: ', error)
    loading.value = false
  } finally {
    loading.value = false
  }
}

function showModal(note) {
  show.value = true
  vfm.show('edit', {
    title: note.title,
    description: note.description,
    id: note.id
  })
}

const updateNote = async (note) => {
  try {
    loading.value = true
    await supabase.from('notes').update(note).match({ id: note.id })
    toast.success(`Note updated`, {
      position: 'top-right',
      duration: 1000
    })
  } catch (error) {
    console.error('Error updating note: ', error)
  } finally {
    loading.value = false
  }
  vfm.hide('edit')
}

const cancel = () => {
  show.value = false
  vfm.hide('edit')
}

const subscribeToNotes = async () => {
  try {
    supabase
      .from('*')
      .on('INSERT', (payload) => {
        if (payload.new) {
          notes.value.push(payload.new)
        }
      })
      .on('DELETE', (payload) => {
        if (payload.old) {
          notes.value = notes.value.filter((note) => note.id !== payload.old.id)
        }
      })
      .on('UPDATE', (payload) => {
        if (payload.old && payload.new) {
          const index = notes.value.findIndex(
            (note) => note.id === payload.old.id
          )
          notes.value[index] = payload.new
        }
      })
      .subscribe()
  } catch (error) {
    console.error('Error subscribing to notes: ', error)
  }
}

onUnmounted(() => {
  supabase.removeSubscription(subscribeToNotes)
})
</script>