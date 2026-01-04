<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({
  middleware: ['auth']
})

const config = useRuntimeConfig()
const router = useRouter()
const token = useCookie('recipe_token')

// --- LOGIQUE (On ne touche pas, elle fonctionne) ---

const { data: cuisinesData } = await useFetch<any>(`${config.public.apiUrl}/api/cuisines`)
const { data: goalsData } = await useFetch<any>(`${config.public.apiUrl}/api/goals`)

const cuisineList = computed(() => cuisinesData.value?.data || cuisinesData.value || [])
const goalList = computed(() => goalsData.value?.data || goalsData.value || [])

const form = ref({
  title: '',
  description: '',
  instructions: '',
  cuisine_id: '',
  goal_id: '',
  image_url: 'default-recipe.jpg',
  ingredients: [
    { name: '', quantity: 1, unit: '' }
  ]
})

const loading = ref(false)
const errorMsg = ref('')

const addIngredient = () => {
  form.value.ingredients.push({ name: '', quantity: 1, unit: '' })
}

const removeIngredient = (index: number) => {
  if (form.value.ingredients.length > 1) {
    form.value.ingredients.splice(index, 1)
  }
}

const onSubmit = async () => {
  loading.value = true
  errorMsg.value = ''

  try {
    if (!form.value.title || !form.value.cuisine_id || !form.value.goal_id || !form.value.description) {
      throw new Error("Veuillez remplir tous les champs obligatoires.")
    }

    const cleanIngredients = form.value.ingredients
      .filter(ing => ing.name && ing.name.trim() !== '')
      .map(ing => ({
        name: ing.name,
        unit: ing.unit,
        quantity: Number(ing.quantity)
      }))

    const instructionsArray = form.value.instructions
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map((line, index) => ({
        step_number: index + 1,
        description: line,
        ingredient_id: null 
      }))

    const payload = {
      title: form.value.title,
      description: form.value.description,
      image_url: form.value.image_url || 'default-recipe.jpg',
      cuisine_id: Number(form.value.cuisine_id),
      goal_id: Number(form.value.goal_id),
      ingredients: cleanIngredients,
      instructions: instructionsArray
    }

    await $fetch(`${config.public.apiUrl}/api/recipes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.value}`
      },
      body: JSON.stringify(payload)
    })

    router.push('/dashboard')

  } catch (err: any) {
    console.error("Erreur:", err)
    errorMsg.value = err.data?.message || err.message || "Une erreur est survenue."
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="page-wrapper">
    <div class="container">
      
      <div class="header-actions">
        <NuxtLink to="/dashboard" class="btn-back">
          <div class="icon-circle"><i class="fa-solid fa-arrow-left"></i></div>
          <span>Retour</span>
        </NuxtLink>
      </div>

      <div class="main-card">
        <header class="card-header">
          <h1 class="title">Créer une recette</h1>
          <p class="subtitle">Partagez vos meilleures astuces culinaires</p>
        </header>

        <form @submit.prevent="onSubmit" class="recipe-form">
          
          <transition name="fade">
            <div v-if="errorMsg" class="alert-box">
              <i class="fa-solid fa-circle-exclamation"></i>
              <span>{{ errorMsg }}</span>
            </div>
          </transition>

          <section class="form-section">
            <h2 class="section-title"><i class="fa-regular fa-file-lines"></i> Détails</h2>
            
            <div class="input-group">
              <label>Titre de la recette <span class="req">*</span></label>
              <input 
                v-model="form.title" 
                type="text" 
                placeholder="Ex: Pâtes à la Carbonara" 
                class="input-modern"
              >
            </div>

            <div class="input-group">
              <label>Description courte <span class="req">*</span></label>
              <textarea 
                v-model="form.description" 
                rows="3"
                placeholder="Donnez envie en quelques mots..."
                class="input-modern"
              ></textarea>
            </div>

            <div class="grid-2-col">
              <div class="input-group">
                <label>Cuisine <span class="req">*</span></label>
                <div class="select-wrapper">
                  <select v-model="form.cuisine_id" class="input-modern select-modern">
                    <option value="" disabled selected>Choisir...</option>
                    <option v-for="c in cuisineList" :key="c.cuisine_id" :value="c.cuisine_id">{{ c.name }}</option>
                  </select>
                  <i class="fa-solid fa-chevron-down select-icon"></i>
                </div>
              </div>

              <div class="input-group">
                <label>Objectif <span class="req">*</span></label>
                <div class="select-wrapper">
                  <select v-model="form.goal_id" class="input-modern select-modern">
                    <option value="" disabled selected>Choisir...</option>
                    <option v-for="g in goalList" :key="g.goal_id" :value="g.goal_id">{{ g.name }}</option>
                  </select>
                  <i class="fa-solid fa-chevron-down select-icon"></i>
                </div>
              </div>
            </div>

            <div class="input-group">
              <label>Image (URL)</label>
              <input 
                v-model="form.image_url" 
                type="text" 
                placeholder="Lien vers une image (Optionnel)" 
                class="input-modern"
              >
            </div>
          </section>

          <section class="form-section">
            <div class="section-header-row">
              <h2 class="section-title"><i class="fa-solid fa-basket-shopping"></i> Ingrédients</h2>
              <button type="button" class="btn-add" @click="addIngredient">
                <i class="fa-solid fa-plus"></i>
                <span>Ajouter</span>
              </button>
            </div>

            <div class="ingredients-container">
              <transition-group name="list" tag="div">
                <div 
                  v-for="(ing, index) in form.ingredients" 
                  :key="index" 
                  class="ingredient-row"
                >
                  <div class="ing-input small">
                    <input type="number" v-model="ing.quantity" placeholder="1" min="0">
                    <span class="label-inside">Qté</span>
                  </div>
                  <div class="ing-input medium">
                    <input type="text" v-model="ing.unit" placeholder="kg">
                    <span class="label-inside">Unité</span>
                  </div>
                  <div class="ing-input large">
                    <input type="text" v-model="ing.name" placeholder="Nom (ex: Farine)">
                    <span class="label-inside">Produit</span>
                  </div>
                  
                  <button 
                    type="button" 
                    class="btn-delete" 
                    @click="removeIngredient(index)"
                    :disabled="form.ingredients.length === 1"
                  >
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </transition-group>
            </div>
          </section>

          <section class="form-section no-border">
            <h2 class="section-title"><i class="fa-solid fa-fire-burner"></i> Préparation</h2>
            <div class="info-bubble">
              <i class="fa-solid fa-lightbulb"></i>
              <p>Astuce : Appuyez sur <strong>Entrée</strong> pour créer une nouvelle étape.</p>
            </div>
            <div class="input-group">
              <textarea 
                v-model="form.instructions" 
                class="input-modern instructions-area" 
                placeholder="1. Préchauffez le four...&#10;2. Mélangez la farine..."
              ></textarea>
            </div>
          </section>

          <div class="form-footer">
            <NuxtLink to="/dashboard" class="btn-cancel">Annuler</NuxtLink>
            <button type="submit" class="btn-submit" :disabled="loading">
              <span v-if="loading"><i class="fa-solid fa-circle-notch fa-spin"></i> Envoi...</span>
              <span v-else>Enregistrer la recette</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
// --- VARIABLES ---
$primary: #ff6600;
$primary-dark: #e65c00;
$text-dark: #111;
$text-light: #666;
$bg-page: #f2f4f8;
$white: #fff;
$border: #e2e8f0;
$radius: 16px;
$shadow: 0 20px 60px -10px rgba(0,0,0,0.08);

// --- GLOBAL LAYOUT (Centrage) ---
.page-wrapper {
  min-height: 100vh;
  background-color: $bg-page;
  padding: 40px 20px;
  
  // CENTRAGE PARFAIT FLEXBOX
  display: flex;
  align-items: center; /* Vertical */
  justify-content: center; /* Horizontal */
}

/* Sur mobile ou petits écrans, on évite de couper le haut si le formulaire est grand */
@media (max-height: 900px) {
    .page-wrapper {
        align-items: flex-start; /* On laisse scroller naturellement */
    }
}

.container {
  width: 100%;
  max-width: 800px;
  position: relative;
}

// --- HEADER ACTIONS ---
.header-actions {
  position: absolute;
  top: 0;
  left: -60px; /* Le bouton flotte à gauche sur grand écran */
  height: 100%;
}

.btn-back {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: $text-light;
  font-size: 0.8rem;
  font-weight: 600;
  position: sticky;
  top: 40px;
  transition: all 0.2s;

  .icon-circle {
    width: 40px;
    height: 40px;
    background: $white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    transition: all 0.2s;
  }

  &:hover {
    color: $primary;
    .icon-circle {
      transform: translateX(-3px);
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      color: $primary;
    }
  }
}

// --- MAIN CARD ---
.main-card {
  background: $white;
  border-radius: $radius;
  padding: 50px;
  box-shadow: $shadow;
  border: 1px solid rgba(255,255,255,0.5);
}

.card-header {
  text-align: center;
  margin-bottom: 50px;
  
  .title {
    font-size: 2.2rem;
    font-weight: 800;
    color: $text-dark;
    margin-bottom: 5px;
    letter-spacing: -1px;
  }
  .subtitle {
    color: $text-light;
    font-size: 1.1rem;
  }
}

// --- SECTIONS ---
.form-section {
  margin-bottom: 40px;
  padding-bottom: 40px;
  border-bottom: 1px solid $border;
  
  &.no-border { border-bottom: none; padding-bottom: 0; margin-bottom: 20px; }
}

.section-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: $text-dark;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  gap: 12px;
  
  i { color: $primary; }
}

