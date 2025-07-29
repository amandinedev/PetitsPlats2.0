async function displayData() {
  //header
  const headerDisplay = headerTemplate();

  //filters
  const main = document.getElementById("main");
  main.classList.add("px-5","py-3")
  const sectionFilters = document.createElement("section");
  main.appendChild(sectionFilters);
  sectionFilters.classList.add(
    "section-filters",
    "container",
    "d-flex",
    "flex-row", 
    "justify-content-start"
  );
  const filterMenuIngredients = new FilterMenuIngredients();
  const filterMenuAppliances = new FilterMenuAppliances();
  const filterMenuUstensils = new FilterMenuUstensils();
 
  const filters = [
    { filter: filterMenuIngredients, attributeFilter: filterMenuIngredients.attributeFilter },
    { filter: filterMenuAppliances, attributeFilter: filterMenuAppliances.attributeFilter },
    { filter: filterMenuUstensils, attributeFilter: filterMenuUstensils.attributeFilter },
    
  ];

  filters.forEach(({ filter }) => {
    sectionFilters.appendChild(filter.getFilterDOM());
  });

  // Event listeners
  const filterTemplateInstance = new FilterTemplate();

  filters.forEach(({ attributeFilter }) => {
    const filterButton = document.getElementById(`filter-button-${attributeFilter}`);
    const filterOptions = document.getElementById(`filter-options-${attributeFilter}`);
    const filterClosedImgElement = document.getElementById(`filter-closed-${attributeFilter}`);
    const filterOpenedImgElement = document.getElementById(`filter-opened-${attributeFilter}`);

    filterButton.addEventListener("click", () => filterTemplateInstance.handleFilterButtonEvent(attributeFilter, filterButton, filterOptions, filterClosedImgElement, filterOpenedImgElement));
    filterButton.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === "Space") {
        filterTemplateInstance.handleFilterButtonEvent(attributeFilter, filterButton, filterOptions, filterClosedImgElement, filterOpenedImgElement);
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
