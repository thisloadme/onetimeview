<template>
  <div class="min-h-screen bg-gray-900">
    <!-- Navigation -->
    <nav class="bg-gray-950 border-b border-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <div class="flex items-center space-x-4">
            <NuxtLink to="/" class="flex items-center gap-3">
              <img src="/assets/images/logo.png" alt="OneTimeView" class="h-8 w-auto" />
              <span class="text-3xl font-bold text-gradient">OneTimeView</span>
            </NuxtLink>
            <span class="text-gray-600">/</span>
            <span class="text-gray-300">Quick Create</span>
          </div>
          <div class="flex items-center space-x-4">
            <NuxtLink to="/login" class="px-4 py-2 text-white border border-white/30 rounded-lg hover:bg-white/10 transition-all">
              Login
            </NuxtLink>
            <NuxtLink to="/register" class="px-6 py-2 bg-white text-[#0e2e4f] font-semibold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105">
              Sign Up
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Warning Banner -->
      <div class="mb-8 p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-xl">
        <div class="flex items-start gap-3">
          <svg class="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          <div>
            <h3 class="text-yellow-400 font-semibold mb-1">Important Notice</h3>
            <p class="text-yellow-100/80 text-sm">
              You are creating an anonymous document. Save link before leaving this page - you won't be able to access this document again after closing this tab.
            </p>
          </div>
        </div>
      </div>

      <!-- Main Editor Section -->
      <div class="grid lg:grid-cols-3 gap-6">
        <!-- Editor Section -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Document Editor -->
          <div class="card">
            <!-- Title Input -->
            <div class="p-6 border-b border-gray-700">
              <input
                v-model="anonymousDocument.title"
                type="text"
                placeholder="Enter document title..."
                class="w-full text-2xl font-bold text-gray-100 bg-transparent border-none outline-none resize-none placeholder-gray-500"
              />
            </div>

            <!-- Editor and Preview -->
            <div class="grid md:grid-cols-2 min-h-[500px]">
              <!-- Editor -->
              <div class="border-r border-gray-700">
                <div class="p-4 bg-gray-900 border-b border-gray-700">
                  <h3 class="font-medium text-gray-100">Editor</h3>
                </div>
                <div class="relative">
                  <textarea
                    ref="textareaRef"
                    v-model="anonymousDocument.content"
                    :placeholder="placeholder"
                    class="w-full h-[500px] p-6 bg-gray-800 border-none outline-none resize-none font-mono text-sm leading-relaxed text-gray-200 placeholder-gray-500"
                    @input="handleInput"
                    @keydown="handleKeydown"
                    @click="hideSlashMenu"
                  ></textarea>
                  
                  <!-- Slash Command Menu -->
                  <div
                    v-if="showSlashMenu"
                    class="absolute bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10 min-w-64 max-h-64 overflow-auto"
                    :style="{ top: menuPosition.top + 'px', left: menuPosition.left + 'px' }"
                  >
                    <div class="p-2">
                      <div class="text-xs text-gray-400 mb-2 px-2">Choose format:</div>
                      <div
                        v-for="(command, index) in filteredCommands"
                        :key="command.key"
                        :class="[
                          'flex items-center px-3 py-2 rounded cursor-pointer transition-colors',
                          selectedCommandIndex === index ? 'bg-[#0e2e4f] text-white' : 'text-gray-200 hover:bg-gray-700'
                        ]"
                        @click="insertCommand(command)"
                      >
                        <span class="text-lg mr-3">{{ command.icon }}</span>
                        <div>
                          <div class="font-medium">{{ command.label }}</div>
                          <div class="text-xs opacity-75">{{ command.description }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Preview -->
              <div>
                <div class="p-4 bg-gray-900 border-b border-gray-700">
                  <h3 class="font-medium text-gray-100">Preview</h3>
                </div>
                <div class="p-6 h-[500px] overflow-y-auto prose-dark" v-html="renderedMarkdown"></div>
              </div>
            </div>

            <!-- Editor Actions -->
            <div class="p-4 bg-gray-900 border-t border-gray-700 flex flex-col md:flex-row gap-3 justify-between items-center">
              <div class="flex items-center gap-2 text-xs md:text-sm text-gray-400">
                <span class="hidden sm:inline">Quick insert:</span>
                <select
                  class="bg-gray-800 border border-gray-700 rounded-md px-2 py-1 text-xs md:text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0e2e4f]"
                  @change="handleExampleChange($event.target.value)"
                >
                  <option value="">Choose example...</option>
                  <option
                    v-for="example in markdownExamples"
                    :key="example.key"
                    :value="example.key"
                  >
                    {{ example.label }}
                  </option>
                </select>
              </div>
              <button
                @click="createDocument"
                :disabled="creating || !isValid"
                class="px-6 py-3 bg-[#0e2e4f] text-white font-semibold rounded-lg hover:bg-[#1d6477] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg v-if="creating" class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ creating ? 'Creating...' : 'Create & Share Document' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Settings Section -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Sharing Settings -->
          <div class="card p-6">
            <h3 class="text-xl font-bold text-gray-100 mb-6 flex items-center gap-2">
              <svg class="w-6 h-6 text-[#0e2e4f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              Sharing Settings
            </h3>

            <!-- Max Accesses -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Maximum Access Count
              </label>
              <div class="flex items-center gap-4">
                <input
                  v-model.number="settings.maxAccesses"
                  type="range"
                  min="1"
                  max="100"
                  class="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#0e2e4f]"
                />
                <div class="w-20 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-center text-gray-200 font-semibold">
                  {{ settings.maxAccesses }}
                </div>
              </div>
              <p class="text-xs text-gray-500 mt-2">How many times document can be viewed</p>
            </div>

            <!-- Expiration Time -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Link Expiration
              </label>
              <select
                v-model="settings.expiresIn"
                class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0e2e4f]"
              >
                <option :value="1">1 Hour</option>
                <option :value="6">6 Hours</option>
                <option :value="24">24 Hours</option>
                <option :value="24 * 7">7 Days</option>
                <option :value="24 * 30">30 Days</option>
              </select>
              <p class="text-xs text-gray-500 mt-2">The link will expire after this period</p>
            </div>

            <!-- Info Box -->
            <div class="p-4 bg-[#0e2e4f]/20 border border-[#0e2e4f]/50 rounded-lg">
              <div class="flex items-start gap-2">
                <svg class="w-5 h-5 text-[#0e2e4f] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <p class="text-sm text-gray-200">
                    Document will be automatically deleted after {{ settings.maxAccesses }} views or {{ formatExpiration(settings.expiresIn) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Tips -->
          <div class="card p-6">
            <h3 class="text-xl font-bold text-gray-100 mb-4 flex items-center gap-2">
              <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
              Quick Tips
            </h3>
            <ul class="space-y-3">
              <li class="flex items-start gap-2 text-sm text-gray-400">
                <span class="text-[#0e2e4f]">•</span>
                <span>Type <code class="bg-gray-800 px-1 rounded">/</code> to see formatting options</span>
              </li>
              <li class="flex items-start gap-2 text-sm text-gray-400">
                <span class="text-[#0e2e4f]">•</span>
                <span>Use examples to quickly start with templates</span>
              </li>
              <li class="flex items-start gap-2 text-sm text-gray-400">
                <span class="text-[#0e2e4f]">•</span>
                <span>Save link immediately after creating</span>
              </li>
              <li class="flex items-start gap-2 text-sm text-gray-400">
                <span class="text-[#0e2e4f]">•</span>
                <span>Lower access counts = higher security</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="closeSuccessModal"></div>
      <div class="relative bg-gray-900 rounded-2xl max-w-lg w-full p-8 border border-gray-700 shadow-2xl">
        <!-- Success Icon -->
        <div class="flex justify-center mb-6">
          <div class="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
            <svg class="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </div>

        <h2 class="text-2xl font-bold text-white text-center mb-2">Document Created!</h2>
        <p class="text-gray-400 text-center mb-6">
          Your anonymous document is ready to share. Copy link below before closing this modal.
        </p>

        <!-- Warning -->
        <div class="mb-6 p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-xl">
          <div class="flex items-start gap-2">
            <svg class="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <div>
              <p class="text-yellow-400 text-sm font-semibold mb-1">Save this link now!</p>
              <p class="text-yellow-100/80 text-xs">
                You won't be able to retrieve this document again after closing this page.
              </p>
            </div>
          </div>
        </div>

        <!-- Share Link -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-300 mb-2">Share Link</label>
          <div class="flex gap-2">
            <input
              ref="shareLinkInput"
              type="text"
              :value="shareLink"
              readonly
              class="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 text-sm"
            />
            <button
              @click="copyLink"
              class="px-4 py-3 bg-[#0e2e4f] text-white font-medium rounded-lg hover:bg-[#1d6477] transition-colors flex items-center gap-2"
            >
              <svg v-if="copied" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
              </svg>
              {{ copied ? 'Copied!' : 'Copy' }}
            </button>
          </div>
        </div>

        <!-- Document Info -->
        <div class="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <div class="grid grid-cols-3 gap-4 text-center">
            <div>
              <p class="text-xs text-gray-500 mb-1">Max Accesses</p>
              <p class="text-lg font-bold text-white">{{ createdDocument?.maxAccesses }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 mb-1">Expires In</p>
              <p class="text-lg font-bold text-white">{{ formatExpiration(createdDocument?.expiresIn) }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 mb-1">Status</p>
              <p class="text-lg font-bold text-green-400">Active</p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-3">
          <button
            @click="closeSuccessModal"
            class="flex-1 px-4 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
          >
            Create Another
          </button>
          <a
            :href="shareLink"
            target="_blank"
            class="flex-1 px-4 py-3 bg-[#0e2e4f] text-white font-medium rounded-lg hover:bg-[#1d6477] transition-colors text-center"
          >
            Open Document
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { marked } from 'marked'

const anonymousDocument = reactive({
  title: '',
  content: ''
})

const settings = reactive({
  maxAccesses: 5,
  expiresIn: 24
})

const creating = ref(false)
const showSuccessModal = ref(false)
const shareLink = ref('')
const copied = ref(false)
const createdDocument = ref(null)

const textareaRef = ref(null)
const showSlashMenu = ref(false)
const menuPosition = ref({ top: 0, left: 0 })
const selectedCommandIndex = ref(0)
const slashPosition = ref(0)
const searchQuery = ref('')

const placeholder = `Start writing your markdown content here...

Type / to see available format options

# Welcome to OneTimeView

This is a **secure** way to share documents that will expire after being viewed.

## Example Content

- List item 1
- List item 2

\`\`\`javascript
// Code blocks are supported
console.log('Hello World!');
\`\`\``

const isValid = computed(() => {
  return anonymousDocument.title.trim() && anonymousDocument.content.trim()
})

const renderedMarkdown = computed(() => {
  if (!anonymousDocument.content) return '<p class="text-gray-500">Preview will be shown here...</p>'
  return marked(anonymousDocument.content)
})

const markdownExamples = [
  {
    key: 'basic',
    label: 'Basic formatting',
    content:
      '# Welcome\n\nThis is a **basic** markdown example.\n\n## Section\n- Bullet item 1\n- Bullet item 2\n\n[Link](https://example.com)'
  },
  {
    key: 'technical',
    label: 'Technical document',
    content:
      '# API Spec\n\n## Endpoint\n`GET /api/example`\n\n| Param | Type | Desc |\n|-------|------|------|\n| id | int | ID |'
  },
  {
    key: 'full',
    label: 'Full demo',
    content:
      '# Update\n\n## Summary\n- **Status:** On track\n\n## Tasks\n1. Define\n2. Build\n3. Test\n\n> Important note here'
  }
]

const slashCommands = [
  { key: 'h1', label: 'Heading 1', description: 'Title', icon: '📝', template: '# ' },
  { key: 'h2', label: 'Heading 2', description: 'Subtitle', icon: '📄', template: '## ' },
  { key: 'bullet', label: 'Bullet List', description: 'Bullet list', icon: '•', template: '- ' },
  { key: 'numbered', label: 'Numbered List', description: 'Numbered list', icon: '🔢', template: '1. ' },
  { key: 'quote', label: 'Quote', description: 'Quote', icon: '💬', template: '> ' },
  { key: 'code', label: 'Code Block', description: 'Code block', icon: '💻', template: '```\n\n```' },
  { key: 'bold', label: 'Bold Text', description: 'Bold text', icon: '🔤', template: '**bold text**' },
  { key: 'italic', label: 'Italic Text', description: 'Italic text', icon: '🔤', template: '*italic text*' },
  { key: 'link', label: 'Link', description: 'Link', icon: '🔗', template: '[link text](https://example.com)' }
]

const filteredCommands = computed(() => {
  if (!searchQuery.value) return slashCommands
  const query = searchQuery.value.toLowerCase()
  return slashCommands.filter(command =>
    command.label.toLowerCase().includes(query) ||
    command.description.toLowerCase().includes(query)
  )
})

const handleInput = (event) => {
  const textarea = event.target
  const value = textarea.value
  const cursorPosition = textarea.selectionStart
  
  if (value[cursorPosition - 1] === '/') {
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
      event.preventDefault()
      if (filteredCommands.value[selectedCommandIndex.value]) {
        insertCommand(filteredCommands.value[selectedCommandIndex.value])
      }
      break
    case 'Escape':
      event.preventDefault()
      hideSlashMenu()
      break
  }
}

const updateMenuPosition = (textarea, cursorPosition) => {
  const textBeforeCursor = textarea.value.substring(0, cursorPosition)
  const lines = textBeforeCursor.split('\n')
  const currentLine = lines.length - 1
  const currentColumn = lines[lines.length - 1].length
  
  const lineHeight = 20
  const charWidth = 8
  
  menuPosition.value = {
    top: (currentLine * lineHeight) + 40,
    left: (currentColumn * charWidth) + 24
  }
}

const insertCommand = (command) => {
  const textarea = textareaRef.value
  const content = anonymousDocument.content
  const searchEnd = slashPosition.value + 1 + searchQuery.value.length
  
  const newContent = 
    content.substring(0, slashPosition.value) + 
    command.template + 
    content.substring(searchEnd)
  
  anonymousDocument.content = newContent
  hideSlashMenu()
  
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
  if (example) {
    anonymousDocument.content = example.content
    nextTick(() => {
      const select = document.querySelector('select')
      if (select) select.value = ''
    })
  }
}

const createDocument = async () => {
  if (!isValid.value) {
    alert('Please enter both title and content')
    return
  }

  creating.value = true

  try {
    const result = await $fetch('/api/documents/anonymous', {
      method: 'POST',
      body: {
        title: anonymousDocument.title,
        content: anonymousDocument.content,
        maxAccesses: settings.maxAccesses,
        expiresIn: settings.expiresIn
      }
    })

    shareLink.value = result.sharedLink.url
    createdDocument.value = {
      ...result.sharedLink,
      expiresIn: settings.expiresIn
    }
    showSuccessModal.value = true
  } catch (error) {
    alert('Failed to create document: ' + (error.data?.statusMessage || error.message))
  } finally {
    creating.value = false
  }
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(shareLink.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    alert('Failed to copy link')
  }
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
  shareLink.value = ''
  copied.value = false
  createdDocument.value = null
  anonymousDocument.title = ''
  anonymousDocument.content = ''
}

const formatExpiration = (hours) => {
  if (hours < 1) return 'Less than 1 hour'
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''}`
  const days = Math.floor(hours / 24)
  return `${days} day${days > 1 ? 's' : ''}`
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.document.addEventListener('click', (event) => {
      if (!event.target.closest('.relative')) {
        hideSlashMenu()
      }
    })
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.document.removeEventListener('click', hideSlashMenu)
  }
})
</script>

<style>
.card {
  background: rgba(17, 24, 39, 0.5);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
}

.prose-dark {
  color: #e5e7eb;
}

.prose-dark h1 { @apply text-2xl font-bold text-gray-100 mb-4 mt-6; }
.prose-dark h2 { @apply text-xl font-bold text-gray-100 mb-3 mt-5; }
.prose-dark h3 { @apply text-lg font-bold text-gray-100 mb-2 mt-4; }
.prose-dark p { @apply text-gray-300 mb-4 leading-relaxed; }
.prose-dark ul { @apply list-disc list-inside mb-4 text-gray-300; }
.prose-dark ol { @apply list-decimal list-inside mb-4 text-gray-300; }
.prose-dark li { @apply mb-1; }
.prose-dark a { @apply text-[#0e2e4f] hover:text-[#1d6477] underline; }
.prose-dark strong { @apply font-bold text-gray-100; }
.prose-dark em { @apply italic; }
.prose-dark code { @apply bg-gray-800 px-2 py-1 rounded font-mono text-sm text-gray-200; }
.prose-dark pre { @apply bg-gray-800 p-4 rounded-lg overflow-x-auto mb-4; }
.prose-dark blockquote { @apply border-l-4 border-[#0e2e4f] pl-4 italic text-gray-400 mb-4; }
</style>