async function displayData() {
  //header
  const headerDisplay = headerTemplate();

  //filters
  const main = document.getElementById("main");
  main.classList.add(
    "sm-container-fluid",
    "container",
    "justify-content-center",
    "d-flex",
    "flex-column",
    // "px-lg-5",
    // "px-sm-auto",
    "py-3",
    "h-100"
  );
  const sectionFilters = document.createElement("section");
  main.appendChild(sectionFilters);
  sectionFilters.classList.add(
    "section-filters",
    "container-fluid",
    "d-flex",
    "flex-xs-column",
    "flex-lg-row",
    "justify-content-start",
    "h-100",
    "mx-sm-5",
    "mx-lg-auto",
  );
  const filterMenuIngredients = new FilterMenuIngredients();
  const filterMenuAppliances = new FilterMenuAppliances();
  const filterMenuUstensils = new FilterMenuUstensils();

  const filters = [
    {
      filter: filterMenuIngredients,
      attributeFilter: filterMenuIngredients.attributeFilter,
    },
    {
      filter: filterMenuAppliances,
      attributeFilter: filterMenuAppliances.attributeFilter,
    },
    {
      filter: filterMenuUstensils,
      attributeFilter: filterMenuUstensils.attributeFilter,
    },
  ];

  filters.forEach(({ filter }) => {
    sectionFilters.appendChild(filter.getFilterDOM());
  });

  // Event listeners
  const filterTemplateInstance = new FilterTemplate();

  filters.forEach(({ attributeFilter }) => {
    const filterButton = document.getElementById(
      `filter-button-${attributeFilter}`
    );
    const filterOptions = document.getElementById(
      `filter-options-${attributeFilter}`
    );
    const filterClosedImgElement = document.getElementById(
      `filter-closed-${attributeFilter}`
    );
    const filterOpenedImgElement = document.getElementById(
      `filter-opened-${attributeFilter}`
    );

    filterButton.addEventListener("click", () =>
      filterTemplateInstance.handleFilterButtonEvent(
        attributeFilter,
        filterButton,
        filterOptions,
        filterClosedImgElement,
        filterOpenedImgElement
      )
    );
    filterButton.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === "Space") {
        filterTemplateInstance.handleFilterButtonEvent(
          attributeFilter,
          filterButton,
          filterOptions,
          filterClosedImgElement,
          filterOpenedImgElement
        );
      }
    });
  });

  //recipes
  const sectionRecipes = document.createElement("section");
  main.appendChild(sectionRecipes);
  sectionRecipes.classList.add(
    "section-recipes",
    "container-fluid",
    "d-flex",
    "flex-wrap",
    "lg-justify-content-start",
    "gap-5",
    "mt-5",
    "sm-justify-content-center",
    "mx-auto"
  );

  recipes.forEach((recipeData) => {
    const recipe = new RecipeTemplate(recipeData);
    sectionRecipes.appendChild(recipe.getRecipesDOM());
  });
}

async function init() {
  try {
    await displayData();
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

init();
