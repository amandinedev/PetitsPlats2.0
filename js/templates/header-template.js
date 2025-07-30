async function headerTemplate() {
  function getHeaderDOM() {
    const header = document.getElementById("header");
    header.classList.add("container", "d-flex", "p-0");
    header.innerHTML = `
    <img class="header-img img-fluid position-relative w-100" src="./assets/images/header.jpg" alt="header-img">
    <div class="container position-absolute d-flex flex-column">
      <img class="custom-logo d-flex align-self-start w-25 mt-5 ms-2" src="./assets/images/logo.svg" alt="les petits plats">
        <div class="container d-flex flex-column align-items-center mt-5">
          <h1 class="custom-h1 text-center d-flex m-4 w-50 fs-1">
          CHERCHEZ PARMI PLUS DE 1500 RECETTES DU QUOTIDIEN,SIMPLES ET DÉLICIEUSES</h1>
          <searchbar class="custom-searchbar container-fluid d-flex flex-row">
            <input type="text" class="form-control custom-input-header fs-6 ps-4 me-3" placeholder="Rechercher une recette, un ingrédient..." tabindex="0">
            <img id="search-icon-dark" class="button d-flex h-75 end-0 me-1 my-auto" src="./assets/icons/icon-loop-dark.svg" role="button" aria-label="Rechercher une recette, un ingredient" tabindex="0" >
            <img id="search-icon-yellow"class="button d-flex h-75 end-0 me-1 my-auto d-none" src="./assets/icons/icon-loop-yellow.svg" role="button" aria-label="Rechercher une recette, un ingredient" >
          </searchbar>
        </div>
    </div>
    `;

    const searchIconYellow = document.getElementById("search-icon-yellow");
    const searchIconDark = document.getElementById("search-icon-dark");


    function handleHover() {
      searchIconDark.classList.remove("d-none")
      searchIconDark.classList.add("d-none");
      searchIconYellow.classList.remove("d-none")
      searchIconYellow.classList.add("d-inline");
      searchIconYellow.setAttribute("tabindex", "0");
      searchIconYellow.focus();
  }

    function handleLeave() {
      searchIconYellow.removeAttribute("tabindex");
      searchIconYellow.blur();
      searchIconYellow.classList.remove("d-inline")
      searchIconYellow.classList.add("d-none");
      searchIconDark.classList.remove("d-none")
      searchIconDark.classList.add("d-inline");
    }

  //Add event listeners for click, mouseenter and keydown events
    searchIconDark.addEventListener('focus', handleHover);
    searchIconDark.addEventListener('mouseenter', handleHover);

    searchIconYellow.addEventListener('blur', handleLeave);
    searchIconYellow.addEventListener('mouseleave', handleLeave);

    searchIconYellow.addEventListener('click', () => {
      handleLeave();
    });

    searchIconYellow.addEventListener('keydown', (event) => {
     if (event.key === 'Enter' || event.key === ' ') {
        handleLeave();
      }
    });
  }

  getHeaderDOM();
}

