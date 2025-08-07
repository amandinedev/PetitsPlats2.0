
  function getTotalRecipesInt() {
        return new Promise((resolve) => {
        let articles = document.querySelectorAll("article");
        let totalRecipes = articles.length;
        resolve(totalRecipes);
        console.log(totalRecipes);
      });
  }

  async function totalRecipesTemplate() {

  const totalRecipes = await getTotalRecipesInt(); // Wait for the DOM to load and fetch recipes count

  function getTotalRecipesDOM(totalRecipes) {
    const sectionFilters = document.querySelector(".section-filters");
    sectionFilters.classList.add("position-relative");
    if (sectionFilters) {
      let existingTotalRecipesDOM = document.querySelector(".total-recipes");
      if (existingTotalRecipesDOM) {
        sectionFilters.removeChild(existingTotalRecipesDOM);
      }
  
      const totalRecipesDOM = document.createElement("h2");
      totalRecipesDOM.textContent = `${totalRecipes} recettes`;
      totalRecipesDOM.classList.add(
        "custom-h2",
        "total-recipes",
        "position-absolute",
        "d-flex",
        "justify-content-end",
        "fs-5",
        "top-0",
        "end-0",
        "mt-4",
        "me-4"
      );

      sectionFilters.appendChild(totalRecipesDOM);
    }
  }

  //update DOM with total count
  getTotalRecipesDOM(totalRecipes);
}
