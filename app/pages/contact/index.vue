<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const loading = ref(false)
const sent = ref(false)

const onSubmit = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    sent.value = true
    setTimeout(() => {
      sent.value = false
      form.value = { name: '', email: '', subject: '', message: '' }
    }, 5000)
  }, 1500)
}
</script>

<template>
  <div class="contact-page-wrapper">
    <div class="contact-container">
      
      <header class="contact-header">
        <h1 class="title">Contactez-nous</h1>
        <p class="subtitle">Une question ou une envie de partenariat ? Écrivez-nous.</p>
      </header>

      <div class="info-cards-row">
        
        <div class="info-box">
          <div class="icon-circle"><i class="fa-solid fa-envelope"></i></div>
          <h3>Email</h3>
          <p>support@foodieland.com</p>
        </div>

        <div class="info-box">
          <div class="icon-circle"><i class="fa-solid fa-location-dot"></i></div>
          <h3>Adresse</h3>
          <p>12 Rue de la Gastronomie, Paris</p>
        </div>

        <div class="info-box">
          <div class="icon-circle"><i class="fa-solid fa-phone"></i></div>
          <h3>Téléphone</h3>
          <p>01 23 45 67 89</p>
        </div>

      </div>

      <div class="contact-form-wrapper">
        <div class="form-card">
          
          <transition name="fade">
            <div v-if="sent" class="success-overlay">
              <div class="success-content">
                <div class="check-icon"><i class="fa-solid fa-check"></i></div>
                <h2>Message envoyé !</h2>
                <button @click="sent = false" class="btn-reset">Fermer</button>
              </div>
            </div>
          </transition>

          <div class="form-title-box">
             <h2>Envoyez-nous un message</h2>
          </div>

          <form @submit.prevent="onSubmit" v-if="!sent">
            <div class="grid-2-col">
              <div class="input-group">
                <label>Nom complet</label>
                <input v-model="form.name" type="text" class="input-modern" placeholder="Votre nom" required>
              </div>
              <div class="input-group">
                <label>Email</label>
                <input v-model="form.email" type="email" class="input-modern" placeholder="votre@email.com" required>
              </div>
            </div>

            <div class="input-group">
              <label>Sujet</label>
              <div class="select-wrapper">
                <select v-model="form.subject" class="input-modern" required>
                  <option value="" disabled selected>Sélectionnez un sujet...</option>
                  <option value="support">Support</option>
                  <option value="partnership">Partenariat</option>
                  <option value="feedback">Autre</option>
                </select>
                <i class="fa-solid fa-chevron-down select-icon"></i>
              </div>
            </div>

            <div class="input-group">
              <label>Message</label>
              <textarea v-model="form.message" rows="6" class="input-modern" placeholder="Votre message..." required></textarea>
            </div>

            <button type="submit" class="btn-submit" :disabled="loading">
              <span v-if="loading">Envoi...</span>
              <span v-else>Envoyer</span>
            </button>
          </form>

        </div>
      </div>

    </div>
  </div>
</template>

<style scoped lang="scss">
// --- VARIABLES ---
$primary: #ff6600;
$dark: #1a1a1a;
$gray: #666;
$bg-page: #f9f9fc;
$white: #ffffff;
$border: #e0e0e0;
$radius: 16px;
$shadow: 0 10px 30px rgba(0,0,0,0.05);

// --- 1. LAYOUT PRINCIPAL (Correction ici) ---
.contact-page-wrapper {
  min-height: 100vh;
  background-color: $bg-page;
  padding: 60px 20px;
  font-family: 'Inter', sans-serif;
  
  // On s'assure que le contenu ne s'étale pas en largeur
  display: block; 
}

.contact-container {
  max-width: 1000px;
  margin: 0 auto;
  
  // On force l'empilement vertical des sections
  display: flex;
  flex-direction: column; 
  gap: 60px; // Espace entre Header, Infos et Formulaire
}

// --- 2. HEADER ---
.contact-header {
  text-align: center;
  
  .title {
    font-size: 3rem;
    font-weight: 800;
    color: $dark;
    margin-bottom: 10px;
  }
  .subtitle {
    font-size: 1.1rem;
    color: $gray;
  }
}

// --- 3. BOITES INFOS (Ligne horizontale) ---
.info-cards-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr); // 3 colonnes strictes
  gap: 30px;
}

.info-box {
  background: $white;
  padding: 30px;
  border-radius: $radius;
  text-align: center;
  box-shadow: $shadow;
  transition: transform 0.3s;

  &:hover { transform: translateY(-5px); }

  .icon-circle {
    width: 60px; height: 60px;
    background: rgba($primary, 0.1);
    color: $primary;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.5rem;
    margin: 0 auto 15px auto;
  }
  
  h3 { font-size: 1.1rem; margin-bottom: 5px; color: $dark; }
  p { color: $gray; font-size: 0.95rem; }
}

// --- 4. FORMULAIRE (Centré) ---
.contact-form-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

.form-card {
  width: 100%;
  max-width: 700px; // Largeur max pour faire joli
  background: $white;
  padding: 40px;
  border-radius: $radius;
  box-shadow: $shadow;
  position: relative;
  overflow: hidden;
}

.form-title-box {
    margin-bottom: 30px;
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 15px;
    h2 { font-size: 1.5rem; color: $dark; }
}

// --- INPUTS ---
.grid-2-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.input-group {
  margin-bottom: 20px;
  label {
    display: block;
    font-weight: 600;
    margin-bottom: 8px;
    color: $dark;
    font-size: 0.9rem;
  }
}

.input-modern {
  width: 100%;
  padding: 14px;
  border: 1px solid $border;
  border-radius: 10px;
  background: #fdfdfd;
  font-size: 1rem;
  font-family: inherit;
  transition: 0.3s;

  &:focus {
    border-color: $primary;
    outline: none;
    background: $white;
  }
}

.select-wrapper {
  position: relative;
  .select-icon {
    position: absolute; right: 15px; top: 50%;
    transform: translateY(-50%); color: $gray; font-size: 0.8rem; pointer-events: none;
  }
  select { appearance: none; cursor: pointer; }
}

// --- BOUTON ---
.btn-submit {
  width: 100%;
  background-color: $primary;
  color: white;
  padding: 16px;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: 0.3s;
  
  &:hover { background-color: darken($primary, 5%); }
  &:disabled { background-color: #ccc; cursor: not-allowed; }
}

// --- SUCCÈS ---
.success-overlay {
  position: absolute; inset: 0; background: $white;
  display: flex; align-items: center; justify-content: center; z-index: 5;
}
.success-content {
    text-align: center;
    .check-icon { font-size: 3rem; color: #4ade80; margin-bottom: 15px; }
    h2 { margin-bottom: 20px; color: $dark; }
    .btn-reset { 
        background: transparent; border: 1px solid $border; padding: 8px 20px; border-radius: 20px; cursor: pointer;
        &:hover { border-color: $primary; color: $primary; }
    }
}

// --- RESPONSIVE MOBILE ---
@media (max-width: 768px) {
  .info-cards-row {
    grid-template-columns: 1fr; // Les boites passent les unes sous les autres
  }
  
  .grid-2-col {
    grid-template-columns: 1fr; // Les inputs passent les uns sous les autres
  }
  
  .contact-header .title { font-size: 2rem; }
  .form-card { padding: 25px; }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>





