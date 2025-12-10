<script setup lang="ts">
const config = useRuntimeConfig()

useHead({
  title: 'Accueil - Recettes Gourmandes',
  meta: [
    {
      name: 'description',
      content: 'Découvrez une variété de recettes gourmandes de différentes cuisines du monde entier.'
    }
  ]
})

const [{ data: recipes, error }, { data: cuisines }] = await Promise.all([
  useAsyncData('recipes', async () => {
  
    const { data } = await $fetch<any>(`${config.public.apiUrl}/api/recipes`)
    return data
  }),
  useAsyncData('cuisines', async () => {
    const { data } = await $fetch<any>(`${config.public.apiUrl}/api/cuisines`)
    return data
  })
])

const page = ref(1)
const RECIPES_PER_PAGE = 2

const search = ref('')
const filters = ref<any[]>([]) 

function onCheckboxInput ($event: Event) {
  const target = $event.target
  if (!(target instanceof HTMLInputElement)) return
  const value = target.value
  if (!filters.value.includes(value)) {
    filters.value.push(value)
  } else {
    const index = filters.value.findIndex(filterValue => filterValue === value)
    filters.value.splice(index, 1)
  }
}

watch(() => [filters.value, search.value], () => {
  page.value = 1
})

const filteredRecipes = computed<any[]>(() => { // Utilisation de 'any[]' pour l'exemple, à remplacer par Recipe[]
  // Gestion de recipes.value potentiellement nul au début
  if (!recipes.value) return []

  let results = recipes.value

  if (filters.value && filters.value.length) {
    results = results.filter((recipe: any) => filters.value.includes(recipe.cuisine_name))
  }

  if (search.value.length) {
    results = results.filter((recipe: any) => {
      return recipe.title.toLowerCase().includes(search.value.toLowerCase())
    })
  }
  
  return results
})

const displayedRecipes = computed<any[]>(() => { // Utilisation de 'any[]' pour l'exemple, à remplacer par Recipe[]
  if (!filteredRecipes.value) return []
  return filteredRecipes.value.slice((page.value - 1) * RECIPES_PER_PAGE, page.value * RECIPES_PER_PAGE)
})

const totalPages = computed(() => {
  return Math.ceil(filteredRecipes.value.length / RECIPES_PER_PAGE)
})

function onPageClick (index: number) {
  if (index >= 1 && index <= totalPages.value) {
    page.value = index
  }
}

if (error && error.value) throw new Error('Page not Found')
</script>

<template>
  <div class="homepage-container">
    
    <MyTitle as="h1" class="page-title">Nos Recettes Gourmandes</MyTitle>

    <div class="control-zone">
      
      <div class="search-bar">
        <label for="recipe-search" class="visually-hidden">Rechercher une recette</label>
        <input 
          id="recipe-search"
          v-model="search" 
          type="text" 
          placeholder="Rechercher par titre..."
          class="input-search"
        >
      </div>

      <div class="recipes-filters">
        <h3 class="filters-title">Filtrer par cuisine :</h3>
        <div class="filters-list">
          <div 
            v-for="(cuisine, index) in (cuisines || [])" 
            :key="index" 
            class="recipes-filters__item"
          >
            <input 
              :id="cuisine.name" 
              type="checkbox" 
              :value="cuisine.name" 
              class="hidden-checkbox"
              @input="onCheckboxInput"
            >
            <label 
              :for="cuisine.name" 
              :class="['filter-label', { 'is-active': filters.includes(cuisine.name) }]"
            >
              {{ cuisine.name }}
            </label>
          </div>
        </div>
      </div>
    </div>
    
    <section class="results-section">
      <p class="results-info">
        Affichage de {{ displayedRecipes.length }} recettes 
        (Total : {{ filteredRecipes.length }})  </p>

      <div class="recipes-grid">
        <article v-for="(recipe, index) in displayedRecipes" :key="index" class="recipe-card">
           <NuxtImg :src="`/recipes/${recipe.image_url}`" :alt="recipe.title" class="recipe-image" loading="lazy" />
          <div class="recipe-content">
            <span class="recipe-cuisine">{{ recipe.cuisine_name }}</span>
           <NuxtLink :to="`/recettes/${recipe.recipe_id}`" class="recipe-title-link">
    <h2 class="recipe-title">{{ recipe.title }}</h2>
