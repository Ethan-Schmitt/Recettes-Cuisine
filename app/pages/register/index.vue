<script setup lang="ts">
import { ref } from 'vue'

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const errorMsg = ref<string | null>(null)
const successMsg = ref<string | null>(null)
const isLoading = ref(false)

const config = useRuntimeConfig()
const router = useRouter()

async function onSubmit() {
  errorMsg.value = null
  successMsg.value = null
  
  // 1. Validation locale basique
  if (!username.value || !email.value || !password.value || !confirmPassword.value) {
    errorMsg.value = "Veuillez remplir tous les champs."
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMsg.value = "Les mots de passe ne correspondent pas."
    return
  }

  if (password.value.length < 6) {
    errorMsg.value = "Le mot de passe doit contenir au moins 6 caractères."
    return
  }

  isLoading.value = true

  try {
    // 2. Appel à l'API d'inscription
    // J'assume que la route est /api/users/register (standard)
    const response = await fetch(`${config.public.apiUrl}/api/users/register`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username.value,
        email: email.value,
        password: password.value
      })
    })

    const json = await response.json()

    if (response.ok) {
      successMsg.value = "Compte créé avec succès ! Redirection..."
      
      // Petit délai pour lire le message avant de renvoyer au login
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } else {
      errorMsg.value = json.message || "Erreur lors de l'inscription."
    }

  } catch (err) {
    console.error(err)
    errorMsg.value = "Impossible de joindre le serveur."
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="auth-page-container">
    <div class="auth-card">
      
      <header class="card-header">
        <h1 class="title">Rejoignez Foodieland</h1>
        <p class="subtitle">Créez votre compte pour partager vos recettes.</p>
      </header>

      <form @submit.prevent="onSubmit" class="auth-form">
        
        <transition name="fade">
          <div v-if="errorMsg" class="alert alert--error">
            <i class="fa-solid fa-circle-exclamation"></i> {{ errorMsg }}
          </div>
        </transition>
        <transition name="fade">
          <div v-if="successMsg" class="alert alert--success">
            <i class="fa-solid fa-check-circle"></i> {{ successMsg }}
          </div>
        </transition>

        <div class="form-group">
          <label for="username">Nom d'utilisateur</label>
          <input 
            id="username" 
            v-model="username" 
            type="text" 
            class="input-modern" 
            placeholder="Ex: ChefGustou"
            required
          />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input 
            id="email" 
            v-model="email" 
            type="email" 
            class="input-modern" 
            placeholder="Ex: exemple@mail.com"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input 
            id="password" 
            v-model="password" 
            type="password" 
            class="input-modern" 
            placeholder="6 caractères min."
            required
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirmer le mot de passe</label>
          <input 
            id="confirmPassword" 
            v-model="confirmPassword" 
            type="password" 
            class="input-modern" 
            placeholder="Répétez le mot de passe"
            required
          />
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-submit" :disabled="isLoading">
            <span v-if="isLoading">Création...</span>
            <span v-else>S'inscrire</span>
          </button>
        </div>

        <div class="form-footer-link">
          <p>Déjà un compte ? <NuxtLink to="/login" class="link">Se connecter</NuxtLink></p>
        </div>

      </form>
    </div>
  </div>
</template>

<style scoped lang="scss">
// --- VARIABLES (Réutilisation du thème) ---
$primary: #ff6600;
$primary-hover: #e65c00;
$text-color: #333;
$text-light: #666;
$bg-page: #f2f4f8; // Même gris clair que ta page login/create
$white: #ffffff;
$radius: 16px;
$shadow: 0 20px 60px -10px rgba(0,0,0,0.08);
$error-bg: #fee2e2;
$error-text: #b91c1c;
$success-bg: #dcfce7;
$success-text: #166534;

// --- LAYOUT ---
.auth-page-container {
  min-height: calc(100vh - 80px); // Ajustement pour header/footer global
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  background-color: $bg-page;
}

.auth-card {
  width: 100%;
  max-width: 450px;
  background-color: $white;
  padding: 40px;
  border-radius: $radius;
  box-shadow: $shadow;
}

.card-header {
  text-align: center;
  margin-bottom: 30px;

  .title {
    font-size: 2rem;
    font-weight: 800;
    color: $text-color;
    margin-bottom: 10px;
    
    // Style Foodieland : première lettre ou mot en couleur (optionnel)
    &::first-letter { color: $primary; }
  }

  .subtitle {
    color: $text-light;
    font-size: 1rem;
  }
}

// --- FORMULAIRE ---
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-weight: 600;
    color: $text-color;
    font-size: 0.95rem;
  }
}

.input-modern {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  font-size: 1rem;
  background: #fdfdfd;
  transition: all 0.3s ease;

  &:focus {
    background: $white;
    border-color: $primary;
    box-shadow: 0 0 0 4px rgba($primary, 0.15);
    outline: none;
  }

  &::placeholder { color: #ccc; }
}

// --- BOUTONS & ALERTS ---
.btn-submit {
  width: 100%;
  background-color: $primary;
  color: $white;
  padding: 14px;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
  margin-top: 10px;

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

.alert {
  padding: 12px 15px;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;

  &--error {
    background-color: $error-bg;
    color: $error-text;
  }

  &--success {
    background-color: $success-bg;
    color: $success-text;
  }
}

.form-footer-link {
  text-align: center;
  margin-top: 10px;
  font-size: 0.95rem;
  color: $text-light;

  .link {
    color: $primary;
    text-decoration: none;
    font-weight: 700;
    &:hover { text-decoration: underline; }
  }
}

// --- ANIMATION ---
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>