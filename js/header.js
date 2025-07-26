async function headerTemplate() {
  function getHeaderDOM() {
    const header = document.getElementById("header");
    header.classList.add("container", "d-flex");
    header.innerHTML = `
    <img class="header-img container position-relative" src="./assets/images/header.jpg" alt="header-img">
    <div class="container position-absolute d-flex flex-column">
      <img class="custom-logo d-flex align-self-start w-25 mt-5 ms-2" src="./assets/images/logo.svg" alt="les petits plats">
        <div class="container d-flex flex-column align-items-center mt-5">
          <h1 class="custom-h1 text-center d-flex m-4 w-50 fs-1">
          CHERCHEZ PARMI PLUS DE 1500 RECETTES DU QUOTIDIEN,SIMPLES ET DÉLICIEUSES</h1>
          <searchbar class="custom-searchbar container-fluid d-flex flex-row">
            <input type="text" class="form-control custom-input fs-6 ps-4 me-3" placeholder="Rechercher une recette, un ingrédient...">
            <img class="button d-flex h-75 end-0 me-1 my-auto" src="./assets/icons/icon-loop-dark.svg" role="button" aria-label="Rechercher une recette, un ingredient" tabindex="0">
          </searchbar>
        </div>
    </div>
    `;
  }
  getHeaderDOM();
}

//event listeners icon turn yellow on hover
