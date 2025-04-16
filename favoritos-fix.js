// 
////////////////////////////


// Este archivo asegura que las funciones de favoritos estén disponibles en todas las páginas

// Verificar si las funciones de favoritos ya están definidas
if (typeof agregarAFavoritos !== 'function') {
  // Función para agregar una película a favoritos
  function agregarAFavoritos(pelicula) {
    console.log("Intentando agregar a favoritos:", pelicula);
    
    // Obtener favoritos actuales del localStorage
    let favoritos = [];
    try {
      const favoritosGuardados = localStorage.getItem('favoritosMovies');
      if (favoritosGuardados) {
        favoritos = JSON.parse(favoritosGuardados);
      }
    } catch (e) {
      console.error("Error al leer favoritos del localStorage:", e);
      favoritos = [];
    }
    
    // Verificar si la película ya existe en favoritos
    const peliculaExistente = favoritos.find(p => p.id === pelicula.id);
    
    if (!peliculaExistente) {
      // Agregar la película a favoritos si no existe
      favoritos.push(pelicula);
      
      // Guardar en localStorage
      try {
        localStorage.setItem('favoritosMovies', JSON.stringify(favoritos));
        console.log("Película guardada en favoritos:", pelicula);
        console.log("Total de favoritos:", favoritos.length);
      } catch (e) {
        console.error("Error al guardar en localStorage:", e);
      }
      
      // Mostrar mensaje de confirmación
      mostrarNotificacion('Movie added to favorites!');
      
      return true;
    } else {
      // Mostrar mensaje de que ya existe
      mostrarNotificacion('This movie is already in your favorites');
      
      return false;
    }
  }
}

if (typeof eliminarDeFavoritos !== 'function') {
  // Función para eliminar una película de favoritos
  function eliminarDeFavoritos(movieId) {
    console.log("Intentando eliminar de favoritos ID:", movieId);
    
    // Convertir a número si se pasa como string
    movieId = parseInt(movieId);
    
    // Obtener favoritos actuales
    let favoritos = [];
    try {
      const favoritosGuardados = localStorage.getItem('favoritosMovies');
      if (favoritosGuardados) {
        favoritos = JSON.parse(favoritosGuardados);
      }
    } catch (e) {
      console.error("Error al leer favoritos del localStorage:", e);
      favoritos = [];
    }
    
    // Filtrar para eliminar la película
    const favoritosActualizados = favoritos.filter(pelicula => pelicula.id !== movieId);
    
    // Guardar en localStorage
    try {
      localStorage.setItem('favoritosMovies', JSON.stringify(favoritosActualizados));
      console.log("Película eliminada, nuevos favoritos:", favoritosActualizados);
    } catch (e) {
      console.error("Error al guardar en localStorage:", e);
    }
    
    // Mostrar notificación
    mostrarNotificacion('Movie removed from favorites');
    
    // IMPORTANTE: Manejar la eliminación visualmente sin recargar la página
    // Buscar y eliminar el elemento del DOM directamente
    const elementoAEliminar = document.querySelector(`.pelicula[data-id="${movieId}"]`);
    if (elementoAEliminar) {
      // Añadir una animación de desvanecimiento
      elementoAEliminar.style.transition = "opacity 0.5s, transform 0.5s";
      elementoAEliminar.style.opacity = "0";
      elementoAEliminar.style.transform = "scale(0.8)";
      
      // Eliminar el elemento después de que termine la animación
      setTimeout(() => {
        if (elementoAEliminar.parentNode) {
          elementoAEliminar.parentNode.removeChild(elementoAEliminar);
        }
        
        // Si no quedan películas, mostrar mensaje de no favoritos
        const contenedor = document.getElementById('favoritos-contenedor');
        if (contenedor && contenedor.querySelectorAll('.pelicula').length === 0) {
          contenedor.innerHTML = '<p class="no-favoritos">You have no saved favorite movies.</p>';
        }
      }, 500);
    } else {
      // Si por alguna razón no podemos encontrar el elemento, recargamos la lista
      if (typeof cargarFavoritos === 'function' && window.location.pathname.includes('favourites.html')) {
        setTimeout(cargarFavoritos, 100);
      }
    }
    
    return true;
  }
}

