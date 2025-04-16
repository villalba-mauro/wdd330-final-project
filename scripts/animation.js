// Esperar a que las imágenes estén cargadas en el DOM
document.addEventListener('DOMContentLoaded', () => {
  // La función que agrega los eventos será llamada después de que se muestren las películas similares
  configurarEventosAnimacion();
});

// Función para configurar los eventos de animación
function configurarEventosAnimacion() {
  // Seleccionar todas las imágenes de películas similares
  const peliculaImgs = document.querySelectorAll('.pelicula-similar img');
  
  // Agregar un evento de clic a cada imagen
  peliculaImgs.forEach(img => {
    img.addEventListener('click', function(event) {
      // Prevenir la navegación para que podamos ver la animación
      event.preventDefault();
      
      // Eliminar la clase de animación si ya existe
      this.classList.remove('jello-vertical');
      
      // Forzar un reflow para reiniciar la animación
      void this.offsetWidth;
      
      // Añadir la clase para activar la animación
      this.classList.add('jello-vertical');
      
      // Obtener el enlace padre para la navegación
      const enlace = this.closest('a');
      
      // Navegar después de que termine la animación
      setTimeout(() => {
        if (enlace && enlace.href) {
          window.location.href = enlace.href;
        }
      }, 900); // 900ms es la duración de la animación
    });
  });
}

// También podemos observar cambios en el DOM para detectar cuando se añaden nuevas películas similares
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      // Verificar si se agregaron películas similares
      if (document.querySelector('#similares-peliculas .pelicula-similar')) {
        configurarEventosAnimacion();
      }
    }
  });
});

// Comenzar a observar el contenedor de películas similares
window.addEventListener('load', () => {
  const similaresContainer = document.getElementById('similares-peliculas');
  if (similaresContainer) {
    observer.observe(similaresContainer, { childList: true, subtree: true });
  }
});
// Función para observar cuándo los actores entran en el viewport
function configurarAnimacionScroll() {
// Crear el observador de intersección
const options = {
  root: null, // Usar el viewport como contenedor
  rootMargin: '0px', // Sin margen
  threshold: 0.1 // Activar cuando al menos el 10% del elemento esté visible
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    // Si el elemento es visible
    if (entry.isIntersecting) {
      const actorElement = entry.target;
      
      // Reiniciar la animación
      actorElement.style.animation = 'none';
      void actorElement.offsetWidth; // Forzar un reflow
      
      // Aplicar la animación (manteniendo el delay establecido)
      const delay = actorElement.style.animationDelay || '0s';
      actorElement.style.animation = `customAni 1.5s ease-in-out ${delay} forwards`;        
      // Dejar de observar este elemento una vez que se ha animado
      observer.unobserve(actorElement);
      
      console.log('Animando actor al hacer scroll:', actorElement);
    }
  });
}, options);

// Observar todos los elementos con la clase 'actor'
setTimeout(() => {
const actorElements = document.querySelectorAll('.actor');
actorElements.forEach((actor, index) => {
  // Quitar cualquier animación previa
  actor.style.animation = 'none';
  
  // Agregar el retraso escalonado basado en el índice
  actor.style.animationDelay = `${index * 0.15}s`;
  
  // Comenzar a observar el elemento
  observer.observe(actor);
});

console.log(`Configurada animación al scroll para ${actorElements.length} actores`);
}, 300); // Pequeño retraso para asegurar que los elementos están en el DOM // Pequeño retraso para asegurar que los elementos están en el DOM
}

// Añadir esta llamada al final de la función mostrarActoresPrincipales
// o como una función separada que se llama después de cargar los actores