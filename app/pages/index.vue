<script setup lang="ts">
const config = useRuntimeConfig()

const { data: recipesData } = await useFetch<any>(`${config.public.apiUrl}/api/recipes`)
const { data: cuisinesData } = await useFetch<any>(`${config.public.apiUrl}/api/cuisines`)

const recipes = computed(() => recipesData.value?.data || [])
const cuisines = computed(() => cuisinesData.value?.data || [])

const featuredRecipes = computed(() => recipes.value.slice(0, 3))
const latestRecipes = computed(() => recipes.value.slice(3, 9))

const getImageUrl = (filename: string) => {
    return (filename && filename !== 'default-recipe.jpg') 
        ? `/recipes/${filename}` 
        : '/recipes/default-recipe.jpg'
}
</script>

<template>
    <div class="home-page">
        <header class="hero-section">
            <div class="container hero-grid">
                <div class="hero-text">
                    <span class="badge-hero"><i class="fa-solid fa-scroll"></i> 100+ Recettes Uniques</span>
                    <h1 class="hero-title">Cuisinez le bonheur au quotidien</h1>
                    <p class="hero-desc">
                        Découvrez des recettes simples, gourmandes et saines pour régaler toute la famille. 
                        Rejoignez la communauté Foodieland !
                    </p>
                    <div class="hero-actions">
                        <NuxtLink to="/dashboard/create" class="btn btn-primary">Créer une recette</NuxtLink>
                        <NuxtLink to="#latest" class="btn btn-outline">Explorer <i class="fa-solid fa-arrow-down"></i></NuxtLink>
                    </div>
                </div>

                <div class="hero-image-wrapper">
                    <img 
                        src="https://img-3.journaldesfemmes.fr/r19xN3J12nIEOlRLgSpnwv0YRq8=/1500x/smart/07e886f7245740e588e429ef10d260aa/ccmcms-jdf/28567079.jpg" 
                        alt="Plat gourmand" 
                        class="hero-img"
                    />
                    <div class="floating-card">
                        <div class="icon">🔥</div>
                        <div class="text">
                            <strong>Recette du jour</strong>
                            <span>Pâtes au Pesto</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <section class="categories-section" v-if="cuisines.length > 0">
            <div class="container">
                <h2 class="section-title">Parcourez par Cuisines</h2>
                <div class="categories-list">
                    <NuxtLink 
                        v-for="cuisine in cuisines" 
                        :key="cuisine.cuisine_id" 
                        :to="`/dashboard`" 
                        class="category-card"
                    >
                        <div class="cat-icon"><i class="fa-solid fa-utensils"></i></div>
                        <span class="cat-name">{{ cuisine.name }}</span>
                    </NuxtLink>
                </div>
            </div>
        </section>

        <section class="featured-section" v-if="featuredRecipes.length > 0">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">Coups de Cœur ❤️</h2>
                    <p class="section-subtitle">Les recettes les plus appréciées de la communauté.</p>
                </div>

                <div class="featured-grid">
                    <article v-for="recipe in featuredRecipes" :key="recipe.recipe_id" class="recipe-card featured">
                        <div class="card-image">
                            <NuxtImg :src="getImageUrl(recipe.image_url)" loading="lazy" />
                            <div class="card-overlay">
                                <span class="badge-time"><i class="fa-regular fa-clock"></i> 30 min</span>
                            </div>
                        </div>
                        <div class="card-content">
                            <h3 class="card-title">
                                <NuxtLink :to="`/recettes/${recipe.recipe_id}`">{{ recipe.title }}</NuxtLink>
                            </h3>
                            <p class="card-cuisine" v-if="recipe.cuisine_name">
                                 <i class="fa-solid fa-earth-americas"></i> {{ recipe.cuisine_name }}
                            </p>
                        </div>
                    </article>
                </div>
            </div>
        </section>

        <section id="latest" class="latest-section">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">Dernières Nouveautés 🥗</h2>
                    <p class="section-subtitle">Inspirez-vous avec nos ajouts récents.</p>
                </div>

                <div v-if="latestRecipes.length > 0" class="recipes-grid">
                    <article v-for="recipe in latestRecipes" :key="recipe.recipe_id" class="recipe-card">
                        <div class="card-image-wrapper">
                            <div class="img-container" :style="{ backgroundImage: `url('${getImageUrl(recipe.image_url)}')` }"></div>
                            <button class="btn-like"><i class="fa-regular fa-heart"></i></button>
                        </div>

                        <div class="card-body">
                            <h3 class="card-title">
                                <NuxtLink :to="`/recettes/${recipe.recipe_id}`">{{ recipe.title }}</NuxtLink>
                            </h3>
                            <div class="card-meta">
                                <span v-if="recipe.cuisine_name" class="meta-item cuisine">{{ recipe.cuisine_name }}</span>
                                <span v-if="recipe.goal_name" class="meta-item goal">{{ recipe.goal_name }}</span>
                            </div>
                        </div>
                    </article>
                </div>

                <div v-else class="empty-feed">
                    <i class="fa-solid fa-carrot"></i>
                    <h3>Aucune autre recette pour le moment...</h3>
                    <NuxtLink to="/dashboard/create" class="link">Soyez le premier à en ajouter !</NuxtLink>
                </div>
            </div>
        </section>

        <section class="newsletter-banner">
            <div class="container">
                <div class="newsletter-content">
                    <h2>Ne manquez aucune miette !</h2>
                    <p>Inscrivez-vous pour recevoir nos meilleures recettes chaque semaine.</p>
                    <div class="input-row">
                        <input type="email" placeholder="Votre adresse email..." />
                        <button>S'inscrire</button>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped lang="scss">