// --- INPUTS ---
.input-group {
  margin-bottom: 25px;
  label {
    display: block;
    font-weight: 600;
    font-size: 0.95rem;
    margin-bottom: 10px;
    color: $text-dark;
    .req { color: $primary; }
  }
}

.input-modern {
  width: 100%;
  padding: 16px 20px;
  border: 1px solid $border;
  border-radius: 12px;
  font-size: 1rem;
  background: #fdfdfd;
  transition: all 0.2s ease;
  font-family: inherit;

  &:focus {
    background: $white;
    border-color: $primary;
    box-shadow: 0 0 0 4px rgba($primary, 0.1);
    outline: none;
  }
  
  &::placeholder { color: #bbb; }
}

.grid-2-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.select-wrapper {
  position: relative;
  .select-icon {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: $text-light;
    font-size: 0.8rem;
  }
  select { appearance: none; cursor: pointer; }
}

// --- INGREDIENTS ---
.section-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.btn-add {
  background: #fff0e6;
  color: $primary;
  border: none;
  padding: 10px 20px;
  border-radius: 30px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  
  &:hover { background: #ffe0cc; }
}

.ingredients-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.ingredient-row {
  display: flex;
  gap: 15px;
  align-items: center;
  
  .ing-input {
    position: relative;
    input {
      width: 100%;
      padding: 12px 12px 24px 12px;
      border: 1px solid $border;
      border-radius: 10px;
      font-size: 1rem;
      background: $white;
      transition: border-color 0.2s;
      
      &:focus { border-color: $primary; outline: none; }
    }
    .label-inside {
      position: absolute;
      bottom: 6px;
      left: 12px;
      font-size: 0.65rem;
      text-transform: uppercase;
      font-weight: 700;
      color: #aaa;
      pointer-events: none;
    }
  }

  .small { flex: 0 0 80px; }
  .medium { flex: 0 0 100px; }
  .large { flex: 1; }
}

.btn-delete {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: transparent;
  border: 1px solid transparent;
  color: #ccc;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s;
  
  &:hover { 
      background: #fff5f5; 
      color: #ff4444; 
      border-color: #ffe0e0;
  }
  &:disabled { opacity: 0; pointer-events: none; }
}

// --- INSTRUCTIONS ---
.info-bubble {
  background: #f0f7ff;
  color: #3b82f6;
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.instructions-area {
  min-height: 200px;
  line-height: 1.6;
}

// --- FOOTER ---
.form-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 25px;
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid $border;
}

.btn-cancel {
  color: $text-light;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
  &:hover { color: $text-dark; }
}

.btn-submit {
  background: $primary;
  color: white;
  border: none;
  padding: 16px 35px;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 10px 20px -5px rgba($primary, 0.4);
  transition: all 0.3s;
  
  &:hover {
    background: $primary-dark;
    transform: translateY(-2px);
    box-shadow: 0 15px 30px -5px rgba($primary, 0.5);
  }
  &:disabled {
    background: #ccc;
    box-shadow: none;
    cursor: not-allowed;
  }
}

.alert-box {
  background: #fee2e2;
  color: #b91c1c;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
}

// --- ANIMATIONS ---
.list-enter-active, .list-leave-active { transition: all 0.3s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateX(-20px); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

// --- RESPONSIVE MOBILE ---
@media (max-width: 1024px) {
    .header-actions {
        position: static;
        margin-bottom: 20px;
        display: flex;
        justify-content: flex-start;
    }
    .btn-back {
        flex-direction: row;
        position: static;
    }
}

@media (max-width: 768px) {
  .page-wrapper { padding: 20px 10px; align-items: flex-start; }
  
  .main-card { padding: 30px 20px; border-radius: 12px; }
  
  .card-header {
      margin-bottom: 30px;
      .title { font-size: 1.8rem; }
  }
  
  .grid-2-col {
    grid-template-columns: 1fr;
    gap: 0;
  }
  
  .ingredient-row {
    flex-wrap: wrap;
    background: #f9fafb;
    padding: 15px;
    border-radius: 12px;
    border: 1px solid $border;
    
    .ing-input input { background: $white; }

    .small, .medium { flex: 1; }
    .large { flex: 100%; order: 3; }
    .btn-delete { order: 2; margin-left: auto; border: 1px solid #eee; background: $white; }
  }

  .form-footer {
    flex-direction: column-reverse;
    gap: 15px;
    .btn-submit, .btn-cancel { width: 100%; text-align: center; }
  }
}
</style>