<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';

const navLinks = [
  { name: 'Recettes', to: '/recettes' },
  { name: 'Blog', to: '/blog' },
  { name: 'Contact', to: '/contact' },
  { name: 'Connexion', to: '/login' }
];

const socialLinks = [
  { iconClass: 'fab fa-facebook-f', to: '#' },
  { iconClass: 'fab fa-twitter', to: '#' },
  { iconClass: 'fab fa-instagram', to: '#' }
];

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

watch(isMenuOpen, (isOpen) => {
  if (isOpen) {
    document.body.classList.add('no-scroll');
  } else {
    document.body.classList.remove('no-scroll');
  }
});

const handleResize = () => {
  if (window.innerWidth >= 768) {
    isMenuOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <header class="main-header">
    <div class="container">
      <NuxtLink to="/" class="logo" @click="closeMenu">
        Foodieland.
      </NuxtLink>

      <button class="burger-btn" :aria-expanded="isMenuOpen" aria-controls="main-menu" @click="toggleMenu">
        <span class="icon-bar"/>
        <span class="icon-bar"/>
        <span class="icon-bar"/>
      </button>

      <nav 
        id="main-menu"
        class="main-nav" 
        :class="{ 'is-open': isMenuOpen }"
      >
        <ul class="nav-list">
          <li v-for="link in navLinks" :key="link.name" class="nav-item">
            <NuxtLink :to="link.to" class="nav-link" @click="closeMenu">
              {{ link.name }}
            </NuxtLink>
          </li>
        </ul>

        <div class="social-links mobile-only">
          <a v-for="(social, index) in socialLinks" :key="index" :href="social.to" target="_blank" class="social-icon" @click="closeMenu">
            <span :class="social.iconClass"/>
          </a>
        </div>
      </nav>

      <div class="social-links desktop-only">
        <a v-for="(social, index) in socialLinks" :key="index" :href="social.to" target="_blank" class="social-icon">
          <span :class="social.iconClass" />
        </a>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.main-header {
  border-bottom: 1px solid $light-border-color;
  padding: 1.5rem 0;
  position: relative;
  z-index: 100;
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

.main-nav {
  display: none;
}

.social-links.desktop-only {
  display: none;
}

.social-links.mobile-only {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}

.burger-btn {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 30px;
  height: 30px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1001;

  .icon-bar {
    width: 100%;
    height: 3px;
    background-color: $text-color;
    transition: all 0.2s ease-in-out;
  }
}

.main-nav.is-open {
  display: flex;
  flex-direction: column;
  position: fixed;
  inset: 0;
  width: 100vw !important;
  height: 100vh !important;
  max-width: none !important;
  margin: 0 !important;
  padding: 8rem 0 0 0 !important;
  background-color: white;
  z-index: 999;
  padding-top: 8rem;
  justify-content: flex-start;
  align-items: center;

  .nav-list {
    flex-direction: column;
    text-align: center;
    width: 100%;
  }

  .nav-item {
    margin: 1rem 0;
  }

  .nav-link {
    font-size: 1.2rem;
    padding: 0.5rem 0;
    display: block;
  }
}

.social-links.mobile-only {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

@media (min-width: 768px) {
  .burger-btn {
    display: none;
  }

  .main-nav {
    display: flex !important;
    position: static;
    flex-direction: row;
    width: auto;
    box-shadow: none;
    padding: 0;
    margin: 0 2rem;

    .nav-list {
      flex-direction: row;
    }
  }

  .social-links.desktop-only {
    display: flex;
  }

  .social-links.mobile-only {
    display: none;
  }
}
</style>
