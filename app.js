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
    const URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-EN&page=${pagina}`;

    fetch(URL)
    .then(response => response.json())
    .then(data => {
      console.log(data.results); // aquí están las pelis populares
      
      let peliculas = '';
      data.results.forEach(pelicula => {
        console.log(pelicula.title); 
        peliculas += 
        `<div class="pelicula" data-id="${pelicula.id}">
          <img class = "poster" src="https://image.tmdb.org/t/p/w500${pelicula.poster_path}">
          <h3 class="titulo">${pelicula.title } </h3>
          <a href="details.html?id=${pelicula.id}" class="btn-detalles">See details</a>
        </div>
        `;
      }); 

      document.getElementById('contenedor').innerHTML = peliculas;

      // Añadimos el evento click a cada película después de cargarlas
      document.querySelectorAll('.pelicula').forEach(item => {
        item.addEventListener('click', () => {
          const movieId = item.getAttribute('data-id');
          mostrarDetallesPelicula(movieId);
        });
      });
    })
    .catch(error => console.error('Error:', error));
}
cargarPeliculas();
