import { defineCollection, defineContentConfig } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',  // Or 'data' if not rendering as pages
      source: '**/*.md',  // Matches all Markdown files in content/; adjust as needed (e.g., 'blog/**' for subdirs)
    })
  }
})