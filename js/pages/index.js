async function displayData() {
  const filterData = new FilterData(recipes);
  if (!filterData) {
    throw new Error("FilterData could not be created");
  }

  const filterMenuIngredients = new FilterMenuIngredients(
    filterData.getIngredientList()
  );
  const filterMenuAppliances = new FilterMenuAppliances(
    filterData.getApplianceList()
  );
  const filterMenuUstensils = new FilterMenuUstensils(
    filterData.getUstensilList()
  );

  const filters = [
    filterMenuIngredients,
    filterMenuAppliances,
    filterMenuUstensils,
  ];

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

  filters.forEach((filter) => {
    sectionFilters.appendChild(filter.getFilterDOM());
    // Add event listener to the filter list to select an option
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

  function displayRecipeSection(recipes) {
    recipes.forEach((recipeData) => {
      const recipe = new RecipeTemplate(recipeData);
      sectionRecipes.appendChild(recipe.getRecipesDOM());
    });

    //total recipes DOM
    totalRecipesTemplate();
  }

  displayRecipeSection(recipes);

  //add event listeners

  // for clear buttons
  const inputElement = document.querySelector(".custom-input-header");
  const clearButton = document.querySelector(".custom-clear-input-header");
  if (inputElement) {
    setupClearInputButton(inputElement, clearButton);

    function handleClearAction(recipes, filterData) {
      clearInputField(inputElement, clearButton);
      filters.forEach((filter) => {
        filter.updateFiltersAndRecipes(filterData);
      });
    }

    clearButton.addEventListener("click", () =>
      handleClearAction(recipes, filterData)
    );
    clearButton.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleClearAction(recipes, filterData);
      }
    });

    // for the header input
    inputElement.addEventListener("input", () => {
      // secure input value
      const securedSearchValue = inputElement.value.replace(
        /[^a-zA-Z0-9]/g,
        ""
      );
      // format search value
      const formattedSearchValue = formatAttribute(securedSearchValue);
      const filteredRecipesByHeader =
        filterRecipesByHeader(formattedSearchValue);
      filters.forEach((filter) => {
        filter.updateFiltersAndRecipes(filterData, filteredRecipesByHeader);
      });
    });
  }

  //for filters
  filters.forEach((filter) => {
    const attributeFilter = filter.attributeFilter;
    const filterDataInstance = filter.filterDataInstance;

    // Handle filter list events
    filter.handleFilterListEvent(filterData, attributeFilter);
    filter.handleFilterSelectedListEvent(filterData, attributeFilter);

    // Setup clear input button
    const inputElement = document.getElementById(
      `${attributeFilter}-input`
    );
    const clearButton = document.querySelector(
      `.custom-clear-input-filter-${attributeFilter}`
    );
    if (inputElement) {
      setupClearInputButton(inputElement, clearButton);
      //add event listener for clearButton
      clearButton.addEventListener("click", () => {
        clearInputField(inputElement, clearButton);
      });
      clearButton.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          clearInputField(inputElement, clearButton);
        }
      });
      //add event listener for inputElement
      inputElement.addEventListener("input", () => {
        // secure input value
        const securedSearchValue = inputElement.value.replace(
          /[^a-zA-Z0-9]/g,
          ""
        );
        // format search value
        const formattedSearchValue = formatAttribute(securedSearchValue);
        const updatedList = filterData.updateListUsingValue(
          filterDataInstance,
          formattedSearchValue
        );
        filter.generateUpdatedListHTML(
          filterData,
          attributeFilter,
          updatedList
        );
        //re-attach event listeners
        filter.handleFilterListEvent(filterData, attributeFilter);
        filter.handleFilterSelectedListEvent(filterData);
      });
    } else {
      console.log(`No input element found for attribute: ${attributeFilter}`);
    }

    // Add event listener to the filter buttons
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
      filter.handleFilterButtonEvent(
        attributeFilter,
        filterButton,
        filterOptions,
        filterClosedImgElement,
        filterOpenedImgElement
      )
    );
    filterButton.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === "Space") {
        filter.handleFilterButtonEvent(
          attributeFilter,
          filterButton,
          filterOptions,
          filterClosedImgElement,
          filterOpenedImgElement
        );
      }
      if (event.key === "Escape") {
        filter.handleFilterButtonEvent(
          attributeFilter,
          filterButton,
          filterOptions,
          filterClosedImgElement,
          filterOpenedImgElement
        );
      }
    });
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
