<template>
  <div class="card overflow-hidden">
    <!-- Title Input -->
    <div class="p-6 border-b border-gray-700">
      <input
        v-model="document.title"
        type="text"
        placeholder="Document title..."
        class="w-full text-2xl font-bold text-gray-100 bg-transparent border-none outline-none resize-none placeholder-gray-500"
      />
    </div>

    <!-- Editor and Preview -->
    <div class="grid md:grid-cols-2 min-h-96">
      <!-- Editor -->
      <div class="border-r border-gray-700">
        <div class="p-4 bg-gray-900 border-b border-gray-700">
          <h3 class="font-medium text-gray-100">Editor</h3>
        </div>
        <textarea
          v-model="document.content"
          :placeholder="placeholder"
          class="w-full h-96 p-6 bg-gray-800 border-none outline-none resize-none font-mono text-sm leading-relaxed text-gray-200 placeholder-gray-500"
        ></textarea>
      </div>

      <!-- Preview -->
      <div>
        <div class="p-4 bg-gray-900 border-b border-gray-700">
          <h3 class="font-medium text-gray-100">Preview</h3>
        </div>
        <div class="p-6 h-96 overflow-y-auto prose-dark" v-html="renderedMarkdown"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { marked } from 'marked'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
    default: () => ({ title: '', content: '' })
  },
  placeholder: {
    type: String,
    default: `Start writing your markdown content here...

# Heading 1
## Heading 2

**Bold text** and *italic text*

- List item 1
- List item 2

[Link text](https://example.com)

\`\`\`javascript
// Code block
console.log('Hello World!');
\`\`\``
  }
})

const emit = defineEmits(['update:modelValue'])

const document = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const renderedMarkdown = computed(() => {
  if (!document.value.content) return '<p class="text-gray-500">Preview will appear here...</p>'
  return marked(document.value.content)
})
</script> 