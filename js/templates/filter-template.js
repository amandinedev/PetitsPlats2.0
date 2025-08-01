class FilterData {
  constructor(recipes) {
    this.recipes = recipes;
    this.ingredientList = recipes.flatMap((recipe) =>
      recipe.ingredients.map((ingredient) => ingredient.ingredient)
    );
    this.applianceList = recipes.map((recipe) => recipe.appliance);

    this.ustensilList = recipes.flatMap((recipe) => recipe.ustensils);
  }
  getIngredientList() {
    return this.ingredientList;
  }

  getApplianceList() {
    return this.applianceList;
  }

  getUstensilList() {
    return this.ustensilList;
  }
}

// Utility function to remove accents from specific letters
function formatAttribute(str) {
  if (typeof str !== "string" || !str) {
    return "";
  }

  return str
    .toLowerCase()
    .replace(/[àáâãäåèéêëìíîïòóôõöùúûüÿç]/g, function (char) {
      switch (char) {
        case "à":
        case "á":
        case "â":
        case "ã":
        case "ä":
        case "å":
          return "a";
        case "è":
        case "é":
        case "ê":
        case "ë":
          return "e";
        case "ì":
        case "í":
        case "î":
        case "ï":
          return "i";
        case "ò":
        case "ó":
        case "ô":
        case "õ":
        case "ö":
          return "o";
        case "ù":
        case "ú":
        case "û":
        case "ü":
          return "u";
        case "ç":
          return "c";
        default:
          return char;
      }
    })
    .replace(/\s+/g, "-");
}

// Define the base filterTemplate class.
class FilterTemplate {
  constructor() {
    this.filter = "";
    this.attributeFilter = formatAttribute(this.filter);
  }

  getFilterDOM() {
    const filter = document.createElement("div");
    filter.id = `filter-${this.attributeFilter}`;
    filter.classList.add(
      "custom-container-filter",
      "d-flex",
      "flex-column",
      "justify-content-start",
      "mx-auto",
      "ms-md-0",
      "me-md-5",
      "bg-white",
      "h-100"
    );
    filter.innerHTML = `
     <div id="filter-button-${this.attributeFilter}" class="container button d-flex flex-row justify-content-between w-100 py-4 px-4" role="button" aria-haspopup="listbox" aria-expanded="false" tabindex="0">
        <label class="fw-medium" for="${this.attributeFilter}">${this.filter}</label>
        <img src="./assets/icons/icon-arrow-closed.svg" id="filter-closed-${this.attributeFilter}" class="custom-arrow mt-auto mb-auto" alt=""> 
        <img src="./assets/icons/icon-arrow-opened.svg" id="filter-opened-${this.attributeFilter}" class="custom-arrow mt-auto mb-auto d-none" alt=""> 
      </div>
      <div id="filter-options-${this.attributeFilter}" class="d-flex d-none w-100">
      <searchbar class="custom-searchbar position-relative d-flex w-100 h-100 mt-2 mb-2">
        <input id="${this.attributeFilter}" class="custom-input-filter w-100 mt-2 mx-3" type="text"></input>
        <img src="./assets/icons/icon-loop-light.svg" class="custom-loop-light button position-absolute end-0 bottom-0 p-1 me-4" alt="rechercher" role="button" tabindex="0">
      </searchbar>
      </div>

    `;
    //if input lenght >1 show icon close
    return filter;
  }

  handleFilterButtonEvent(
    attributeFilter,
    filterButton,
    filterOptions,
    filterClosedImgElement,
    filterOpenedImgElement
  ) {
    const isExpanded = filterButton.getAttribute("aria-expanded") === "true";
    filterButton.setAttribute("aria-expanded", !isExpanded);

    if (isExpanded) {
      //open the menu
      filterClosedImgElement.setAttribute(
        "aria-label",
        "ouvrir le menu de filtrage"
      );
      filterOptions.classList.remove("d-block");
      filterOptions.classList.add("d-none");
      filterClosedImgElement.classList.remove("d-none");
      filterClosedImgElement.classList.add("d-inline");
      filterOpenedImgElement.classList.remove("d-inline");
      filterOpenedImgElement.classList.add("d-none");
    } else {
      //close the menu
      filterOpenedImgElement.setAttribute(
        "aria-label",
        "fermer le menu de filtrage"
      );
      // Toggle the display of the filter options
      filterOptions.classList.remove("d-none");
      filterOptions.classList.add("d-block");
      filterOpenedImgElement.classList.remove("d-none");
      filterOpenedImgElement.classList.add("d-inline");
      filterClosedImgElement.classList.add("d-none");
    }
  }
}

class FilterMenuIngredients extends FilterTemplate {
  constructor() {
    super();
    this.filter = "Ingrédients";
    this.attributeFilter = formatAttribute(this.filter);
  }
}

class FilterMenuAppliances extends FilterTemplate {
  constructor() {
    super();
    this.filter = "Appareils";
    this.attributeFilter = formatAttribute(this.filter);
  }
}

class FilterMenuUstensils extends FilterTemplate {
  constructor() {
    super();
    this.filter = "Ustensiles";
    this.attributeFilter = formatAttribute(this.filter);
  }
}

const filterData = new FilterData(recipes);

console.log(filterData.getIngredientList());
console.log(filterData.getApplianceList());
console.log(filterData.getUstensilList());
