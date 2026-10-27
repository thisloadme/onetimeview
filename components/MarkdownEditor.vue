<template>
  <section class="markdown-editor" aria-label="Markdown document editor">
    <div class="editor-title-row">
      <label class="sr-only" for="document-title">Document title</label>
      <input
        id="document-title"
        v-model="markdownDocument.title"
        type="text"
        placeholder="Give this note a title"
        class="editor-title-input"
      />
    </div>

    <div class="editor-columns">
      <section class="editor-pane relative" aria-labelledby="write-heading">
        <div class="editor-pane-heading">
          <h2 id="write-heading">Write</h2>
          <label class="flex items-center gap-2 text-sm" for="markdown-example">
            <span>Start from</span>
            <select id="markdown-example" class="px-2 py-1 border border-gray-700 rounded" @change="handleExampleChange($event.target.value)">
              <option value="">Blank note</option>
              <option v-for="example in markdownExamples" :key="example.key" :value="example.key">
                {{ example.label }}
              </option>
            </select>
          </label>
        </div>
        <textarea
          ref="textareaRef"
          v-model="markdownDocument.content"
          :placeholder="placeholder"
          class="editor-textarea"
          aria-label="Markdown content"
          @input="handleInput"
          @keydown="handleKeydown"
          @click="hideSlashMenu"
        ></textarea>

        <div
          v-if="showSlashMenu"
          class="editor-command-menu max-h-64 overflow-auto"
          role="listbox"
          aria-label="Markdown formatting commands"
          :style="{ top: menuPosition.top + 'px', left: menuPosition.left + 'px' }"
        >
          <p class="px-3 pt-2 pb-1 text-sm text-gray-500">Choose a format</p>
          <button
            v-for="(command, index) in filteredCommands"
            :key="command.key"
            type="button"
            class="editor-command-item"
            role="option"
            :aria-selected="selectedCommandIndex === index"
            @click="insertCommand(command)"
          >
            <code class="editor-command-key">{{ command.key }}</code>
            <span>
              <strong class="block">{{ command.label }}</strong>
              <span class="block text-sm">{{ command.description }}</span>
            </span>
          </button>
        </div>
      </section>

      <section class="editor-pane" aria-labelledby="preview-heading">
        <div class="editor-pane-heading">
          <h2 id="preview-heading">Live preview</h2>
          <span class="text-sm text-gray-500">What readers will see</span>
        </div>
        <div class="editor-preview prose-dark" v-html="renderedMarkdown"></div>
      </section>
    </div>
  </section>
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

Type / to see the available format options

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
const textareaRef = ref(null)
const showSlashMenu = ref(false)
const menuPosition = ref({ top: 0, left: 0 })
const selectedCommandIndex = ref(0)
const slashPosition = ref(0)
const searchQuery = ref('')

const markdownDocument = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const renderedMarkdown = computed(() => {
  if (!markdownDocument.value.content) return '<p class="text-gray-500">Preview will be shown here...</p>'
  return marked(markdownDocument.value.content)
})

// Predefined markdown examples to quickly show supported components
const markdownExamples = [
  {
    key: 'basic',
    label: 'Basic formatting',
    content:
      '# Welcome to OneTimeView' +
      '\n\nThis is a **basic** markdown example with some commonly used elements.' +
      '\n\n## Section title' +
      '\n- Bullet item 1' +
      '\n- Bullet item 2' +
      '\n\n[Visit Nuxt](https://nuxt.com)' +
      '\n\n> This is a quote block to highlight important information.'
  },
  {
    key: 'technical',
    label: 'Technical document',
    content:
      '# API Specification' +
      '\n\n## Endpoint' +
      '\n`GET /api/example`' +
      '\n\n## Parameters' +
      '\n| Name | Type | Description |' +
      '\n|------|------|-------------|' +
      '\n| id   | int  | Resource ID  |' +
      '\n\n## Example' +
      '\n```json' +
      '\n{"id": 1, "name": "Example"}' +
      '\n```'
  },
  {
    key: 'full',
    label: 'Full feature demo',
    content:
      '# Project Update' +
      '\n\n## Summary' +
      '\n- **Status:** On track' +
      '\n- _Owner:_ Product Team' +
      '\n\n## Tasks' +
      '\n1. Define requirements' +
      '\n2. Implement backend' +
      '\n3. Implement frontend' +
      '\n\n## Code snippet' +
      '\n```javascript' +
      '\nfunction greet(name) {' +
      '\n  console.log(`Hello, ${name}`)' +
      '\n}' +
      '\n```' +
      '\n\n## Notes' +
      '\n> Links and images are also supported.'
  }
]

