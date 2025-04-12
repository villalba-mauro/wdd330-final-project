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