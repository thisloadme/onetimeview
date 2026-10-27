<template>
  <article class="document-sheet" :aria-label="`${document.title || 'Untitled document'} actions`">
    <div class="document-sheet-main">
      <h2 class="document-sheet-title">{{ document.title || 'Untitled document' }}</h2>
      <p class="document-sheet-status">
        {{ document.is_published ? 'Published' : 'Draft' }}
        <span aria-hidden="true"> · </span>
        Updated {{ timeAgo }}
      </p>
      <p class="document-sheet-preview">
        {{ previewText || 'No preview text yet.' }}
      </p>
      <div class="document-sheet-meta" aria-label="Document activity">
        <span>{{ document.total_views || 0 }} views</span>
        <span>{{ document.shared_links_count || 0 }} links</span>
      </div>
    </div>

    <div class="document-sheet-actions" :aria-label="`Actions for ${document.title || 'document'}`">
      <button type="button" @click="handleEdit">Edit</button>
      <button type="button" class="document-share-action" @click="handleShare">Share</button>
      <button type="button" @click="handleViewHistory">Access history</button>
      <button type="button" class="document-delete-action" @click="handleDelete">Delete</button>
    </div>
  </article>
</template>

<script setup>
const props = defineProps({
  document: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['share', 'viewHistory', 'delete'])

const previewText = computed(() => {
  const content = props.document.content || ''
  const plainText = content
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*/g, '')
    .replace(/`/g, '')
    .replace(/\[.*?\]\(.*?\)/g, '')
    .replace(/\n/g, ' ')
    .trim()

  return plainText.length > 150 ? `${plainText.substring(0, 150)}...` : plainText
})

const timeAgo = computed(() => {
  const date = new Date(props.document.updated_at)
  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000))
  const intervals = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60]
  ]

  for (const [unit, secondsInUnit] of intervals) {
    const interval = Math.floor(seconds / secondsInUnit)
    if (interval >= 1) return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`
  }

  return 'just now'
})

const handleEdit = () => navigateTo(`/edit/${props.document.id}`)
const handleShare = () => emit('share', props.document.id)
const handleViewHistory = () => emit('viewHistory', props.document.id, props.document.title)
const handleDelete = () => emit('delete', props.document.id)
</script>