// Slash commands
const slashCommands = [
  {
    key: 'h1',
    label: 'Heading 1',
    description: 'Title',
    icon: '📝',
    template: '# ',
    keywords: ['heading', 'h1', 'title', 'heading 1']
  },
  {
    key: 'h2',
    label: 'Heading 2',
    description: 'Subtitle',
    icon: '📄',
    template: '## ',
    keywords: ['heading', 'h2', 'subtitle', 'heading 2']
  },
  {
    key: 'h3',
    label: 'Heading 3',
    description: 'Small Title',
    icon: '📃',
    template: '### ',
    keywords: ['heading', 'h3', 'small title', 'heading 3']
  },
  {
    key: 'bullet',
    label: 'Bullet List',
    description: 'Bullet list',
    icon: '•',
    template: '- ',
    keywords: ['list', 'bullet', 'bullet list']
  },
  {
    key: 'numbered',
    label: 'Numbered List',
    description: 'Numbered list',
    icon: '🔢',
    template: '1. ',
    keywords: ['list', 'numbered', 'nomor', 'angka', 'list nomor']
  },
  {
    key: 'quote',
    label: 'Quote',
    description: 'Quote',
    icon: '💬',
    template: '> ',
    keywords: ['quote', 'blockquote', 'quote block']
  },
  {
    key: 'code',
    label: 'Code Block',
    description: 'Code block',
    icon: '💻',
    template: '```\n\n```',
    keywords: ['code', 'programming', 'code block']
  },
  {
    key: 'bold',
    label: 'Bold Text',
    description: 'Bold text',
    icon: '🔤',
    template: '**bold text**',
    keywords: ['bold', 'bold text']
  },
  {
    key: 'italic',
    label: 'Italic Text',
    description: 'Italic text',
    icon: '🔤',
    template: '*italic text*',
    keywords: ['italic', 'italic text']
  },
  {
    key: 'link',
    label: 'Link',
    description: 'Link',
    icon: '🔗',
    template: '[link text](https://example.com)',
    keywords: ['link', 'link text']
  },
  {
    key: 'image',
    label: 'Image',
    description: 'Image',
    icon: '🖼️',
    template: '![alt text](image-url)',
    keywords: ['image', 'image text', 'photo']
  },
  {
    key: 'table',
    label: 'Table',
    description: 'Table',
    icon: '📊',
    template: '| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |',
    keywords: ['table', 'table text']
  },
  {
    key: 'hr',
    label: 'Horizontal Rule',
    description: 'Horizontal Rule',
    icon: '➖',
    template: '---',
    keywords: ['hr', 'horizontal rule', 'line', 'separator']
  }
]

const filteredCommands = computed(() => {
  if (!searchQuery.value) return slashCommands
  
  const query = searchQuery.value.toLowerCase()
  return slashCommands.filter(command => 
    command.label.toLowerCase().includes(query) ||
    command.description.toLowerCase().includes(query) ||
    command.keywords.some(keyword => keyword.toLowerCase().includes(query))
  )
})

