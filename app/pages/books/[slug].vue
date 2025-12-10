<script setup lang="ts">
import type { SanityDocument } from '@sanity/client'
import { createImageUrlBuilder } from '@sanity/image-url'

interface SanityImage {
  asset?: {
    _ref: string
    _type: string
  }
  [key: string]: unknown
}

interface Book extends SanityDocument {
  title?: string
  slug?: { current: string }
  image?: SanityImage
  publishedAt?: string
  body?: Array<{
    _key: string
    _type: string
    children?: Array<{
      _key: string
      text: string
    }>
  }>
}

const route = useRoute()
const slug = route.params.slug as string

const BOOK_QUERY = `*[_type == "book" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  publishedAt,
  image,
  body
}`

const { data: book } = await useLazySanityQuery<Book>(BOOK_QUERY, { slug })

const { projectId, dataset } = useSanity().client.config()
const urlFor = (source: SanityImage) =>
  projectId && dataset
    ? createImageUrlBuilder({ projectId, dataset }).image(source)
    : null


</script>

<template>
  <main
    v-if="book"
    class="container mx-auto min-h-screen max-w-3xl p-8 flex flex-col gap-4"
  >
    <nuxt-link to="/books" class="hover:underline">&larr; Back to books</nuxt-link>
    <img
      v-if="book.image"
      :src="urlFor(book.image)?.width(550).height(310).url()"
      :alt="book?.title"
      class="aspect-video rounded-xl"
      width="550"
      height="310"
    >
    <h1 v-if="book.title" class="text-4xl font-bold mb-8">{{ book.title }}</h1>
    <div class="prose max-w-none">
      <p v-if="book.publishedAt" class="text-gray-600 mb-4">
        Published: {{ new Date(book.publishedAt).toLocaleDateString() }}
      </p>
      <div v-if="book.body" class="text-base leading-relaxed space-y-4">
        <p v-for="block in book.body" :key="block._key">
          <template v-for="child in block.children" :key="child._key">
            {{ child.text }}
          </template>
        </p>
      </div>
    </div>
  </main>
</template>