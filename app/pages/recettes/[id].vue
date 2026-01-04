<script lang="ts" setup>
const route = useRoute()
const config = useRuntimeConfig()

// 1. Récupération des données
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
  meta: [{ name: 'description', content: recipe.value.description }]
})

// 4. Image Hero en Background (Fonctionnel)
const heroStyle = computed(() => {
  const imgName = recipe.value?.image_url
  const finalImage = (imgName && imgName.includes('.')) 
    ? `/recipes/${imgName}` 
    : '/recipes/default.jpg'

  return { backgroundImage: `url('${finalImage}')` }
})

// 5. Interaction (Cocher les ingrédients)
const checkedIngredients = ref(new Set())
const toggleIngredient = (index: number) => {
  if (checkedIngredients.value.has(index)) checkedIngredients.value.delete(index)
  else checkedIngredients.value.add(index)
}
</script>

<template>
  <div v-if="recipe" class="recipe-detail-page">
    
    <header class="recipe-hero" :style="heroStyle">
      <div class="hero-overlay">
        <div class="container hero-content">
          
          <div class="hero-badges">
            <span class="badge" v-if="recipe.cuisine_name">
              <i class="fa-solid fa-utensils"></i> {{ recipe.cuisine_name }}
            </span>
            <span class="badge badge-goal" v-if="recipe.goal_name">
              <i class="fa-solid fa-bullseye"></i> {{ recipe.goal_name }}
            </span>
          </div>

          <h1 class="hero-title">{{ recipe.title }}</h1>
        </div>
      </div>
    </header>

    <main class="recipe-content-main">
      <div class="container">
        
        <div v-if="recipe.description" class="description-block">
           <p>{{ recipe.description }}</p>
        </div>

        <section class="recipe-section ingredients-section">
          <h2 class="section-title"><i class="fa-solid fa-basket-shopping"></i> Ingrédients</h2>
          
          <div class="ingredients-wrapper">
             <ul class="ingredient-list" v-if="recipe.ingredients && recipe.ingredients.length">
                <li 
                  v-for="(ing, index) in recipe.ingredients" 
                  :key="index" 
                  class="ingredient-item"
                  :class="{ 'is-checked': checkedIngredients.has(index) }"
                  @click="toggleIngredient(index)"
                >
                  <div class="checkbox-circle">
                    <i class="fa-solid fa-check" v-if="checkedIngredients.has(index)"></i>
                  </div>
                  <div class="ing-details">
                    <span class="qty" v-if="ing.quantity">{{ ing.quantity }} {{ ing.unit }}</span>
                    <span class="name">{{ ing.name }}</span>
                  </div>
                </li>
             </ul>
             <p v-else class="empty-msg">Aucun ingrédient listé.</p>
          </div>
        </section>

        <section class="recipe-section instructions-section">
          <h2 class="section-title"><i class="fa-solid fa-fire-burner"></i> Préparation</h2>
          
          <div class="steps-wrapper">
            <div v-if="recipe.instructions && Array.isArray(recipe.instructions) && recipe.instructions.length > 0">
               <div v-for="(step, index) in recipe.instructions" :key="index" class="step-card">
                  <div class="step-number">{{ step.step_number || index + 1 }}</div>
                  <p class="step-desc">{{ step.description }}</p>
               </div>
            </div>
            
            <div v-else-if="recipe.instructions && typeof recipe.instructions === 'string'" class="text-fallback">
              <p>{{ recipe.instructions }}</p>
            </div>
            
            <p v-else class="empty-msg">Aucune instruction disponible.</p>
          </div>
        </section>

      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
// --- VARIABLES ---
$primary: #ff6600;
$dark: #1a1a1a;
$text: #444;
$bg-light: #f9f9fc;
$border: #eee;
$radius: 12px;

.container {
    max-width: 900px; // Largeur lecture confortable
    margin: 0 auto;
    padding: 0 20px;
}

// --- HERO SECTION (Image en background) ---
.recipe-hero {
    height: 60vh;
    min-height: 400px;
    background-size: cover;
    background-position: center;
    position: relative;
    
    // Dégradé sombre pour lisibilité
    .hero-overlay {
        position: absolute; inset: 0;
        background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.4) 100%);
        display: flex;
        align-items: flex-end;
        padding-bottom: 60px;
    }

    .hero-content {
        width: 100%;
        text-align: center;
    }

    .hero-badges {
        display: flex;
        justify-content: center;
        gap: 15px;
        margin-bottom: 20px;

        .badge {
            background: rgba(255, 255, 255, 0.95);
            color: $dark;
            padding: 6px 16px;
            border-radius: 30px;
            font-weight: 700;
            text-transform: uppercase;
            font-size: 0.9rem;
            display: inline-flex; align-items: center; gap: 8px;

            &.badge-goal {
                background: $primary;
                color: white;
            }
        }
    }

    .hero-title {
        font-family: 'Inter', sans-serif;
        font-size: 3.5rem;
        color: white;
        margin: 0;
        line-height: 1.1;
        text-shadow: 0 4px 10px rgba(0,0,0,0.5);
        
        @media (max-width: 768px) { font-size: 2.2rem; }
    }
}

// --- CONTENU PRINCIPAL ---
.recipe-content-main {
    padding: 60px 0;
    background-color: white;
}

.description-block {
    text-align: center;
    font-size: 1.25rem;
    line-height: 1.6;
    color: #666;
    margin-bottom: 60px;
    font-style: italic;
}

// --- SECTIONS ---
.recipe-section {
    margin-bottom: 60px;
}

.section-title {
    font-size: 1.8rem;
    font-weight: 800;
    color: $dark;
    margin-bottom: 30px;
    padding-bottom: 15px;
    border-bottom: 2px solid $border;
    display: flex; align-items: center; gap: 12px;
    
    i { color: $primary; }
}

// --- INGREDIENTS (Liste Moderne) ---
.ingredients-wrapper {
    background: $bg-light;
    padding: 30px;
    border-radius: $radius;
}

.ingredient-list {
    list-style: none;
    padding: 0;
    // Grille automatique : ça remplit la largeur
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 15px;
}

.ingredient-item {
    background: white;
    padding: 12px 15px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    gap: 15px;
    cursor: pointer;
    border: 1px solid transparent;
    transition: all 0.2s;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.05);
    }

    &.is-checked {
        opacity: 0.5;
        .checkbox-circle { background: $primary; border-color: $primary; color: white; }
        .name { text-decoration: line-through; }
    }

    .checkbox-circle {
        width: 24px; height: 24px;
        border: 2px solid #ddd;
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        color: white;
        font-size: 0.8rem;
        transition: 0.2s;
    }

    .ing-details {
        font-size: 1rem;
        .qty { font-weight: 700; color: $primary; margin-right: 5px; }
        .name { color: $text; }
    }
}

// --- INSTRUCTIONS (Liste verticale) ---
.steps-wrapper {
    display: flex;
    flex-direction: column;
    gap: 25px;
}

.step-card {
    display: flex;
    gap: 20px;
    
    .step-number {
        flex-shrink: 0;
        width: 45px; height: 45px;
        background: $dark;
        color: white;
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-weight: 700;
        font-size: 1.2rem;
    }
    
    .step-desc {
        padding-top: 8px;
        font-size: 1.1rem;
        line-height: 1.6;
        color: $text;
    }
}

.text-fallback p {
    white-space: pre-line;
    line-height: 1.8;
}

.empty-msg { color: #999; font-style: italic; }
</style>