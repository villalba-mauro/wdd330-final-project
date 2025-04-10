// const cargarPeliculas = async() =>{

//     try{
//         const respuesta =  await fetch('https://api.themoviedb.org/3/movie/550?api_key=133de23faac16030d74a00fab6f5ace3');
                           
//         console.log(respuesta);
//     }
//     catch(error){
//         console.log(error)
//     }

// }


// cargarPeliculas();
let pagina = 1;
const btnAnterior = document.getElementById('btnAnterior');
const btnSiguiente = document.getElementById('btnSiguiente');

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
    const API_KEY = '133de23faac16030d74a00fab6f5ace3'; // pon aquí tu clave real
    const URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=es-ES&page=${pagina}`;

    fetch(URL)
    .then(response => response.json())
    .then(data => {
      console.log(data.results); // aquí están las pelis populares
      
      let peliculas = '';
      data.results.forEach(pelicula => {
        console.log(pelicula.title); 
        peliculas += 
        `<div class="pelicula">
          <img class = "poster" src="https://image.tmdb.org/t/p/w500${pelicula.poster_path}">
          <h3 class="titulo">${pelicula.title } </h3>

        </div>
        
        
        `;
      }); 

      document.getElementById('contenedor').innerHTML = peliculas;

    })
    .catch(error => console.error('Error:', error));
}
cargarPeliculas();
 