const handleInput = (event) => {
  const textarea = event.target
  const value = textarea.value
  const cursorPosition = textarea.selectionStart
  
  // Check if user typed '/'
  if (value[cursorPosition - 1] === '/') {
    // Check if '/' is at start of line or after whitespace
    const beforeSlash = value.substring(0, cursorPosition - 1)
    const lastNewline = beforeSlash.lastIndexOf('\n')
    const lineStart = lastNewline === -1 ? 0 : lastNewline + 1
    const lineBeforeSlash = value.substring(lineStart, cursorPosition - 1)
    
    if (lineBeforeSlash.trim() === '') {
      showSlashMenu.value = true
      slashPosition.value = cursorPosition - 1
      searchQuery.value = ''
      selectedCommandIndex.value = 0
      updateMenuPosition(textarea, cursorPosition)
    }
  } else if (showSlashMenu.value) {
    // Update search query
    const searchStart = slashPosition.value + 1
    if (cursorPosition >= searchStart) {
      searchQuery.value = value.substring(searchStart, cursorPosition)
      selectedCommandIndex.value = 0
    } else {
      hideSlashMenu()
    }
  }
}

const handleKeydown = (event) => {
  if (!showSlashMenu.value) return
  
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      selectedCommandIndex.value = Math.min(selectedCommandIndex.value + 1, filteredCommands.value.length - 1)
      break
    case 'ArrowUp':
      event.preventDefault()
      selectedCommandIndex.value = Math.max(selectedCommandIndex.value - 1, 0)
      break
    case 'Enter':
    case 'Tab':
      event.preventDefault()
      if (filteredCommands.value[selectedCommandIndex.value]) {
        insertCommand(filteredCommands.value[selectedCommandIndex.value])
      }
      break
    case 'Escape':
      event.preventDefault()
      hideSlashMenu()
      break
    case 'Backspace':
      // Hide menu if we delete the '/'
      if (textareaRef.value.selectionStart <= slashPosition.value) {
        hideSlashMenu()
      }
      break
  }
}

const updateMenuPosition = (textarea, cursorPosition) => {
  // Get cursor position in pixels
  const textBeforeCursor = textarea.value.substring(0, cursorPosition)
  const lines = textBeforeCursor.split('\n')
  const currentLine = lines.length - 1
  const currentColumn = lines[lines.length - 1].length
  
  // Approximate position (this is a simple calculation)
  const lineHeight = 20
  const charWidth = 8
  
  menuPosition.value = {
    top: (currentLine * lineHeight) + 40,
    left: (currentColumn * charWidth) + 24
  }
}

const insertCommand = (command) => {
  const textarea = textareaRef.value
  const content = markdownDocument.value.content
  const searchEnd = slashPosition.value + 1 + searchQuery.value.length
  
  // Replace the slash and search query with the command template
  const newContent = 
    content.substring(0, slashPosition.value) + 
    command.template + 
    content.substring(searchEnd)
  
  // markdownDocument.value = { ...markdownDocument.value, content: newContent }
  markdownDocument.value.content = newContent

  hideSlashMenu()
  
  // Set cursor position after the inserted template
  nextTick(() => {
    const newCursorPosition = slashPosition.value + command.template.length
    textarea.focus()
    textarea.setSelectionRange(newCursorPosition, newCursorPosition)
  })
}

const hideSlashMenu = () => {
  showSlashMenu.value = false
  searchQuery.value = ''
  selectedCommandIndex.value = 0
}

const handleExampleChange = (key) => {
  if (!key) return

  const example = markdownExamples.find((item) => item.key === key)
  if (!example) return

  markdownDocument.value.content = example.content

  // Reset select back to placeholder after applying
  nextTick(() => {
    const select = document.querySelector('select')
    if (select) select.value = ''
  })
}

const clickHandler = (event) => {
  if (!event.target.closest('.relative')) {
    hideSlashMenu()
  }
}

// Hide menu when clicking outside
onMounted(() => {
  if (typeof window !== 'undefined') {
    window.document.addEventListener('click', clickHandler)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.document.removeEventListener('click', clickHandler)
  }
})
</script>
