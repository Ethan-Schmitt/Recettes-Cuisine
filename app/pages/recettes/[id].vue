<script lang="ts" setup>
// 🛑 Importer les types nécessaires
import { useRoute, useRuntimeConfig, useAsyncData, createError, useHead } from '#imports'

const route = useRoute()
const config = useRuntimeConfig()

// Appel API pour récupérer une seule recette par ID
const { data: recipe, error } = await useAsyncData(`recipe-${route.params.id}`, async () => {
  // Supposons que l'API retourne l'objet { data: FullRecipe }
  const { data } = await $fetch<ApiResponse<FullRecipe>>(`${config.public.apiUrl}/api/recipes/${route.params.id}`)
  return data
})

// Gestion des erreurs
if (!recipe.value || error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Recette non trouvée.', fatal: true })
}

// Mise à jour des métadonnées (SEO)
useHead({
  title: recipe.value.title + ' - Foodieland',
  meta: [
    {
      name: 'description',
      content: `Détails de la recette : ${recipe.value.title}. Une spécialité de la cuisine ${recipe.value.cuisine_name}.`
    }
  ]
})

// Variables CSS pour le Hero (Note : Ces variables doivent être définies 
// soit globalement, soit importées si non globales. Ici, on les passe au template via style.)
const heroStyle = computed(() => ({
  backgroundImage: `url('/recipes/${recipe.value?.image_url}')`
}))
</script>

<template>
  <div v-if="recipe" class="recipe-detail-page">
    
    <header class="recipe-hero" :style="heroStyle">
      <div class="hero-overlay">
        <div class="container">
          <p class="recipe-hero__cuisine">
            {{ recipe.cuisine_name || 'Recette' }}
          </p>
          <h1 class="recipe-hero__title">{{ recipe.title }}</h1>
        </div>
      </div>
    </header>
    
    <main class="recipe-content-main">
      <div class="container">
        <div class="content-grid">
          
          <section class="ingredients-card">
            <h2 class="section-title">🔪 Ingrédients</h2>
            <ul class="ingredient-list">
              <li v-for="(ingredient, index) in recipe.ingredients" :key="index">
                <span class="quantity">
                  {{ ingredient.quantity }} {{ ingredient.unit }}
                </span>
                <span class="name">
                  {{ ingredient.name }}
                </span>
              </li>
            </ul>
          </section>

          <section class="instructions-section">
            <h2 class="section-title">🧑‍🍳 Préparation</h2>
            <div class="instructions">
              <p v-for="(instruction, index) in recipe.instructions" :key="index">
                {{ instruction.description }}
              </p>
            </div>
          </section>

        </div>
      </div>
    </main>

  </div>
</template>

<style lang="scss" scoped>

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* -------------------------------------------
   1. HERO SECTION (Image de fond)
   ------------------------------------------- */
.recipe-hero {
    // Hauteur et propriétés de l'image de fond
    height: 60vh;
    min-height: 400px;
    background-size: cover;
    background-position: center;
    position: relative;
    display: flex;
    align-items: flex-end;
    
    // Gradient pour obscurcir l'image et rendre le texte lisible
    .hero-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0.5) 100%);
        padding-bottom: 50px;
        display: flex;
        align-items: flex-end;
    }
    
    .container {
        // Garantit que le contenu est bien au-dessus de l'overlay
        position: relative; 
        z-index: 10;
        width: 100%;
        text-align: center;
    }

    &__cuisine {
        font-family: $font-body;
        color: $primary-color;
        font-size: 1.2rem;
        font-weight: 700;
        text-transform: uppercase;
        margin-bottom: 10px;
    }

    &__title {
        font-family: $font-header;
        font-size: 4rem;
        color: white;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        margin: 0;
        line-height: 1.1;

        @media (max-width: 768px) {
            font-size: 2.5rem;
        }
    }
}

/* -------------------------------------------
   2. CONTENU PRINCIPAL
   ------------------------------------------- */
.recipe-content-main {
    padding: 50px 0;
    
    .content-grid {
        display: grid;
        grid-template-columns: 1fr 2fr; // Ingrédients plus petits, instructions plus grandes
        gap: 40px;
        margin-top: -80px; // Pour remonter visuellement la carte des ingrédients
        position: relative;
        z-index: 5;
        
        @media (max-width: 1024px) {
             grid-template-columns: 1fr; // Empilement sur tablette et mobile
             margin-top: 0;
        }
    }
}

.section-title {
    font-family: $font-header;
    font-size: 1.8rem;
    color: $primary-color;
    border-bottom: 2px solid $light-border-color;
    padding-bottom: 10px;
    margin-bottom: 25px;
    font-weight: 700;
}

/* --- Ingrédients (Carte Latérale) --- */
.ingredients-card {
    background-color: white;
    padding: 30px;
    border-radius: $radius;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    height: fit-content; // Important pour éviter qu'elle ne prenne toute la hauteur en desktop
    border-top: 5px solid $primary-color;

    .ingredient-list {
        list-style: none;
        padding: 0;
        
        li {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px dotted $light-border-color;
            font-family: $font-body;
            font-size: 1rem;
        }
        
        li:last-child {
            border-bottom: none;
        }
        
        .quantity {
            color: $primary-color;
            font-weight: 600;
            margin-right: 15px;
            white-space: nowrap; // Empêche la quantité de couper
        }
        
        .name {
            color: $text-color;
            text-align: right;
        }
    }
}

/* --- Instructions --- */
.instructions-section {
    padding: 20px 0;
    font-family: $font-body;

    .instructions {
        color: $text-color;
        line-height: 1.8;
        font-size: 1.1rem;
        
        // Style pour les étapes (si l'API utilise des <br> pour les séparer)
        & > br {
            content: "";
            display: block;
            margin-top: 15px;
        }
        
        // Si tu utilises des numéros dans tes instructions, tu peux les styliser
        /*
        & > p {
            margin-bottom: 15px;
        }
        */
    }
}
</style>