</NuxtLink>
          </div>
        </article>
        
        <div v-if="filteredRecipes.length === 0" class="no-results"> <p>Désolé, aucune recette ne correspond à tes critères de recherche et de filtre.</p>
        </div>
      </div>
    </section>

    <nav v-if="totalPages > 1" class="pagination-nav" aria-label="Pagination des recettes">
      <button 
        :disabled="page === 1"
        class="pagination-button"
      @click="onPageClick(page - 1)" 
       >
        Précédent
      </button>
      
      <div class="pages-list">
        <button
          v-for="n in totalPages" 
          :key="`page-${n}`" 
          :class="['page-number-button', { 'is-current': page === n }]"
          :aria-current="page === n ? 'page' : undefined"
          @click="onPageClick(n)"
        >
          {{ n }}
        </button>
      </div>

      <button 
      :disabled="page === totalPages"
      class="pagination-button"  
      @click="onPageClick(page + 1)" 
      >
        Suivant
      </button>
    </nav>
    
  </div>
</template>

<style lang="scss">

.homepage-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-title {
  text-align: center;
  margin-bottom: 40px;
  color: $primary-color;
  font-size: 2.5rem;
}


.control-zone {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 40px;
  padding: 20px;
  background-color: $color-secondary;
  border-radius: $radius;
}

/* RECHERCHE */
.search-bar {
  .input-search {
    width: 100%;
    padding: 12px 0px;
    border: 1px solid #ccc;
    border-radius: $radius;
    font-size: 1rem;
    &:focus {
      border-color: $primary-color;
      outline: none;
      box-shadow: 0 0 0 2px rgba($primary-color, 0.3);
    }
  }
}

/* FILTRES */
.filters-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: $text-color;
}

.filters-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.recipes-filters__item {
  // Masque le checkbox par défaut
  .hidden-checkbox {
    display: none; 
  }

  .filter-label {
    cursor: pointer;
    padding: 8px 15px;
    border: 2px solid #ccc;
    border-radius: 50px; 
    transition: all 0.2s ease;
    user-select: none;
    font-size: 0.9rem;
    font-weight: 500;
    color: $text-color;
   
    
    &.is-active {
      background-color: $primary-color;
      border-color: $primary-color;
    }

    &:hover {
      border-color: $primary-color;
    }
  }
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

/* --- GRILLE DE RECETTES --- */
.results-info {
  margin-bottom: 20px;
  font-style: italic;
  text-align: center;
}

.recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); 
  gap: 30px;
  margin-bottom: 40px;
}

.recipe-card {
  display: flex;
  flex-direction: column;
  border-radius: $radius;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
  }

  .recipe-image {
    width: 100%;
    height: 200px;
    object-fit: cover; 
  }

  .recipe-content {
    padding: 15px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
  
  .recipe-cuisine {
    display: inline-block;
    font-size: 0.8rem;
    color: $primary-color;
    font-weight: bold;
    margin-bottom: 5px;
  }

  .recipe-title-link {
    text-decoration: none;
    color: $text-color;
    &:hover .recipe-title {
      text-decoration: underline;
      color: darken($primary-color, 10%);
    }
  }

  .recipe-title {
    font-size: 1.3rem;
    margin: 0;
    line-height: 1.3;
  }
}

.no-results {
  grid-column: 1 / -1; 
  text-align: center;
  padding: 40px;
  background-color: $color-secondary;
  border-radius: $radius;
  font-size: 1.2rem;
  color: $text-color;
}

/* --- PAGINATION --- */
.pagination-nav {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  margin-bottom: 40px;
}

.pagination-button {
  background-color: $primary-color;
  border: none;
  padding: 10px 15px;
  border-radius: $radius;
  cursor: pointer;
  transition: background-color 0.2s;
  font-weight: bold;

  &:hover:not(:disabled) {
    background-color: darken($primary-color, 10%);
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
}

.pages-list {
  display: flex;
  gap: 5px;
}

.page-number-button {
  background: none;
  border: 1px solid #ccc;
  color: $text-color;
  padding: 8px 12px;
  min-width: 40px;
  text-align: center;
  border-radius: $radius;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: $color-secondary;
    border-color: $primary-color;
  }

  &.is-current {
    background-color: $primary-color;
    border-color: $primary-color;
    font-weight: bold;
  }
}

// Media Query pour la réactivité sur mobile
@media (max-width: 768px) {
  .control-zone {
    padding: 15px;
  }

  .recipe-card {
    .recipe-image {
      height: 150px;
    }
    .recipe-title {
      font-size: 1.1rem;
    }
  }
}
</style>