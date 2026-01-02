<script setup lang="ts">
// 1. Protection de la page
definePageMeta({
  middleware: ['auth']
})

const config = useRuntimeConfig()
const token = useCookie('recipe_token')

// 2. Récupérer les recettes de l'utilisateur
const { data: myRecipes, refresh: refreshRecipes } = await useAsyncData('my-recipes', async () => {
  const response = await $fetch<any>(`${config.public.apiUrl}/api/recipes`, {
    headers: {
      Authorization: `Bearer ${token.value}`
    }
  })
  return response?.data || [] 
})

// 3. Fonction de Suppression
const deleteRecipe = async (id: number) => {
  if (!confirm('Voulez-vous vraiment supprimer cette recette ?')) return

  try {
    await $fetch(`${config.public.apiUrl}/api/recipes/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    refreshRecipes()
  } catch (err) {
    console.error('Erreur suppression', err)
    alert('Impossible de supprimer la recette.')
  }
}
</script>

<template>
  <div class="dashboard-container">
    <div class="container">
      
      <header class="dashboard-header">
        <div class="header-text">
          <h1 class="dashboard-header__title">Mon Tableau de Bord</h1>
          <p class="dashboard-header__subtitle">Gérez vos recettes gourmandes</p>
        </div>
        
        <div class="header-actions">
           <NuxtLink to="/dashboard/create" class="btn btn--primary">
            <i class="fa-solid fa-plus icon-plus"></i> Nouvelle Recette
          </NuxtLink>
        </div>
      </header>

      <section class="dashboard-content">
        <h2 class="section-title">Mes Recettes</h2>

        <div v-if="myRecipes && myRecipes.length > 0" class="recipes-table-wrapper">
          <table class="recipes-table">
            <thead>
              <tr>
                <th class="col-image">Image</th>
                <th class="col-title">Titre</th>
                <th class="col-cuisine">Cuisine</th>
                <th class="col-actions text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="recipe in myRecipes" :key="recipe.recipe_id">
                <td class="col-image">
                  <NuxtImg 
                    :src="`/recipes/${recipe.image_url}`" 
                    class="table-img" 
                    width="50" 
                    height="50" 
                    fit="cover"
                  />
                </td>
                <td class="col-title font-bold">
                    <NuxtLink :to="`/recettes/${recipe.recipe_id}`" class="table-link">
                        {{ recipe.title }}
                    </NuxtLink>
                </td>
                <td class="col-cuisine">{{ recipe.cuisine_name }}</td>
                <td class="col-actions actions-cell">
                  <NuxtLink :to="`/dashboard/edit/${recipe.recipe_id}`" class="btn-icon edit" aria-label="Modifier">
                    <i class="fa-solid fa-pen"></i>
                  </NuxtLink>
                  <button @click="deleteRecipe(recipe.recipe_id)" class="btn-icon delete" aria-label="Supprimer">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="empty-state">
          <p>Vous n'avez pas encore créé de recettes.</p>
          <NuxtLink to="/dashboard/create" class="link">Lancez-vous !</NuxtLink>
        </div>

      </section>

    </div>
  </div>
</template>

<style scoped lang="scss">
$primary-color: #ff6600;
$text-color: #333;
$border-color: #eee;
$radius: 8px;

.dashboard-container {
  padding: 40px 0;
  min-height: 80vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* --- HEADER RESPONSIVE --- */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid $border-color;
  flex-wrap: wrap; // Permet le retour à la ligne
  gap: 20px;

  &__title {
    font-size: 2.5rem;
    color: $text-color;
    margin-bottom: 5px;
    line-height: 1.2;
  }
  
  &__subtitle {
    color: lighten($text-color, 30%);
    margin: 0;
  }
}

/* --- BOUTONS --- */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border-radius: $radius;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.2s;
  white-space: nowrap; // Empêche le texte de se casser
  
  .icon-plus {
      margin-right: 8px;
  }
  
  &--primary {
    background-color: $primary-color;
    color: white;
    box-shadow: 0 4px 6px rgba($primary-color, 0.2);
    
    &:hover {
      background-color: darken($primary-color, 10%);
      transform: translateY(-2px);
    }
  }
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 8px;
  margin-left: 5px;
  transition: transform 0.2s;

  &:hover { transform: scale(1.1); }

  &.edit { color: #3498db; }
  &.delete { color: #e74c3c; }
}

/* --- TABLEAU RESPONSIVE --- */
.recipes-table-wrapper {
  overflow-x: auto; // Permet le scroll horizontal sur mobile
  background: white;
  border-radius: $radius;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  border: 1px solid $border-color;
}

.recipes-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px; // Force une largeur min pour déclencher le scroll si nécessaire
  
  th, td {
    padding: 15px 20px;
    text-align: left;
    border-bottom: 1px solid $border-color;
    vertical-align: middle;
  }
  
  th {
    background-color: #fafafa;
    font-weight: 600;
    color: $text-color;
    font-size: 0.95rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .table-img {
    border-radius: 6px;
    object-fit: cover;
    display: block;
  }
  
  .table-link {
      color: $text-color;
      text-decoration: none;
      font-weight: 600;
      &:hover { color: $primary-color; }
  }

  .actions-cell {
    text-align: right;
    white-space: nowrap;
  }
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: #f9f9f9;
  border-radius: $radius;
  border: 2px dashed #ddd;
  
  .link {
    display: inline-block;
    margin-top: 10px;
    color: $primary-color;
    font-weight: bold;
    text-decoration: none;
    &:hover { text-decoration: underline; }
  }
}

/* --- MEDIA QUERIES (RESPONSIVE) --- */
@media (max-width: 768px) {
  .dashboard-container {
      padding: 20px 0;
  }

  .dashboard-header {
    flex-direction: column; // Empile le texte et le bouton
    align-items: stretch; // Prend toute la largeur
    text-align: center;
    gap: 20px;

    &__title {
        font-size: 2rem;
    }
    
    .header-actions {
        width: 100%;
        display: flex;
        justify-content: center;
    }
    
    .btn--primary {
        width: 100%; // Bouton pleine largeur sur mobile
        max-width: 300px; // Mais pas trop large sur tablette
    }
  }

  // Ajustement du tableau pour mobile
  .recipes-table {
      th, td {
          padding: 12px 10px;
      }
      
      // On peut masquer la colonne cuisine sur très petit écran si besoin
      // .col-cuisine { display: none; } 
  }
}
</style>