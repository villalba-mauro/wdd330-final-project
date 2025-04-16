let pagina = 1;
const btnAnterior = document.getElementById('btnAnterior');
const btnSiguiente = document.getElementById('btnSiguiente');
const API_KEY = '133de23faac16030d74a00fab6f5ace3'; // pon aquí tu clave real


btnSiguiente.addEventListener('click',()=>{
  if(pagina < 1000){
    pagina += 1;
    cargarPeliculas();
  }

})

btnAnterior.addEventListener('click',()=>{
  if(pagina > 1){
    pagina -= 1;
    cargarPeliculas();
  }

})
const cargarPeliculas = () =>{
    const URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${pagina}`;

    fetch(URL)
    .then(response => response.json())
    .then(data => {
      console.log(data.results); // aquí están las pelis populares
      
      let peliculas = '';
      data.results.forEach(pelicula => {
        console.log(pelicula.title); 
        peliculas += 
        `<div class="pelicula" data-id="${pelicula.id}">
          <a href="details.html?id=${pelicula.id}" class="pelicula-enlace">
            <img class="poster" src="https://image.tmdb.org/t/p/w500${pelicula.poster_path}" alt="${pelicula.title}">
            <h3 class="titulo">${pelicula.title}</h3>
          </a>
        </div>
        `;
      });

      document.getElementById('contenedor').innerHTML = peliculas;

      // Añadimos el evento click a cada película después de cargarlas
      document.querySelectorAll('.pelicula').forEach(item => {
        item.addEventListener('click', (e) => {
          // Solo navegamos si no se hizo clic en el botón de favoritos
          if (!e.target.classList.contains('btn-favorito')) {
            const movieId = item.getAttribute('data-id');
            window.location.href = `details.html?id=${movieId}`;
          }
        });
      });

      // Agregar eventos a los botones de favoritos
      document.querySelectorAll('.btn-favorito').forEach(boton => {
        // Verificar si la película ya está en favoritos para actualizar el texto del botón
        actualizarEstadoBotonFavorito(boton);

        boton.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation(); // Prevenir que el clic se propague a la película
          
          const id = parseInt(this.getAttribute('data-id'));
          const title = this.getAttribute('data-title');
          const poster_path = this.getAttribute('data-poster');
          const release_date = this.getAttribute('data-date');
          const vote_average = parseFloat(this.getAttribute('data-rating'));
          
          const peliculaData = {
            id,
            title,
            poster_path,
            release_date,
            vote_average
          };
          
          const favoritos = JSON.parse(localStorage.getItem('favoritosMovies')) || [];
          const esFavorita = favoritos.some(p => p.id === id);
          
          if (esFavorita) {
            eliminarDeFavoritos(id);
          } else {
            agregarAFavoritos(peliculaData);
          }
          
          // Actualizar texto del botón
          actualizarEstadoBotonFavorito(this);
          
          // Animar el botón
          animarBotonFavorito(this);
        });
      });
    })
    .catch(error => console.error('Error:', error));
}

// Función para actualizar el estado visual del botón de favoritos
function actualizarEstadoBotonFavorito(boton) {
  const id = parseInt(boton.getAttribute('data-id'));
  const favoritos = JSON.parse(localStorage.getItem('favoritosMovies')) || [];
  const esFavorita = favoritos.some(p => p.id === id);
  
  if (esFavorita) {
    boton.textContent = '❌ Remove from favourites';
    boton.classList.add('remove-fav');
  } else {
    boton.textContent = '⭐ Add to favourite';
    boton.classList.remove('remove-fav');
  }
}

cargarPeliculas();

