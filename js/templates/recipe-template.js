// Define the base filterTemplate class.
class RecipeTemplate {
  constructor(recipes) {
    this.recipes = recipes;
    this.image = recipes.image;
    this.time = recipes.time;
    // this.attributeDate = formatAttribute(this.date);
    this.name = recipes.name;
    this.attributeName = formatAttribute(this.name);
    this.description = recipes.description;
    this.ingredients = recipes.ingredients.map((ingredient) => ({
      name: ingredient.ingredient,
      quantity: ingredient.quantity,
      unit: ingredient.unit || "",
    }));
  }

  getRecipesDOM() {
    const recipe = document.createElement("article");
    recipe.id = `${this.attributeName}`;
    recipe.classList.add(
      "custom-container-recipe",
      "d-flex",
      "flex-column",
      "justify-content-start",
      "bg-white",
      "p-0",
      "col-lg-4",
      "col-sx-12"
    );
    recipe.setAttribute("tabindex", "0");

    const ingredientsHTML = this.ingredients
      .map(
        (ingredient) => `
      <li class="d-flex flex-column col-6 m-0 mb-3">
        <p class="ingredient-name m-0">${ingredient.name}</p>
        <p class="ingredient-quantity m-0">${ingredient.quantity}${ingredient.unit}</p>
      </li>
    `
      )
      .join("");

    recipe.innerHTML = `
     <div id="${this.attributeName}-image" class="custom-container-recipe-img container d-flex m-0 p-0 w-100 position-relative" >
        <img src="./assets/recipes/${this.image}" class="recipe-img d-flex m-0 p-0" alt="" aria-labelledby="${this.attributeName}-title"> 
        <time class="custom-time fs-6 me-3 position-absolute top-0 end-0 px-2 me-3 mt-3">${this.time}min</time>
      </div>
      <div id="${this.attributeName}-content" class="d-flex flex-column w-100 px-3 mt-4 ">
      <h2 id="${this.attributeName}-title" class="custom-h2 fs-6 d-flex my-3">${this.name}</h2>
      <h3 class="custom-h3 d-flex mt-3">RECETTES</h3>
      <p class="custom-description d-flex overflow-auto">${this.description}</p>
      <h3 class="custom-h3 d-flex my-3">INGREDIENTS</h3>
      <ul class="ingredients-list list-unstyled row">
        ${ingredientsHTML}
      </ul>
     </div>

    `;
    return recipe;
  }
}


function updateRecipesDOM(recipes, sectionRecipes, selectedItems) {
  console.log("Updating Recipes with:", selectedItems);
  // Clear existing recipes in the DOM
  while (sectionRecipes.firstChild) {
    sectionRecipes.removeChild(sectionRecipes.firstChild);
  }

  // Filter recipes based on the selected items
  const filteredRecipes = filterRecipesBySelectedItems(recipes, selectedItems);
  console.log(filteredRecipes);

  // Display filtered recipes in the DOM
  filteredRecipes.forEach((recipeData) => {
    const recipe = new RecipeTemplate(recipeData);
    sectionRecipes.appendChild(recipe.getRecipesDOM());
  });
}

function filterRecipesBySelectedItems(recipes, selectedItems) {
  const formattedSelectedItems = selectedItems.map(formatAttribute);

  return formattedSelectedItems.reduce((recipes, selectedItem) => {
    return recipes.filter((recipe) => {
      for (let key in recipe) {
        if (key === "ingredients") {
          for (let ingredient of recipe[key]) {
            let ingredientName = formatAttribute(ingredient.ingredient);
            // Check if the ingredient name is the same or contains the selected item
            if (
              ingredientName === selectedItem ||
              ingredientName.includes(selectedItem)
            ) {
              return true;
            }
          }
        } else if (Array.isArray(recipe[key])) {
          for (let item of recipe[key]) {
            let formattedItem = formatAttribute(item);
            // Check if the item is the same or contains the selected item
            if (
              typeof item === "string" &&
              (formattedItem === selectedItem ||
                formattedItem.includes(selectedItem))
            ) {
              return true;
            }
          }
        } else if (typeof recipe[key] === "string") {
          let formattedString = formatAttribute(recipe[key]);
          // Check if the string is the same or contains the selected item
          if (
            formattedString === selectedItem ||
            formattedString.includes(selectedItem)
          ) {
            return true;
          }
        }
      }
      return false;
    });
  }, recipes);
}
