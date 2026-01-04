<script setup lang="ts">
import { ref, computed } from 'vue'

const email = ref('')
const password = ref('')
const loginError = ref<string | null>(null)
const isLoading = ref(false)
const config = useRuntimeConfig()

const tokenCookie = useCookie('recipe_token')
const isLoggedIn = computed(() => !!tokenCookie.value)

async function onSubmit () {
  loginError.value = null
  isLoading.value = true

  if (!email.value || !password.value) {
    loginError.value = "Veuillez remplir tous les champs."
    isLoading.value = false
    return
  }

  try {
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
      navigateTo('/dashboard')
    } else {
      loginError.value = json.message || "Email ou mot de passe incorrect."
    }

  } catch (err) {
    console.error(err)
    loginError.value = "Une erreur est survenue lors de la communication avec le serveur."
  } finally {
    isLoading.value = false
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
        <div class="logged-actions">
           <NuxtLink to="/dashboard" class="btn-primary">Aller au Dashboard</NuxtLink>
           <button class="btn-secondary" @click="onLogout">Se déconnecter</button>
        </div>
      </div>

      <div v-else>
        <header class="card-header">
            <h1 class="card-title">Connexion</h1>
            <p class="subtitle">Heureux de vous revoir !</p>
        </header>

        <form class="login-form" @submit.prevent="onSubmit">
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input 
              id="email" 
              v-model="email" 
              type="email" 
              class="form-input" 
              placeholder="exemple@mail.com"
              required
            >
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Mot de passe</label>
            <input 
              id="password" 
              v-model="password" 
              type="password" 
              class="form-input" 
              placeholder="••••••"
              required
            >
          </div>
          
          <transition name="fade">
            <p v-if="loginError" class="error-message">
                <i class="fa-solid fa-circle-exclamation"></i> {{ loginError }}
            </p>
          </transition>

          <button type="submit" class="submit-button" :disabled="isLoading">
            <span v-if="isLoading">Connexion...</span>
            <span v-else>Se connecter</span>
          </button>
        </form>

        <div class="form-footer-link">
            <p>Pas encore de compte ? <NuxtLink to="/register" class="link">Créer un compte</NuxtLink></p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$primary-color: #ff6600;
$primary-hover: #e65c00;
$text-color: #333;
$text-light: #666;
$bg-page: #f2f4f8;
$white: #fff;
$radius: 16px;
$shadow: 0 20px 60px -10px rgba(0,0,0,0.08);
$error-color: #d9534f;
$error-bg: #fee2e2;

.login-page-container {
  min-height: calc(100vh - 80px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  background-color: $bg-page;
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 40px;
  background-color: $white;
  border-radius: $radius;
  box-shadow: $shadow;
  text-align: center;
}

.card-header {
    margin-bottom: 30px;
}

.card-title {
  font-size: 2rem;
  font-weight: 800;
  color: $text-color;
  margin-bottom: 5px;

  &::first-letter { color: $primary-color; } 
}

.subtitle {
    color: $text-light;
    font-size: 1rem;
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
  font-weight: 600;
  color: $text-color;
  margin-bottom: 8px;
  font-size: 0.95rem;
}

.form-input {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  font-size: 1rem;
  background: #fdfdfd;
  transition: all 0.3s ease;

  &:focus {
    background: $white;
    border-color: $primary-color;
    box-shadow: 0 0 0 4px rgba($primary-color, 0.15);
    outline: none;
  }
}

.submit-button {
  background-color: $primary-color;
  color: white;
  padding: 14px;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 10px;
  width: 100%;

  &:hover {
    background-color: $primary-hover;
    transform: translateY(-2px);
  }
  
  &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
      transform: none;
  }
}

.error-message {
  color: #b91c1c;
  background-color: $error-bg;
  padding: 12px;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.logged-in-message {
  h2 { color: #166534; margin-bottom: 10px; }
  p { margin-bottom: 25px; color: $text-color; }
  
  .logged-actions {
      display: flex;
      flex-direction: column;
      gap: 15px;
  }
  
  .btn-primary {
      display: inline-block;
      text-decoration: none;
      background: $primary-color;
      color: white;
      padding: 12px;
      border-radius: 12px;
      font-weight: bold;
      transition: background 0.2s;
      &:hover { background: $primary-hover; }
  }
  
  .btn-secondary {
      background: #eee;
      color: $text-color;
      border: none;
      padding: 12px;
      border-radius: 12px;
      font-weight: bold;
      cursor: pointer;
      &:hover { background: #ddd; }
  }
}

.form-footer-link {
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
  
  p {
      color: $text-light;
      font-size: 0.95rem;
  }

  .link {
    color: $primary-color;
    text-decoration: none;
    font-weight: 700;
    transition: text-decoration 0.2s;
    
    &:hover {
      text-decoration: underline;
    }
  }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
