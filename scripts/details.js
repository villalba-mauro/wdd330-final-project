// Variables globales
const API_KEY = '133de23faac16030d74a00fab6f5ace3';

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  // Obtener el ID de la película desde la URL
  const urlParams = new URLSearchParams(window.location.search);
  const movieId = urlParams.get('id');
  
  if (movieId) {
    cargarDetallesPelicula(movieId);
  } else {
    mostrarError('Movie ID not found');
  }
});

// Cargar los detalles de la película
function cargarDetallesPelicula(movieId) {
  const URL = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=en-US`;
  
  fetch(URL)
    .then(response => response.json())
    .then(pelicula => {
      mostrarDetallesPelicula(pelicula);
      cargarPeliculasSimilares(movieId);
      cargarCreditosPelicula(movieId);
    })
    .catch(error => {
      console.error('Error al cargar los detalles:', error);
      mostrarError('Error loading movie details');
    });
}

// Esta función debe reemplazar la sección correspondiente en details.js
// Mostrar los detalles de la película en la página
function mostrarDetallesPelicula(pelicula) {
  // Actualizar el título de la página
  document.title = `${pelicula.title} - Movie Details`;
  
  // Actualizar la imagen de fondo
  if (pelicula.backdrop_path) {
    document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.22), rgba(0, 0, 0, 0.7)), url(https://image.tmdb.org/t/p/original${pelicula.backdrop_path})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';
  }
  
  // Crear el HTML para los detalles de la película
  const detallesContainer = document.getElementById('detalles-container');
  
  // Crear la estructura principal de detalles
  const detallePeliculaHTML = `
    <div class="detalle-pelicula">
      <div class="poster-container">
        <img class="poster-detalle" src="https://image.tmdb.org/t/p/w500${pelicula.poster_path}" alt="${pelicula.title}">
      </div>
      
      <div class="info-pelicula">
        <h1 class="titulo-pelicula">${pelicula.title}</h1>
        
        ${pelicula.tagline ? `<div class="tagline-container"><p class="tagline">${pelicula.tagline}</p></div>` : ''}
        
        <div class="seccion">
          <h3>Synopsis</h3>
          <p class="sinopsis">${pelicula.overview || 'No synopsis available.'}</p>
        </div>
        
        <div class="meta-info">
          <div class="dato">
            <strong>Release date:</strong>
            <span>${formatearFecha(pelicula.release_date)}</span>
          </div>
          
          <div class="dato">
            <strong>Rating:</strong>
            <span>${pelicula.vote_average.toFixed(1)}/10</span>
          </div>
          
          <div class="dato">
            <strong>Runtime:</strong>
            <span>${pelicula.runtime} minutes</span>
          </div>
          
          <div class="dato">
            <strong>Genres:</strong>
            <span>${pelicula.genres.map(genero => genero.name).join(', ')}</span>
          </div>
        </div>
        <button id="fav-${pelicula.id}" class="fav-movie toggle-button" data-id="${pelicula.id}">Add to favorite</button>
      </div>
    </div>
    
    <div id="similares-container" class="similares-container oculto">
      <h2>Similar movies</h2>
      <div id="similares-peliculas" class="similares-grid"></div>
    </div>
  `;
  
  // Insertar el HTML en el contenedor
  detallesContainer.innerHTML = detallePeliculaHTML;
  
  // Mostrar el contenedor principal
  detallesContainer.classList.remove('oculto');

  // Verificar si la película ya está en favoritos para cambiar el texto del botón
  const btnFavorito = document.querySelector('.fav-movie');
  if (btnFavorito) {
    // Función para actualizar el estado del botón
    function actualizarEstadoBoton() {
      try {
        const favoritos = JSON.parse(localStorage.getItem('favoritosMovies')) || [];
        const esFavorita = favoritos.some(p => p.id === pelicula.id);
        
        // Actualizar el texto y clase del botón
        btnFavorito.textContent = esFavorita ? 'Remove from favourites' : 'Add to favourite';
        
        // Actualizar la clase para cambiar el hover cuando esté en favoritos
        if (esFavorita) {
          btnFavorito.classList.add('alternate'); // Esto hará que el hover sea rojo
        } else {
          btnFavorito.classList.remove('alternate'); // Esto hará que el hover sea verde
        }
        
        console.log(`Movie ${pelicula.id} - ${pelicula.title}, is favorite: ${esFavorita}`);
      } catch (e) {
        console.error("Error checking favorites:", e);
      }
    }
    
    // Actualizar estado inicial
    actualizarEstadoBoton();
    
    btnFavorito.addEventListener('click', function () {
      if (typeof agregarAFavoritos !== 'function') {
        alert("The favorites function is not loaded correctly.");
        return;
      }
    
      const favoritos = JSON.parse(localStorage.getItem('favoritosMovies')) || [];
      const esFavorita = favoritos.some(p => p.id === pelicula.id);
    
      if (esFavorita) {
        eliminarDeFavoritos(pelicula.id);
        actualizarEstadoBoton();
      } else {
        const peliculaData = {
          id: pelicula.id,
          title: pelicula.title,
          poster_path: pelicula.poster_path,
          release_date: pelicula.release_date,
          vote_average: pelicula.vote_average
        };
    
        if (agregarAFavoritos(peliculaData)) {
          actualizarEstadoBoton();
        }
      }
    
      animarBotonFavorito(this);
    });
    
  }
}

// Cargar películas similares
function cargarPeliculasSimilares(movieId) {
  const URL = `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${API_KEY}&language=en-US&page=1`;
  
  fetch(URL)
    .then(response => response.json())
    .then(data => {
      if (data.results && data.results.length > 0) {
        mostrarPeliculasSimilares(data.results.slice(0, 6)); // Mostrar solo 6 películas similares
      } else {
        document.getElementById('similares-container').style.display = 'none';
      }
    })
    .catch(error => {
      console.error('Error loading similar movies:', error);
      document.getElementById('similares-container').style.display = 'none';
    });
}

// Mostrar películas similares
function mostrarPeliculasSimilares(peliculas) {
  const container = document.getElementById('similares-peliculas');
  let contenidoHTML = '';
  
  peliculas.forEach(pelicula => {
    if (pelicula.poster_path) {
      contenidoHTML += `
        <div class="pelicula-similar" >
          <a href="details.html?id=${pelicula.id}">
            <img id="miImagen" src="https://image.tmdb.org/t/p/w200${pelicula.poster_path}" alt="${pelicula.title}">
            <h4>${pelicula.title}</h4>
          </a>
        </div>
      `;
    }
  });
  
  if (contenidoHTML) {
    container.innerHTML = contenidoHTML;
    document.getElementById('similares-container').classList.remove('oculto');

    // Llamar a configurarEventosAnimacion después de añadir las películas al DOM
    if (typeof configurarEventosAnimacion === 'function') {
      configurarEventosAnimacion();
    } else {
      console.error('Function configurarEventosAnimacion is not defined');
    }
  } else {
    document.getElementById('similares-container').style.display = 'none';
  }
}

// Mostrar mensaje de error
function mostrarError(mensaje) {
  const container = document.getElementById('detalles-container');
  container.innerHTML = `
    <div class="error-mensaje">
      <h2>Oops! Something went wrong</h2>
      <p>${mensaje}</p>
      <a href="index.html" class="btn-volver">Back to Menu</a>
    </div>
  `;
  container.classList.remove('oculto');
}

// Función auxiliar para formatear fechas
function formatearFecha(fechaStr) {
  if (!fechaStr) return 'Unknown date';
  
  const fecha = new Date(fechaStr);
  return fecha.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}