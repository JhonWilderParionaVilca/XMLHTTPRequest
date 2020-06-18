const BASE_URL = "https://pokeapi.co/api/v2/";
const image = document.getElementById("image");
const imageA = document.getElementById("imageA");
const name = document.getElementById("name");
const nameA = document.getElementById("nameA");

function renderPokemon(pokemon, Asynchronous = false) {
  if (Asynchronous) {
    nameA.textContent = pokemon.name;
    imageA.setAttribute("src", pokemon.sprites.front_default);
  } else {
    name.textContent = pokemon.name;
    image.setAttribute("src", pokemon.sprites.front_default);
  }
}

function renderError(status) {
  nameA.textContent = `${status} Pokemon no encontrado`;
}

/*----------------------------------------------------------------------------/*
  $Petición Syncrona
/*----------------------------------------------------------------------------*/
function requestSync({ method, url, flagSynchronous }) {
  // instanciar el objeto XMLHTTPRequest
  const request = new XMLHttpRequest();
  //request metodo donde recive el metodo, la url y si es que se va a realizar la peticion de maneara asyncrona
  request.open(method, url, flagSynchronous);
  // podemos enviarle un body si hicieramos un POST
  request.send(null);
  return request.responseText;
}
const pokemonSynchronous = requestSync({
  method: "GET",
  url: `${BASE_URL}pokemon/745`,
  flagSynchronous: false /* Para que el llamado sea sincrono */,
});
renderPokemon(JSON.parse(pokemonSynchronous)); //sincrono

/*----------------------------------------------------------------------------/*
  $Petición asyncrona
/*----------------------------------------------------------------------------*/
/* Stados que existen en XMLHTTPRequest */
function status(readyState) {
  switch (readyState) {
    case 0:
      return "Aun no se a inicializado el request";
    case 1:
      return "Petición cargando";
    case 2:
      return "Petición recibida";
    case 3:
      return "Petición interactica ya se puede hacer algo: interactive";
    case 4:
      return "Completada ya se descargo y podemos renderizarla";
  }
}
function requestAsync({ method, url, flagSynchronous, done, error }) {
  const request = new XMLHttpRequest();
  console.log(request.readyState, status(request.readyState));
  // manejo asyncrono mediante evento no existian promesas antes
  request.onreadystatechange = () => {
    console.log(request.readyState, status(request.readyState));
    if (request.readyState === 4) {
      if (request.status === 200) {
        done(JSON.parse(request.response), flagSynchronous);
      } else {
        error(request.status);
      }
    }
  };
  request.open(method, url, flagSynchronous);
  request.send(null);
}
requestAsync({
  method: "GET",
  url: `${BASE_URL}pokemon/25`,
  flagSynchronous: true /* Para que el llamado sea Asincrono */,
  done: renderPokemon,
  error: renderError,
});
