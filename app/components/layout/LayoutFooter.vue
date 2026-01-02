<script setup lang="ts">
const footerLinks = [
  { name: 'Recipes', to: '/recettes' },
  { name: 'Dashboard', to: '/dashboard' },
  { name: 'Contact', to: '/contact' }, 
];

const socialLinks = [
  { iconClass: 'fab fa-facebook-f', to: '#' },
  { iconClass: 'fab fa-twitter', to: '#' },
  { iconClass: 'fab fa-instagram', to: '#' },
];
</script>

<template>
  <footer class="main-footer">
    <div class="container">
      
      <div class="footer-block info-block">
        <NuxtLink to="/" class="logo">
          Foodieland.
        </NuxtLink>
        <p class="tagline">Trouvez l'inspiration, créez la magie.</p>
        <p class="copyright">© {{ new Date().getFullYear() }} Foodieland. All rights reserved.</p>
      </div>

      <nav class="footer-nav">
        <ul class="nav-list">
          <li v-for="link in footerLinks" :key="link.name" class="nav-item">
            <NuxtLink :to="link.to" class="nav-link">
              {{ link.name }}
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <div class="social-links">
        <a v-for="(social, index) in socialLinks" :key="index" :href="social.to" target="_blank" class="social-icon">
          <span :class="social.iconClass" /> 
        </a>
      </div>

    </div>
  </footer>
</template>

<style lang="scss">
.main-footer {
    border-top: 1px solid $light-border-color;
    padding: 2rem 0;
    color: $text-color;
    text-align: center;
}

.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    gap: 2rem;
}

.info-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    order: 1;
}

.logo {
    font-family: $font-header;
    font-size: 1.8rem;
    font-weight: bold;
    color: $text-color;
    text-decoration: none;
    margin-bottom: 0.5rem;
    
    &::first-letter {
        color: $primary-color; 
    }
}

.tagline {
    font-size: 0.9rem;
    color: lighten($text-color, 30%);
    max-width: 300px;
    margin-top: 0.5rem;
}

.copyright {
    font-size: 0.8rem;
    color: lighten($text-color, 40%);
    order: 3;
    margin-top: 1rem;
}

.footer-nav {
    order: 2;
    display: none; 
}

.social-links {
    display: flex;
    gap: 1.5rem; 
    order: 4;
    margin-top: 1.5rem;
}

.social-icon {
    color: $text-color;
    font-size: 1.2rem;
    transition: color 0.2s;

    &:hover {
        color: $primary-color;
    }
}

@media (min-width: 768px) {
    .main-footer {
        text-align: left;
    }

    .container {
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;
        gap: 3rem; 
    }
    
    .info-block {
        order: 1; 
        align-items: flex-start;
    }
    
    .footer-nav {
        display: block; 
        order: 2; 
    }
    
    .nav-list {
        display: flex;
        gap: 1.5rem;
        list-style: none;
        padding: 0;
        margin: 0;
    }
    
    .social-links {
        order: 3; 
        margin-top: 0;
    }

    .container {
        justify-content: space-between;
        align-items: center; 
    }
    
    .footer-nav {
        margin-left: auto;
        margin-right: 2rem; 
    }
    
    .copyright {
        order: initial;
        margin-top: 2rem;
    }
}
</style>
