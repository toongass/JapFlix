function borrarLi() {
    const borrar = document.getElementById("lista");

    if (borrar) {
        while (borrar.firstChild) {
            borrar.removeChild(borrar.firstChild);
        }
    }
};

function showProductList(peliculas) {
    const lista_peliculas = document.getElementById('lista');

    for (let pelicula of peliculas){
        const item_pelicula = document.createElement("li");

        item_pelicula.innerHTML = `                                    
                                        <div class="content-container">
                                            <div class="list-group-item list-group-item-action cursor-active bg-dark text-light">
                                                <div class="row">
                                                    <div class="col">
                                                        <div class="d-flex w-100 justify-content-between">
                                                            <h6 class="mb-1"><strong>${pelicula.title}</strong></h6>
                                                            <div class="stars">
                                                                <span class="fa fa-star"></span>
                                                                <span class="fa fa-star"></span>
                                                                <span class="fa fa-star"></span>
                                                                <span class="fa fa-star"></span>
                                                                <span class="fa fa-star"></span>
                                                            </div>
                                                        </div>
                                                        <p class="mb-1 text-muted" style="font-style: italic">${pelicula.tagline}</p>
                                                        <button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasTop" aria-controls="offcanvasTop" onclick="manejadorPelicula(${pelicula.id})">Ver detalles</button>
                                                        <div class="offcanvas offcanvas-top" tabindex="-1" id="offcanvasTop" aria-labelledby="offcanvasTopLabel">
                                                            <div class="offcanvas-header">
                                                                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>`;

        
      const estrellas = item_pelicula.lastElementChild.querySelectorAll(".fa.fa-star");

      for (let i=0; i<(pelicula.vote_average/2); i++){
        estrellas[i].classList.add('checked');
      }

      lista_peliculas.appendChild(item_pelicula);
    };        
} 

async function manejadorPelicula(peliculaId) {
    // Busca la película correspondiente por su id

    let promise = await fetch('https://japceibal.github.io/japflix_api/movies-data.json'); //pido los datos de la api de japflix
  
    if (promise.ok) {
        let peliculas = await promise.json();

        const pelicula = peliculas.find(p => p.id === peliculaId);

        console.log(pelicula)

        if (pelicula) {
            const contenedorDetalle = document.getElementById("offcanvasTop");
            contenedorDetalle.innerHTML = `
                                            <div class="offcanvas-body text-dark">
                                                <h1>${pelicula.title}</h1>
                                                <p>${pelicula.overview}</p>
                                                <hr>
                                                <p class="text-muted">${pelicula.genres.map(genre => genre.name).join(' - ')}</p>
                                                <div class="dropdown text-end">
                                                    <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                        More
                                                    </button>
                                                    <ul class="dropdown-menu">
                                                        <li class="dropdown-item">Year: ${pelicula.release_date.substring(0, 4)}</li>
                                                        <li class="dropdown-item">Runtime: ${pelicula.runtime} mins</li>
                                                        <li class="dropdown-item">Budget: $${pelicula.budget}</li>
                                                        <li class="dropdown-item">Revenue: $${pelicula.revenue}</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        `;
            
        }
    }
}

async function filterAndShowProductsBySearch(searchTerm, URL) {
    
    let promise = await fetch(URL); //pido los datos de la api de japflix
  
    if (promise.ok) {
        let datos = await promise.json();
        let currentArray = datos;
        
        if (searchTerm !== "") {
            let filteredArray = currentArray.filter(product => {
            const productTitle = product.title.toLowerCase();
            const productGenres = product.genres.map(genre => genre.name.toLowerCase()).join(', ');
            const productTagline = product.tagline.toLowerCase();
            const productOverview = product.overview.toLowerCase();
            return (productTitle.includes(searchTerm) || productGenres.includes(searchTerm) || productTagline.includes(searchTerm) || productOverview.includes(searchTerm));
            });  
            showProductList(filteredArray);
        } else {
            showProductList(currentArray);
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const BDD = 'https://japceibal.github.io/japflix_api/movies-data.json';
    const busqueda = document.getElementById('inputBuscar');
    const boton = document.getElementById('btnBuscar');
    //const detallePelicula = document.getElementById(detallePelicula);

    boton.addEventListener("click", () => {
        if (busqueda.value) {
            borrarLi();
            filterAndShowProductsBySearch(busqueda.value.trim().toLowerCase(), BDD); 
        }
    })
    
    

});