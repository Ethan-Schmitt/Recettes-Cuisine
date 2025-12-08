type Recipe = {
  recipe_id: number
  title: string
  description: string
  image_url: string
  cuisine_name: Cuisine['name']
  goal_name: string
  diet_name: string
  allergy_name: string
}

type RecipeInstruction = {
  instruction_id: number
  step_number: number
  description: string
}

type RecipeIngredient = {
  ingredient_id: number
  name: string
  unit: string
  quantity: number
}

type FullRecipe = Recipe & {
  instructions: RecipeInstruction[]
  ingredients: RecipeIngredient[]
}