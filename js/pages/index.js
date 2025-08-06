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
  //create section filters
  const sectionFilters = document.createElement("section");
  main.appendChild(sectionFilters);
  sectionFilters.classList.add(
    "section-filters",
    "container-fluid",
    "d-flex",
    "flex-column",
    "flex-md-row",
    "justify-content-center",
    "justify-content-lg-start",
    "gap-3",
    "gap-lg-0",
    "h-100",
    "mx-auto"
  );

//create section selected filters
  const sectionSelectedFilters = document.createElement("section");
  main.appendChild(sectionSelectedFilters);
  sectionSelectedFilters.classList.add(
    "section-selected-filters",
    "container-fluid",
    "d-flex",
    "justify-content-start",
    "gap-3",
    "mt-5",
    "mx-auto"
  );

  const filterMenuIngredients = new FilterMenuIngredients();
  const filterMenuAppliances = new FilterMenuAppliances();
  const filterMenuUstensils = new FilterMenuUstensils();

const filterData = new FilterData(recipes);

  const filters = [
    {
      filter: filterMenuIngredients,
      attributeFilter: filterMenuIngredients.attributeFilter,
      filterType: filterMenuIngredients.filterType,

    },
    {
      filter: filterMenuAppliances,
      attributeFilter: filterMenuAppliances.attributeFilter,
      filterType: filterMenuAppliances.filterType,

    },
    {
      filter: filterMenuUstensils,
      attributeFilter: filterMenuUstensils.attributeFilter,
      filterType: filterMenuUstensils.filterType,
    },
  ];


  filters.forEach(({ filter, filterType, attributeFilter }) => {
    sectionFilters.appendChild(filter.getFilterDOM());
     // Add event listener to the filter list to select an option
    filter.handleFilterListEvent();
    // Add event listener to the filter list to remove an option
    filter.handleFilterSelectedListEvent();
    // filter.updateSelectedFilters(sectionSelectedFilters);

 // Check if an inputElement exists and add event listener accordingly to update list
    const inputElement = document.getElementById(
      `${attributeFilter}-input`
    );
    if (inputElement) {
    inputElement.addEventListener("input", () => {
        const value = formatAttribute(inputElement.value);
        console.log(value);
        filter.generateUpdatedListHTML(attributeFilter, value);
        //re-attach event listeners
        filter.handleFilterListEvent();
        filter.handleFilterSelectedListEvent();
        // filter.updateSelectedFilters(sectionSelectedFilters);
    });
    } else {
    console.log(`No input element found for attribute: ${attributeFilter}`);
    }
  });

  // Add event listener to the filter buttons
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
    "justify-content-center",
    "lg-justify-content-start",
    "gap-5",
    "mt-5",
    "mx-auto"
  );

  recipes.forEach((recipeData) => {
    const recipe = new RecipeTemplate(recipeData);
    sectionRecipes.appendChild(recipe.getRecipesDOM());
  });

  //total recipes DOM

  totalRecipesTemplate();
}


async function init() {
  try {
    await displayData();
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

init();
