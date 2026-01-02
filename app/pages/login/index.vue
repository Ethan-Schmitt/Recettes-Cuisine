<script setup lang="ts">
import { ref,computed} from 'vue'

const email = ref('')
const password = ref('')
const loginError = ref<string | null>(null)
const config = useRuntimeConfig()

const tokenCookie = useCookie('recipe_token')
const isLoggedIn = computed(() => !!tokenCookie.value)

async function onSubmit () {
  loginError.value = null

  if (!email.value || !password.value) {
    loginError.value = "Veuillez remplir tous les champs."
    return
  }

  try {
    console.log('=> Tentative de connexion API')

    const response = await fetch(`${config.public.apiUrl}/api/users/login`, { 
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    })
    
    const json = await response.json()

    if (response.ok && json.data?.token) {
      const token = json.data.token
      tokenCookie.value = token
      
      // 🛑 ACTION CLÉ : Redirection vers le dashboard après succès
      navigateTo('/dashboard')
      
    } else {
      loginError.value = json.message || "Email ou mot de passe incorrect."
    }

  } catch (err) {
    console.error(err)
    loginError.value = "Une erreur est survenue lors de la communication avec le serveur."
  }
}

function onLogout () {
  tokenCookie.value = null 
  loginError.value = null
  navigateTo('/login') 
}
</script>

<template>
  <div class="login-page-container">
    <div class="login-card">
      
      <div v-if="isLoggedIn" class="logged-in-message">
        <h2>🎉 Tu es connecté !</h2>
        <p>Tu peux te rendre sur l'espace recettes ou te déconnecter.</p>
        <NuxtLink to="/dashboard" class="submit-button" style="margin-right: 15px;">Aller au Dashboard</NuxtLink>
        <button @click="onLogout" class="logout-button">Se déconnecter</button>
      </div>

      <div v-else>
        <h1 class="card-title">Connexion à Foodieland.</h1>

        <form @submit.prevent="onSubmit" class="login-form">
          
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input 
              id="email" 
              v-model="email" 
              type="email" 
              class="form-input" 
              required
            />
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Mot de passe</label>
            <input 
              id="password" 
              v-model="password" 
              type="password" 
              class="form-input" 
              required
            />
          </div>
          
          <p v-if="loginError" class="error-message">{{ loginError }}</p>

          <button type="submit" class="submit-button">Se connecter</button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

$error-color: #d9534f;
$success-color: #5cb85c;

.login-page-container {
  min-height: calc(100vh - 120px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  background-color: $color-secondary;
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 40px;
  background-color: white;
  border-radius: $radius;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.card-title {
  font-family: $font-header;
  font-size: 2rem;
  color: $text-color;
  margin-bottom: 30px;

  &::first-letter {
    color: $primary-color;
  } 
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  text-align: left;
}

.form-label {
  display: block;
  font-family: $font-body;
  font-weight: 600;
  color: $text-color;
  margin-bottom: 8px;
  font-size: 0.95rem;
}

.form-input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ccc;
  border-radius: $radius;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    border-color: $primary-color;
    outline: none;
    box-shadow: 0 0 0 3px rgba($primary-color, 0.2);
  }
}

.submit-button {
  background-color: $primary-color;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: $radius;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 10px;
  text-decoration: none; // Ajouté pour le NuxtLink du dashboard

  &:hover {
    background-color: darken($primary-color, 10%);
  }
}

.error-message {
  color: $error-color;
  background-color: lighten($error-color, 35%);
  border: 1px solid $error-color;
  padding: 10px;
  border-radius: $radius;
  margin-bottom: 15px;
  font-size: 0.9rem;
}

.logged-in-message {
  h2 {
    color: $success-color;
    margin-bottom: 10px;
    font-family: $font-header;
  }
  p {
    margin-bottom: 20px;
    color: $text-color;
  }
}

.logout-button {
  @extend .submit-button;
  background-color: #ccc;
  color: $text-color;
  
  &:hover {
    background-color: darken(#ccc, 10%);
  }
}
</style>