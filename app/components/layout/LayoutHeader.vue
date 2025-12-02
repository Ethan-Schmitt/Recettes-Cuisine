<script setup lang="ts">
const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Recipes', path: '/recettes' },
  { name: 'blog', path: '/blog' },
  { name: 'Contact', path: '/contact' }, 
  {name: 'About us', to: '/a-propos'}
];
const socialLinks = [
  { iconClass: 'fab fa-facebook-f', to: '#' },
  { iconClass: 'fab fa-twitter', to: '#' },
  { iconClass: 'fab fa-instagram', to: '#' },
];
</script>

<template>
  <header class="main-header">
    <div class="container">
      <NuxtLink to="/" class="logo">
        Foodieland.
      </NuxtLink>

      <nav class="main-nav">
        <ul class="nav-list">
          <li v-for="link in navLinks" :key="link.name" class="nav-item">
            <NuxtLink :to="link.to" class="nav-link">
              {{ link.name }}
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <div class="social-links">
        <a v-for="(social, index) in socialLinks" :key="index" :href="social.to" target="_blank" class="social-icon">
          <span :class="social.iconClass"></span>
        </a>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.main-header {
  border-bottom: 1px solid $light-border-color; 
  padding: 1.5rem 0;
}

.container {
 
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: $text-color;
  text-decoration: none;


  &::first-letter {
    color: $primary-color; 
  }
}


.main-nav {
  margin: 0 2rem; 
}

.nav-list {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin-left: 1.5rem;
}

.nav-link {
  text-decoration: none;
  color: $text-color;
  font-size: 0.95rem;
  transition: color 0.2s;

  &:hover {
    color: $primary-color;
  }
}


.social-links {
  display: flex;
  gap: 1.5rem; 
}

.social-icon {
  text-decoration: none;
  color: $text-color;
  font-size: 1.1rem;
  transition: color 0.2s;

  &:hover {
    color: $primary-color;
  }
}
</style>