$primary: #ff6600;
$dark: #1a1a1a;
$text: #555;
$bg-light: #f9f9fc;
$white: #ffffff;
$radius: 20px;
$shadow: 0 10px 30px rgba(0,0,0,0.08);

.home-page {
    font-family: 'Inter', sans-serif;
    background-color: $white;
    overflow-x: hidden;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.section-header {
    text-align: center;
    margin-bottom: 50px;
    .section-title { font-size: 2.2rem; color: $dark; font-weight: 800; margin-bottom: 10px; }
    .section-subtitle { color: $text; font-size: 1.1rem; }
}

.hero-section {
    padding: 80px 0;
    background-color: #fff8f5;
    border-bottom-right-radius: 80px;
    
    .hero-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        align-items: center;
        gap: 50px;
    }

    .badge-hero {
        display: inline-block;
        background: white;
        color: $primary;
        padding: 8px 16px;
        border-radius: 30px;
        font-weight: 700;
        box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        margin-bottom: 20px;
        font-size: 0.9rem;
    }

    .hero-title {
        font-size: 3.5rem;
        font-weight: 900;
        line-height: 1.1;
        color: $dark;
        margin-bottom: 20px;
    }

    .hero-desc {
        font-size: 1.15rem;
        color: $text;
        line-height: 1.6;
        margin-bottom: 40px;
        max-width: 500px;
    }

    .hero-actions {
        display: flex;
        gap: 15px;
    }

    .btn {
        padding: 14px 28px;
        border-radius: 12px;
        font-weight: 700;
        text-decoration: none;
        transition: 0.3s;
        
        &-primary {
            background: $dark;
            color: white;
            &:hover { background: $primary; transform: translateY(-3px); }
        }
        &-outline {
            border: 2px solid $dark;
            color: $dark;
            &:hover { background: $dark; color: white; }
        }
    }

    .hero-image-wrapper {
        position: relative;
        
        .hero-img {
            width: 100%;
            border-radius: $radius;
            box-shadow: $shadow;
            transform: rotate(2deg);
        }

        .floating-card {
            position: absolute;
            bottom: 40px;
            left: -20px;
            background: white;
            padding: 15px 25px;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.15);
            display: flex; align-items: center; gap: 15px;
            animation: float 3s ease-in-out infinite;

            .icon { font-size: 1.5rem; }
            .text {
                display: flex; flex-direction: column;
                strong { color: $dark; }
                span { color: $primary; font-size: 0.9rem; }
            }
        }
    }
}

@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }

