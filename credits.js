// Función para cargar los créditos de la película
function cargarCreditosPelicula(movieId) {
  console.log("Cargando créditos para la película ID:", movieId);
  const API_KEY = '133de23faac16030d74a00fab6f5ace3';
  const URL = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}&language=en-EN`;
  
  fetch(URL)
    .then(response => response.json())
    .then(data => {
      console.log("Datos de créditos recibidos:", data);
      if (data.cast && data.cast.length > 0) {
        mostrarActoresPrincipales(data.cast.slice(0, 5)); // Mostrar solo los 5 primeros actores
      }
      
      // Opcional: También puedes mostrar directores, productores, etc.
      if (data.crew && data.crew.length > 0) {
        const directores = data.crew.filter(persona => persona.job === 'Director');
        if (directores.length > 0) {
          mostrarDirectores(directores);
        }
      }
    })
    .catch(error => {
      console.error('Error al cargar los créditos:', error);
    });
}

// Función para mostrar los actores principales
function mostrarActoresPrincipales(actores) {
  console.log("Mostrando actores principales:", actores);
  const container = document.createElement('div');
  container.className = 'actores-container';
  
  const titulo = document.createElement('h2');
  titulo.textContent = 'Reparto principal';
  container.appendChild(titulo);
  
  const actoresGrid = document.createElement('div');
  actoresGrid.className = 'actores-grid';
  
  actores.forEach(actor => {
    const actorElement = document.createElement('div');
    actorElement.className = 'actor';
    
    const actorHTML = `
      <div class="actor-imagen">
        ${actor.profile_path 
          ? `<img src="https://image.tmdb.org/t/p/w185${actor.profile_path}" alt="${actor.name}" class="actor-img">`
          : `<div class="no-imagen">No image</div>`
        }
      </div>
      <div class="actor-info">
        <h4>${actor.name}</h4>
        <p>${actor.character}</p>
      </div>
    `;
    
    actorElement.innerHTML = actorHTML;
    actoresGrid.appendChild(actorElement);
  });
  
  container.appendChild(actoresGrid);
  
  // Añadir el contenedor de actores antes de las películas similares
  const similares = document.getElementById('similares-container');
  if (similares) {
    similares.parentNode.insertBefore(container, similares);
    console.log("Sección de actores añadida al DOM");
  } else {
    const main = document.getElementById('detalles-container');
    if (main) {
      main.appendChild(container);
      console.log("Sección de actores añadida al DOM (alternativa)");
    }
  }
  
  // Configurar animación para las imágenes de los actores
  const actorImgs = document.querySelectorAll('.actor-imagen img');
  actorImgs.forEach(img => {
    img.addEventListener('click', function() {
      // Eliminar la clase de animación si ya existe
      this.classList.remove('jello-vertical');
      
      // Forzar un reflow para reiniciar la animación
      void this.offsetWidth;
      
      // Añadir la clase para activar la animación
      this.classList.add('jello-vertical');
      console.log("Animación jello-vertical aplicada a imagen de actor");
    });
  });
}

// Función para mostrar los directores
function mostrarDirectores(directores) {
  const metaInfo = document.querySelector('.meta-info');
  
  if (metaInfo) {
    const directorElement = document.createElement('div');
    directorElement.className = 'dato';
    
    const directorHTML = `
      <strong>Director:</strong>
      <span>${directores.map(director => director.name).join(', ')}</span>
    `;
    
    directorElement.innerHTML = directorHTML;
    metaInfo.appendChild(directorElement);
    console.log("Información de director añadida");
  }
}