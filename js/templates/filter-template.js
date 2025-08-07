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

// Utility function to remove accents from specific letters and switch to lower case
function formatAttribute(str) {
  let formattedStr = formatAccents(str).toLowerCase();
  return formattedStr;
}

function formatAccents(str) {
  if (typeof str !== "string" || !str) {
    return "";
  }

  // Remove accents
  let formattedStr = str.replace(
    /[àáâãäåèéêëìíîïòóôõöùúûüÿç]/g,
    function (char) {
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
    }
  );
  // Replace spaces with dashes
  formattedStr = formattedStr.replace(/\s+/g, "-");
  return formattedStr;
}

// Define the base filterTemplate class.
class FilterTemplate {
  constructor(filter) {
    this.filter = "";
    this.attributeFilter = formatAttribute(this.filter);
    this.filterType = "";
    this.selectedItems = [];
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
     <div id="filter-button-${
       this.attributeFilter
     }" class="container button d-flex flex-row justify-content-between w-100 py-4 px-4" role="button" aria-haspopup="listbox" aria-expanded="false" tabindex="0">
        <label class="fw-medium" for="${this.attributeFilter}">${
      this.filter
    }</label>
        <img src="./assets/icons/icon-arrow-closed.svg" id="filter-closed-${
          this.attributeFilter
        }" class="custom-arrow mt-auto mb-auto" alt=""> 
        <img src="./assets/icons/icon-arrow-opened.svg" id="filter-opened-${
          this.attributeFilter
        }" class="custom-arrow mt-auto mb-auto d-none" alt=""> 
      </div>
      <div id="filter-options-${
        this.attributeFilter
      }" class="d-flex flex-column d-none w-100">
      <searchbar class="custom-searchbar position-relative d-flex w-100 h-100 mt-2 mb-2">
        <input id="${
          this.attributeFilter
        }-input" class="custom-input-filter w-100 mt-2 mx-3" type="text"></input>
        <img src="./assets/icons/icon-loop-light.svg" class="custom-loop-light button position-absolute end-0 bottom-0 p-1 me-4" alt="rechercher" role="button" tabindex="0">
      </searchbar>
      <div class="custom-filter-list">
        <ul id="selected-items-${
          this.attributeFilter
        }" class="bg-yellow list-unstyled d-flex flex-column gap-2 my-2 px-3"></ul> 
        <ul class="${
          this.attributeFilter
        }-list list-unstyled d-flex flex-column my-2">
            ${this.generateListHTML()}
        </ul>
      </div>
      </div> 

    `;

    //if input lenght >1 show icon close
    return filter;
  }

  generateListItems() {
    const methodName = `get${this.filterType}List`;
    //format items
    const sortedItems = filterData[methodName]()
      .map(
        (item) =>
          item.trim(0).charAt(0).toUpperCase() + item.slice(1).toLowerCase()
      )
      .sort()
      // keeps only the first occurrence of each item in the array to avoid tag repetition and remove plurals
      .filter(
        (value, index, self) =>
          index ===
          self.findIndex((t) => t.replace(/s$/, "") === value.replace(/s$/, ""))
      );
    return sortedItems;
  }

  generateListHTML() {
    const listItems = this.generateListItems()
      .map(
        (item) =>
          `<li class="list-item button mt-2 mx-3" role="option" tabindex="0">${item}</li>`
      )
      .join("");
    return listItems;
  }

  updateListItems(value) {
    const sortedItems = this.generateListItems();
    let filteredItems = sortedItems; // Initialize with all items
    if (value.length >= 3) {
      filteredItems = sortedItems.filter((item) =>
        formatAttribute(item).includes(value)
      );
    }
    return filteredItems;
  }

  generateUpdatedListHTML(attributeFilter, value) {
    const updatedHTML = this.updateListItems(value)
      .map(
        (item) =>
          `<li class="list-item button mt-2 mx-3" role="option" tabindex="0">${item}</li>`
      )
      .join("");

    const listElement = document.querySelector(`.${attributeFilter}-list`);
    if (listElement) {
      listElement.innerHTML = updatedHTML;
    } else {
      this.generateListHTML();
    }
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

  handleFilterListEvent() {
    const listItems = document.querySelectorAll(
      `.${this.attributeFilter}-list .list-item`
    );

    listItems.forEach((item) => {
      item.addEventListener("click", () => {
        const sectionRecipes = document.querySelector(".section-recipes");
        if (!this.isItemAlreadySelected(item.textContent)) {
          this.createSelectedItemDOM(item.textContent);
          this.getSelectedItems();
          updateRecipesDOM(recipes, sectionRecipes, this.selectedItems);
        }
      });
      item.addEventListener("keydown", (event) => {
        const sectionRecipes = document.querySelector(".section-recipes");
        if (
          (event.key === "Enter" || event.key === " ") &&
          !this.isItemAlreadySelected(item.textContent)
        ) {
          this.createSelectedItemDOM(item.textContent);
          this.getSelectedItems();
          updateRecipesDOM(recipes, sectionRecipes, this.selectedItems);
        }
      });
    });
  }

  getSelectedItems() {
    const selectedItemsContainer = document.querySelector(
      ".section-selected-filters"
    );
    if (selectedItemsContainer) {
      // Check if there are any .selected-item elements within the container
      const hasSelectedItem =
        selectedItemsContainer.querySelector(".selected-item") !== null;
      if (hasSelectedItem) {
        this.selectedItems = Array.from(
          selectedItemsContainer.querySelectorAll("span")
        ).map((span) => span.innerText);
      } else {
        // set to empty filters
        this.selectedItems = [];
      }
    }
    console.log(this.selectedItems);
    return this.selectedItems;
  }

  //check if an item is already selected
  isItemAlreadySelected(text) {
    const selectedItemsContainer = document.getElementById(
      `selected-items-${this.attributeFilter}`
    );
    if (selectedItemsContainer) {
      const selectedItems = Array.from(selectedItemsContainer.children); // Convert NodeList to array
      return selectedItems.some((item) => item.textContent.trim() === text);
    }
    return false;
  }

  handleFilterSelectedListEvent() {
    const selectedItemsContainer = document.getElementById(
      `selected-items-${this.attributeFilter}`
    );
    const sectionSelectedFilters = document.querySelector(
      ".section-selected-filters"
    );

    // Ensure both containers are defined to avoid null errors
    if (!selectedItemsContainer && !sectionSelectedFilters) return;

    // Add event listeners to both containers
    [selectedItemsContainer, sectionSelectedFilters].forEach((container) => {
      if (container) {
        container.addEventListener("click", (event) => {
          const sectionRecipes = document.querySelector(".section-recipes");
          this.handleCloseButtonClick(event);
          this.getSelectedItems();
          updateRecipesDOM(recipes, sectionRecipes, this.selectedItems);
        });
        container.addEventListener("keydown", (event) => {
          const sectionRecipes = document.querySelector(".section-recipes");
          this.handleKeyDown(event);
          this.getSelectedItems();
          updateRecipesDOM(recipes, sectionRecipes, this.selectedItems);
        });
      }
    });
  }

  handleCloseButtonClick(event) {
    const target = event.target;
    if (
      target.classList.contains("close-button") ||
      target.closest(".close-button")
    ) {
      const selectedItem = target.closest(".selected-item");
      if (selectedItem) {
        this.handleRemoveSelectedItem(selectedItem);
        this.closeMatchingItem(selectedItem);
      }
    }
  }

  handleKeyDown(event) {
    const target = event.target;
    if (
      ((event.key === "Enter" || event.key === "Space") &&
        target.classList.contains("close-button")) ||
      target.closest(".close-button")
    ) {
      const selectedItem = target.closest(".selected-item");
      if (selectedItem) {
        this.handleRemoveSelectedItem(selectedItem);
        this.closeMatchingItem(selectedItem);
      }
    }
  }

  closeMatchingItem(selectedItem) {
    // Extract the inner text of the span within the .selected-item
    const itemText = selectedItem.querySelector("span").innerText;
    const selectedItemsContainer = document.getElementById(
      `selected-items-${this.attributeFilter}`
    );
    const sectionSelectedFilters = document.querySelector(
      ".section-selected-filters"
    );
    [selectedItemsContainer, sectionSelectedFilters].forEach((container) => {
      if (container) {
        // Get all span elements within .selected-item
        const spans = container.querySelectorAll(".selected-item span");

        // Find the matching item based on text content
        let matchingItem = null;
        spans.forEach((span) => {
          if (span.innerText === itemText) {
            matchingItem = span.closest(".selected-item");
          }
        });

        // Handle the removal of the selected item, if found
        if (matchingItem) {
          this.handleRemoveSelectedItem(matchingItem);
        }
      }
    });
  }

  handleRemoveSelectedItem(selectedItem) {
    if (selectedItem) {
      selectedItem.remove();
    }
  }

  createSelectedItemDOM(text) {
    const selectedItemsContainer = document.getElementById(
      `selected-items-${this.attributeFilter}`
    );
    if (selectedItemsContainer) {
      const selectedItemList = document.createElement("li");
      selectedItemList.classList.add(
        "selected-item",
        "d-flex",
        "flex-row",
        "align-items-center",
        "justify-content-between",
        "bg-yellow",
        "py-1"
      );
      selectedItemList.innerHTML = `
      <span>${text}</span>
      <button class="close-button btn px-2 w-25" aria-label="Close">
      <img src="./assets/icons/icon-close-filter-selected-item.svg" class="close-icon" alt="close-icon" ></img>
      </button>
    `;

      const button = selectedItemList.querySelector("button");
      const span = selectedItemList.querySelector("span");

      // Add event listeners for focus and blur
      button.addEventListener("focus" || "hover", () => {
        span.classList.add("fw-bold");
      });

      button.addEventListener("blur", () => {
        span.classList.remove("fw-bold");
      });

      selectedItemsContainer.appendChild(selectedItemList);

      // Append the selected item to sectionSelectedFilters if provided
      const sectionSelectedFilters = document.querySelector(
        ".section-selected-filters"
      );
      if (sectionSelectedFilters) {
        const selectedFilterDOM = document.createElement("div");
        selectedFilterDOM.classList.add(
          "custom-selected-filter",
          "selected-item",
          "d-flex",
          "flex-row",
          "align-items-center",
          "justify-content-between",
          "bg-yellow",
          "w-auto",
          "p-2"
        );
        selectedFilterDOM.innerHTML = `
          <span class="px-2">${text}</span>
          <button class="close-button btn px-2 py-1" aria-label="Close">
            <img src="./assets/icons/icon-close-filter-selected.svg" class="close-icon" alt="close-icon" ></img>
          </button>
        `;

        const buttonSelected = selectedFilterDOM.querySelector("button");
        const spanSelected = selectedFilterDOM.querySelector("span");

        // Add event listeners for focus and blur
        buttonSelected.addEventListener("focus" || "hover", () => {
          spanSelected.classList.add("fw-bold");
        });

        buttonSelected.addEventListener("blur", () => {
          spanSelected.classList.remove("fw-bold");
        });
        sectionSelectedFilters.appendChild(selectedFilterDOM);
      }
    }
  }
}

class FilterMenuIngredients extends FilterTemplate {
  constructor() {
    super();
    this.filter = "Ingrédients";
    this.attributeFilter = formatAttribute(this.filter);
    this.filterType = "Ingredient";
  }
}

class FilterMenuAppliances extends FilterTemplate {
  constructor() {
    super();
    this.filter = "Appareils";
    this.attributeFilter = formatAttribute(this.filter);
    this.filterType = "Appliance";
  }
}

class FilterMenuUstensils extends FilterTemplate {
  constructor() {
    super();
    this.filter = "Ustensiles";
    this.attributeFilter = formatAttribute(this.filter);
    this.filterType = "Ustensil";
  }
}

const filterData = new FilterData(recipes);

console.log(filterData.getIngredientList());
console.log(filterData.getApplianceList());
console.log(filterData.getUstensilList());