.categories-section {
    padding: 60px 0;
    
    .section-title {
        font-size: 1.5rem; font-weight: 800; margin-bottom: 30px;
    }

    .categories-list {
        display: flex;
        gap: 20px;
        overflow-x: auto;
        padding-bottom: 20px;

        &::-webkit-scrollbar { height: 6px; }
        &::-webkit-scrollbar-thumb { background: #ccc; border-radius: 10px; }
    }

    .category-card {
        min-width: 140px;
        height: 140px;
        background: linear-gradient(135deg, #fdfdfd 0%, #f4f4f4 100%);
        border-radius: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        transition: 0.3s;
        border: 1px solid transparent;

        .cat-icon { font-size: 2.5rem; margin-bottom: 15px; color: $dark; }
        .cat-name { color: $text; font-weight: 600; font-size: 0.9rem; }

        &:hover {
            background: white;
            transform: translateY(-5px);
            box-shadow: $shadow;
            border-color: $primary;
            .cat-icon { color: $primary; }
        }
    }
}

.featured-section {
    padding: 60px 0;
    background-color: #fcfcfc;
}

.featured-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
}

.recipe-card.featured {
    background: white;
    border-radius: $radius;
    overflow: hidden;
    box-shadow: $shadow;
    transition: 0.3s;

    &:hover { transform: translateY(-5px); }

    .card-image {
        height: 250px;
        position: relative;
        img { width: 100%; height: 100%; object-fit: cover; }
        
        .card-overlay {
            position: absolute; bottom: 10px; left: 10px;
            .badge-time {
                background: rgba(255,255,255,0.9);
                padding: 5px 12px; border-radius: 20px; font-weight: 700; font-size: 0.8rem;
                color: $dark;
            }
        }
    }

    .card-content {
        padding: 20px;
        .card-title a {
            font-size: 1.25rem; font-weight: 700; color: $dark; text-decoration: none;
            &:hover { color: $primary; }
        }
        .card-cuisine { color: $text; margin-top: 10px; font-size: 0.9rem; i { color: $primary; margin-right: 5px; } }
    }
}

.latest-section {
    padding: 80px 0;
}

.recipes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 40px;
}

.recipe-card {
    .card-image-wrapper {
        height: 220px;
        position: relative;
        border-radius: $radius;
        overflow: hidden;
        margin-bottom: 15px;

        .img-container { width: 100%; height: 100%; background-size: cover; background-position: center; transition: 0.5s; }
        
        .btn-like {
            position: absolute; top: 15px; right: 15px;
            background: white; border: none; width: 40px; height: 40px; border-radius: 50%;
            cursor: pointer; display: flex; align-items: center; justify-content: center;
            transition: 0.2s;
            &:hover { background: #fee; color: red; }
        }

        &:hover .img-container { transform: scale(1.05); }
    }

    .card-title a {
        font-size: 1.2rem; font-weight: 700; color: $dark; text-decoration: none;
        display: block; margin-bottom: 10px;
        &:hover { color: $primary; }
    }

    .card-meta {
        display: flex; gap: 10px;
        .meta-item {
            font-size: 0.8rem; padding: 4px 10px; border-radius: 6px; font-weight: 600;
            &.cuisine { background: #f0f0f0; color: $text; }
            &.goal { background: rgba(255, 102, 0, 0.1); color: $primary; }
        }
    }
}

.newsletter-banner {
    background-color: #ffdcb8;
    padding: 80px 20px;
    text-align: center;
    border-radius: 40px;
    margin: 0 20px 60px 20px;

    h2 { font-size: 2.5rem; margin-bottom: 10px; color: $dark; }
    p { font-size: 1.1rem; margin-bottom: 30px; color: #664422; }

    .input-row {
        background: white;
        padding: 10px;
        border-radius: 15px;
        max-width: 500px;
        margin: 0 auto;
        display: flex;
        
        input { border: none; padding: 10px 20px; flex: 1; outline: none; font-size: 1rem; }
        button { background: $dark; color: white; border: none; padding: 12px 30px; border-radius: 10px; font-weight: 700; cursor: pointer; transition: 0.2s; &:hover { background: $primary; } }
    }
}

.empty-feed {
    text-align: center; padding: 50px;
    i { font-size: 3rem; color: #ddd; margin-bottom: 15px; }
    h3 { color: $text; margin-bottom: 10px; }
    .link { color: $primary; font-weight: 700; text-decoration: none; }
}

@media (max-width: 900px) {
    .hero-section .hero-grid { grid-template-columns: 1fr; text-align: center; }
    .hero-actions { justify-content: center; }
    .floating-card { display: none; }
    
    .featured-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 600px) {
    .hero-title { font-size: 2.5rem; }
    .featured-grid { grid-template-columns: 1fr; }
    .newsletter-banner { border-radius: 0; margin: 0; }
    .input-row { flex-direction: column; input { margin-bottom: 10px; } button { width: 100%; } }
}
</style>
