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
    const ingredientList = this.formatListItems(this.ingredientList);
    return ingredientList;
  }

  getApplianceList() {
    const applianceList = this.formatListItems(this.applianceList);
    return applianceList;
  }

  getUstensilList() {
    const ustensilList = this.formatListItems(this.ustensilList);
    return ustensilList;
  }

  updateListUsingValue(list, searchValue) {
    if (searchValue && searchValue.length >= 3) {
      // Check if value is provided and has at least 3 characters
      const filteredItems = this.formatListItems(
        list
          .map((item) => formatAttribute(item)) // Format each item
          .filter((item) => item.includes(searchValue))
      );
      return filteredItems;
    } else {
      // If searchValue is empty or less than 3
      return list; // Update the list with original items without filtering
    }
  }

  updateOtherList(filteredRecipes) {
    this.ingredientList = filteredRecipes.flatMap((recipe) =>
      recipe.ingredients.map((ingredient) => ingredient.ingredient)
    );
    this.applianceList = filteredRecipes.map((recipe) => recipe.appliance);
    this.ustensilList = filteredRecipes.flatMap((recipe) => recipe.ustensils);

    return {
      ingredients: this.getIngredientList(),
      appareils: this.getApplianceList(),
      ustensiles: this.getUstensilList(),
    };
  }

  formatListItems(filterType) {
    // Format items to capitalize first letter and lowercase rest of string
    const listFormated = filterType
      .map((item) => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase())
      .sort()
      // Keeps only the first occurrence of each item in the array to avoid tag repetition and remove plurals
      .filter(
        (value, index, self) =>
          index ===
          self.findIndex((t) => t.replace(/s$/, "") === value.replace(/s$/, ""))
      );
    return listFormated;
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
  constructor(filters) {
    this.filter = "";
    this.attributeFilter = formatAttribute(this.filter);
    this.filterType = "";
    this.selectedItems = [];
    this.filterDataInstance = {};
  }

  useIngredientList() {
    const ingredientList = this.filterMenuIngredients.filterDataInstance;
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
        <label for="${this.attributeFilter}-input" class="fw-medium" for="${
      this.attributeFilter
    }">${this.filter}</label>
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
        }-input" class="custom-input-filter w-100 mt-2 mx-3 ps-2" type="text" aria-label="search input, minimum 3 characters"></input>
        <img src="./assets/icons/icon-reset-input2.svg" 
        class="custom-clear-input-filter custom-clear-input-filter-${
          this.attributeFilter
        } button d-none position-absolute end-0 bottom-0 p-1" alt="clear input" tabindex="0">
        <img src="./assets/icons/icon-loop-light.svg" 
        class="custom-loop-light position-absolute end-0 bottom-0 p-1 me-4" alt="">
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

  generateListHTML() {
    let listItems = [];
    listItems = this.filterDataInstance;

    const htmlString = listItems
      .map(
        (item) =>
          `<li class="list-item button mt-2 mx-3" role="option" tabindex="0">${item}</li>`
      )
      .join("");

    return htmlString;
  }

  generateUpdatedListHTML(filterData, attributeFilter, updatedList) {
    const updatedHTML = updatedList
      .map(
        (item) =>
          `<li class="list-item button mt-2 mx-3" role="option" tabindex="0">${item}</li>`
      )
      .join("");

    const listElement = document.querySelector(`.${attributeFilter}-list`);
    if (listElement) {
      // listElement.innerHTML = updatedHTML;
      // Clear all existing children
      while (listElement.firstChild) {
        listElement.removeChild(listElement.firstChild);
      }
      // Insert the new HTML content
      listElement.insertAdjacentHTML("afterbegin", updatedHTML);
      // Reassign event listeners to the newly generated list items
      this.handleFilterListEvent(filterData, attributeFilter);
      this.handleFilterSelectedListEvent(filterData);
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

  handleFilterListEvent(filterData, attributeFilter, filteredRecipesByHeader) {
    let filterContainer = document.getElementById(`filter-${attributeFilter}`);
    let listItems = filterContainer.querySelectorAll(
      `.${attributeFilter}-list .list-item`
    );
    listItems.forEach((item) => {
      item.addEventListener("click", () => {
        this.handleItemSelection(filterData, attributeFilter, item);
      });

      item.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          this.handleItemSelection(filterData, attributeFilter, item, event);
        }
      });
    });
  }

  handleItemSelection(filterData, attributeFilter, item, event = null) {
    const sectionRecipes = document.querySelector(".section-recipes");
    if (!this.isItemAlreadySelected(item.textContent)) {
      this.selectedItems.push(item.textContent);

      this.createSelectedItemDOM(item.textContent, attributeFilter);

      this.updateFiltersAndRecipes.call(this, filterData);
    }
  }

  handleItemUnSelection(filterData, selectedItem) {
    const sectionRecipes = document.querySelector(".section-recipes");

    // Remove item from selectedItems
    const itemText = selectedItem.querySelector("span").innerText;
    if (itemText && this.selectedItems.includes(itemText)) {
      this.selectedItems = this.selectedItems.filter(
        (item) => item !== itemText
      );

      this.updateFiltersAndRecipes.call(this, filterData);
    }
  }

  updateFiltersAndRecipes(filterData) {
    // Filter recipes based on the header input
    const headerInputElement = document.querySelector(".custom-input-header");
    const filteredRecipesByHeader = filterRecipesByHeader(
      formatAttribute(headerInputElement.value)
    );

    // Filter recipes based on selected items (filters)
    const filteredRecipesBySelectedItems = filterRecipesBySelectedItems(
      recipes,
      this.selectedItems
    );

    // Get the intersection of both filtered lists
    const filteredRecipes = filteredRecipesByHeader.filter((recipe) =>
      filteredRecipesBySelectedItems.includes(recipe)
    );

    // Update the recipe DOM with the intersected recipes
    updateRecipeDOM(filteredRecipes);

    // Get updated lists from filterDataInstance after removal of an item
    const updatedListsAfterRemoval =
      filterData.updateOtherList(filteredRecipes);

    // Generate new HTML for each updated list
    for (const [key, value] of Object.entries(updatedListsAfterRemoval)) {
      this.generateUpdatedListHTML(filterData, key, value);
    }
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

  handleFilterSelectedListEvent(filterData, attributeFilter) {
    // Ensure filterData is defined, if not return early
    if (typeof filterData === "undefined") {
      console.warn("filterData is undefined");
      return;
    }

    const closeButtons = document.querySelectorAll(".close-button");
    closeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const selectedItem = button.closest(".selected-item");
        if (selectedItem) {
          this.closeMatchingItem(selectedItem);
          this.handleRemoveSelectedItem(selectedItem);
          this.handleItemUnSelection(filterData, selectedItem);
        }
      });
      button.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === "Space") {
          // Assuming you want to handle Enter key press
          const selectedItem = button.closest(".selected-item");
          if (selectedItem) {
            this.closeMatchingItem(selectedItem, attributeFilter);
            this.handleRemoveSelectedItem(selectedItem);
            this.handleItemUnSelection(filterData, selectedItem);
          }
        }
      });
    });
  }

  closeMatchingItem(selectedItem, attributeFilter) {
    // Extract the inner text of the span within the .selected-item
    let itemText = selectedItem.querySelector("span").innerText;
    let target;
    if (selectedItem.closest(".section-selected-filters")) {
      target = document.querySelector(".section-filters");
    } else {
      target = document.querySelector(".section-selected-filters");
    }

    // Find the matching item based on text content
    let spans = target.querySelectorAll(".selected-item span");
    for (let span of spans) {
      if (span.innerText === itemText) {
        // Found a matching item, remove it from DOM
        let matchingItem = span.closest(".selected-item");
        if (matchingItem) {
          matchingItem.remove();
        }
        break; // Exit loop once we found and removed the match
      }
    }
  }

  handleRemoveSelectedItem(selectedItem) {
    if (selectedItem) {
      selectedItem.remove();
    }
  }

  createSelectedItemDOM(text, attributeFilter) {
    const selectedItemsContainer = document.getElementById(
      `selected-items-${attributeFilter}`
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

      button.addEventListener("hover", () => {
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
        buttonSelected.addEventListener("focus", () => {
          spanSelected.classList.add("fw-bold");
        });

        buttonSelected.addEventListener("hover", () => {
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
  constructor(ingredientList) {
    super();
    this.filter = "Ingrédients";
    this.attributeFilter = formatAttribute(this.filter);
    this.filterType = "Ingredient";
    this.filterDataInstance = ingredientList;
  }
}

class FilterMenuAppliances extends FilterTemplate {
  constructor(applianceList) {
    super();
    this.filter = "Appareils";
    this.attributeFilter = formatAttribute(this.filter);
    this.filterType = "Appliance";
    this.filterDataInstance = applianceList;
  }
}

class FilterMenuUstensils extends FilterTemplate {
  constructor(ustensilList) {
    super();
    this.filter = "Ustensiles";
    this.attributeFilter = formatAttribute(this.filter);
    this.filterType = "Ustensil";
    this.filterDataInstance = ustensilList;
  }
}
