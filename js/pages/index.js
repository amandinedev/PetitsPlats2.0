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

  const filterData = new FilterData(recipes);
    // console.log("FilterData:", filterData);
  if (!filterData) {
    throw new Error("FilterData could not be created");
  }

  const filterMenuIngredients = new FilterMenuIngredients(filterData.getIngredientList());
  const filterMenuAppliances = new FilterMenuAppliances(filterData.getApplianceList());
  const filterMenuUstensils = new FilterMenuUstensils(filterData.getUstensilList());
  
  const filters = [filterMenuIngredients, filterMenuAppliances, filterMenuUstensils];
  // console.log("filters",filters);

  filters.forEach(filter => {
    sectionFilters.appendChild(filter.getFilterDOM());
    // Add event listener to the filter list to select an option
    const attributeFilter = filter.attributeFilter;
    const filterDataInstance = filter.filterDataInstance;
    filter.handleFilterListEvent(filterData, attributeFilter);
    // Add event listener to the filter list to remove an option
    filter.handleFilterSelectedListEvent(filterData, attributeFilter);
    // Check if an inputElement exists and add event listener accordingly to update list
    const inputElement = document.getElementById(`${attributeFilter}-input`);
    if (inputElement) {
      inputElement.addEventListener("input", () => {
        const searchValue = formatAttribute(inputElement.value);
        console.log(searchValue);
        const updatedList = filterData.updateListUsingValue(filterDataInstance, searchValue);
        console.log(updatedList);
        filter.generateUpdatedListHTML(filterData, attributeFilter, updatedList);
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
