async function headerTemplate() {
  function getHeaderDOM() {
    const header = document.getElementById("header");
    header.classList.add("container-fluid", "d-flex", "p-0");
    header.innerHTML = `
    <img class="custom-header-img img-fluid position-relative w-100" src="./assets/images/header.jpg" alt="header-img">
    <div class="custom-header-content container-fluid position-absolute d-flex flex-column top-0 start-0 p-0">
      <img class="custom-logo d-flex align-self-start mt-5 ms-5" src="./assets/images/logo.svg" alt="les petits plats">
        <div class="container d-flex flex-column align-items-center mt-5 mx-auto">
          <h1 class="custom-h1 text-center d-flex mt-5 pt-5">
          CHERCHEZ PARMI PLUS DE 1500 RECETTES DU QUOTIDIEN,SIMPLES ET DÉLICIEUSES</h1>
          <searchbar class="custom-searchbar container-fluid d-flex flex-row mt-2">
            <input type="text" class="form-control custom-input-header fs-6 ps-4 me-3" placeholder="Rechercher une recette, un ingrédient..." tabindex="0">
            <img src="./assets/icons/icon-reset-input.svg" class="custom-clear-input-header button d-none my-auto me-3 p-1" alt="clear input" tabindex="0">
            <img id="search-icon-dark" class="button d-flex h-75 end-0 me-1 my-auto" src="./assets/icons/icon-loop-dark.svg" role="button" alt"" aria-label="Rechercher une recette, un ingredient" tabindex="0" >
            <img id="search-icon-yellow"class="button d-flex h-75 end-0 me-1 my-auto d-none" src="./assets/icons/icon-loop-yellow.svg" role="button" alt="" >
          </searchbar>
        </div>
    </div>
    `;

    const searchIconYellow = document.getElementById("search-icon-yellow");
    const searchIconDark = document.getElementById("search-icon-dark");

    function handleHover() {
      searchIconDark.classList.remove("d-none");
      searchIconDark.classList.add("d-none");
      searchIconYellow.classList.remove("d-none");
      searchIconYellow.classList.add("d-inline");
      searchIconYellow.setAttribute("tabindex", "0");
      searchIconYellow.focus();
    }

    function handleLeave() {
      searchIconYellow.removeAttribute("tabindex");
      searchIconYellow.blur();
      searchIconYellow.classList.remove("d-inline");
      searchIconYellow.classList.add("d-none");
      searchIconDark.classList.remove("d-none");
      searchIconDark.classList.add("d-inline");
    }

    //Add event listeners for click, mouseenter and keydown events
    searchIconDark.addEventListener("focus", handleHover);
    searchIconDark.addEventListener("mouseenter", handleHover);

    searchIconYellow.addEventListener("blur", handleLeave);
    searchIconYellow.addEventListener("mouseleave", handleLeave);

    searchIconYellow.addEventListener("click", () => {
      handleLeave();
    });

    searchIconYellow.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        handleLeave();
      }
    });
  }

  getHeaderDOM();
}

function setupClearInputButton(inputElement, clearButton) {
  inputElement.addEventListener("input", () => {
    if (inputElement.value.length >= 1) {
      clearButton.classList.remove("d-none");
    } else {
      clearButton.classList.add("d-none");
    }
  });

  function handleClearAction() {
    inputElement.value = "";
    clearButton.classList.add("d-none");
  }

  clearButton.addEventListener("click", handleClearAction);
  clearButton.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleClearAction();
    }
  });
}
