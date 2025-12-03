<script setup lang="ts">
// Définis les liens que tu veux répéter dans le Footer
const footerLinks = [
  { name: 'Recipes', to: '/recettes' },
  { name: 'Blog', to: '/blog' },
  { name: 'Contact', to: '/contact' }, 
  { name: 'About us', to: '/a-propos'}
];

// Définis les liens vers les réseaux sociaux
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
    text-align: center; /* Centrage par défaut pour le mobile */
}

.container {
    display: flex;
    flex-direction: column; /* 🛑 Mobile-First: Empile les blocs verticalement */
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    gap: 2rem; /* Espacement entre les blocs sur mobile */
}

/* --- Bloc d'Information (Logo/Tagline) --- */
.info-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    order: 1; /* Reste en haut */
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
    order: 3; /* Le copyright se retrouve en bas de tout sur mobile */
    margin-top: 1rem;
}

/* --- Navigation du Footer --- */
.footer-nav {
    order: 2;
    // On cache la navigation pour le mobile, car elle est souvent répétitive
    display: none; 
}

/* --- Liens Sociaux --- */
.social-links {
    display: flex;
    gap: 1.5rem; 
    order: 4; /* Vient après l'info sur mobile */
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

// ===============================================
// MEDIA QUERY : Version Desktop (à partir de 768px)
// ===============================================
@media (min-width: 768px) {
    .main-footer {
        text-align: left; /* Réaligner à gauche sur desktop */
    }

    .container {
        flex-direction: row; /* 🛑 Desktop: Affiche les blocs horizontalement */
        justify-content: space-between;
        align-items: flex-start;
        gap: 3rem; 
    }
    
    /* Bloc Info/Copyright */
    .info-block {
        order: 1; 
        align-items: flex-start;
        // On pourrait réduire la largeur ici si on veut
    }
    
    /* Navigation (réactiver l'affichage) */
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
    
    /* Liens Sociaux */
    .social-links {
        order: 3; 
        margin-top: 0;
    }

    /* Le copyright doit être dans l'info-block, et la navigation et les liens sociaux 
       doivent être alignés sur le côté droit pour ressembler au design */
    
    /* Pour un layout plus proche du design, on peut forcer l'alignement à la fin 
       et s'assurer que l'info-block prend l'espace nécessaire. */

    .container {
        // Optionnel : s'assurer que l'info est à gauche et le reste à droite
        // Si tu veux que la navigation et les sociaux soient groupés à droite:
        justify-content: space-between;
        align-items: center; 
    }
    
    .footer-nav {
        margin-left: auto; /* Pousse la navigation vers la droite */
        margin-right: 2rem; 
    }
    
    .copyright {
        order: initial; /* Retourne à l'ordre normal */
        margin-top: 2rem;
    }
}
</style>