if (typeof mostrarNotificacion !== 'function') {
  // Función para mostrar una notificación al usuario
  function mostrarNotificacion(mensaje) {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion';
    notificacion.textContent = mensaje;
    
    // Estilos para la notificación
    notificacion.style.position = 'fixed';
    notificacion.style.bottom = '20px';
    notificacion.style.right = '20px';
    notificacion.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    notificacion.style.color = 'white';
    notificacion.style.padding = '10px 20px';
    notificacion.style.borderRadius = '5px';
    notificacion.style.zIndex = '1000';
    
    // Agregar al body
    document.body.appendChild(notificacion);
    
    // Eliminar después de 3 segundos
    setTimeout(() => {
      notificacion.style.opacity = '0';
      notificacion.style.transition = 'opacity 0.5s ease';
      
      setTimeout(() => {
        if (notificacion.parentNode) {
          notificacion.parentNode.removeChild(notificacion);
        }
      }, 500);
    }, 3000);
  }
}

if (typeof cargarFavoritos !== 'function') {
  // Función para cargar favoritos en la página de favoritos
  function cargarFavoritos() {
    console.log("Intentando cargar favoritos...");
    const contenedor = document.getElementById('favoritos-contenedor');
    
    // Si no existe el contenedor, no estamos en la página de favoritos
    if (!contenedor) {
      console.log("No se encontró el contenedor de favoritos");
      return;
    }
    
    console.log("Contenedor de favoritos encontrado");
    
    // Obtener favoritos del localStorage
    let favoritos = [];
    try {
      const favoritosGuardados = localStorage.getItem('favoritosMovies');
      console.log("Datos crudos de localStorage:", favoritosGuardados);
      
      if (favoritosGuardados) {
        favoritos = JSON.parse(favoritosGuardados);
      }
    } catch (e) {
      console.error("Error al leer favoritos del localStorage:", e);
      favoritos = [];
    }
    
    console.log("Favoritos recuperados:", favoritos);
    
    // Verificar si hay favoritos
    if (!favoritos || favoritos.length === 0) {
      console.log("No hay películas favoritas");
      contenedor.innerHTML = '<p class="no-favoritos">You have no saved favorite movies.</p>';
      return;
    }
    
    // Generar HTML para cada película favorita
    let htmlFavoritos = '';
    
    favoritos.forEach(pelicula => {
      htmlFavoritos += `
        <div class="pelicula" data-id="${pelicula.id}">
          <img class="poster" src="https://image.tmdb.org/t/p/w500${pelicula.poster_path}" alt="${pelicula.title}">
          <h3 class="titulo">${pelicula.title}</h3>
          <div class="acciones-favorito">
            <a href="details.html?id=${pelicula.id}" class="btn-detalles">See details</a>
            <button class="btn-eliminar" data-id="${pelicula.id}">Remove</button>
          </div>
        </div>
      `;
    });
    
    // Agregar al contenedor
    contenedor.innerHTML = htmlFavoritos;
    console.log("HTML de favoritos generado y añadido al contenedor");
    
    // Agregar eventos para los botones de eliminar
    document.querySelectorAll('.btn-eliminar').forEach(boton => {
      boton.addEventListener('click', function() {
        const movieId = parseInt(this.getAttribute('data-id'));
        console.log("Click en botón eliminar para película ID:", movieId);
        eliminarDeFavoritos(movieId);
      });
    });
    console.log("Eventos de eliminación asignados");
  }
}

if (typeof animarBotonFavorito !== 'function') {
  // Función para verificar la animación al agregar a favoritos
  function animarBotonFavorito(boton) {
    boton.classList.add('jello-vertical');
    
    // Quitar la clase después de que termine la animación
    setTimeout(() => {
      boton.classList.remove('jello-vertical');
    }, 900);
  }
}

// Verificar si estamos en la página de favoritos y cargar la lista
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM completamente cargado - favoritos-fix.js");
  // Si estamos en la página de favoritos
  if (window.location.pathname.includes('favourites') || 
      window.location.href.includes('favourites.html')) {
    console.log("Estamos en la página de favoritos - favoritos-fix.js");
    setTimeout(function() {
      if (typeof cargarFavoritos === 'function') {
        cargarFavoritos();
        
        // Asegurar que los botones de eliminar tengan eventos
        setTimeout(function() {
          document.querySelectorAll('.btn-eliminar').forEach(boton => {
            boton.addEventListener('click', function() {
              const movieId = parseInt(this.getAttribute('data-id'));
              console.log("Click en botón eliminar para película ID:", movieId);
              eliminarDeFavoritos(movieId);
            });
          });
          console.log("Eventos adicionales para botones de eliminar asignados");
        }, 300);
      }
    }, 100);
  }
});