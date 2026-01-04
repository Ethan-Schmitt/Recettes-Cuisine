<script lang="ts" setup>
// Pas besoin d'importer manuellement useRoute, etc. Nuxt le fait automatiquement.
const route = useRoute()
const config = useRuntimeConfig()

// 1. Récupération des données
// On ajoute 'transform' pour s'assurer que si ingredients est null, on a un tableau vide
const { data: recipe, error } = await useAsyncData(`recipe-${route.params.id}`, async () => {
  const response = await $fetch<any>(`${config.public.apiUrl}/api/recipes/${route.params.id}`)
  return response.data
})

// 2. Erreur 404
if (!recipe.value || error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Recette non trouvée.', fatal: true })
}

// 3. SEO
useHead({
  title: recipe.value.title + ' - Foodieland',
  meta: [
    { name: 'description', content: `Détails de la recette : ${recipe.value.title}.` }
  ]
})

// 4. Image Hero
const heroStyle = computed(() => {
  const imgName = recipe.value?.image_url
  const finalImage = (imgName && imgName.includes('.')) 
    ? `/recipes/${imgName}` 
    : '/recipes/default.jpg'

  return { backgroundImage: `url('${finalImage}')` }
})
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
        
        <div v-if="recipe.description" class="description-block">
             <p>{{ recipe.description }}</p>
        </div>

        <div class="content-grid">
          
          <section class="ingredients-card">
            <h2 class="section-title">🔪 Ingrédients</h2>
            
            <ul class="ingredient-list">
              <li v-for="(ingredient, index) in (recipe.ingredients || [])" :key="index">
                <span class="quantity" v-if="ingredient.quantity">
                  {{ ingredient.quantity }} {{ ingredient.unit }}
                </span>
                <span class="name">
                  {{ ingredient.name }}
                </span>
              </li>
            </ul>

            <p v-if="!recipe.ingredients || recipe.ingredients.length === 0" class="empty-msg">
                Aucun ingrédient listé.
            </p>
          </section>

          <section class="instructions-section">
            <h2 class="section-title">🧑‍🍳 Préparation</h2>
            <div class="instructions">
              
              <div v-if="recipe.instructions && Array.isArray(recipe.instructions) && recipe.instructions.length > 0">
                  <div v-for="(instruction, index) in recipe.instructions" :key="index" class="step-item">
                    <span class="step-num" v-if="instruction.step_number">{{ instruction.step_number }}.</span>
                    <p>{{ instruction.description }}</p>
                  </div>
              </div>
              
              <p v-else-if="recipe.instructions && typeof recipe.instructions === 'string'">
                {{ recipe.instructions }}
              </p>
              
              <p v-else class="empty-msg">Aucune instruction disponible.</p>
            </div>
          </section>

        </div>
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
$primary-color: #ff6600;
$text-color: #333;
$light-border-color: #eee;
$radius: 8px;
$font-header: 'Inter', sans-serif;
$font-body: 'Inter', sans-serif;

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* HERO SECTION */
.recipe-hero {
    height: 60vh;
    min-height: 400px;
    background-size: cover;
    background-position: center;
    position: relative;
    display: flex;
    align-items: flex-end;
    
    .hero-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0.5) 100%);
        padding-bottom: 50px;
        display: flex;
        align-items: flex-end;
    }
    
    .container {
        position: relative; 
        z-index: 10;
        width: 100%;
        text-align: center;
    }

    &__cuisine {
        font-family: $font-body;
        color: $primary-color;
        background: rgba(255, 255, 255, 0.9);
        padding: 5px 15px;
        border-radius: 20px;
        display: inline-block;
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
        @media (max-width: 768px) { font-size: 2.5rem; }
    }
}

.recipe-content-main {
    padding: 50px 0;
}

/* DESCRIPTION (Pleine largeur) */
.description-block {
    text-align: center;
    max-width: 800px;
    margin: 0 auto 50px auto;
    
    p {
        font-size: 1.2rem;
        line-height: 1.6;
        font-style: italic;
        color: #555;
    }
}

/* GRILLE */
.content-grid {
    display: grid;
    grid-template-columns: 1fr 2fr; /* Ingrédients (1/3) - Prépa (2/3) */
    gap: 60px;
    align-items: start;
    
    @media (max-width: 900px) {
         grid-template-columns: 1fr;
         gap: 40px;
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

/* INGREDIENTS */
.ingredients-card {
    background-color: white;
    padding: 30px;
    border-radius: $radius;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
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
        li:last-child { border-bottom: none; }
        
        .quantity {
            color: $primary-color;
            font-weight: 600;
            margin-right: 15px;
            white-space: nowrap;
        }
        .name { color: $text-color; text-align: right; }
    }
}

/* PREPARATION */
.instructions-section {
    font-family: $font-body;

    .step-item {
        display: flex;
        gap: 15px;
        margin-bottom: 20px;
        
        .step-num {
            font-weight: bold;
            color: $primary-color;
            font-size: 1.2rem;
            min-width: 25px;
        }
        p {
            margin: 0;
            line-height: 1.6;
            color: #333;
            font-size: 1.1rem;
        }
    }
}

.empty-msg { color: #999; font-style: italic; }
</style>