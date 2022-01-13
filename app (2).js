const API_KEY = "api_key=068b09d7c6c714deb639ea6117927bad";
const BASE_URL = "https://api.themoviedb.org/3";
const searchURL = BASE_URL + '/search/movie?' + API_KEY;
const API_URL = BASE_URL + "/discover/movie?sort_by=popularity.desc&" + API_KEY;
const IMG_URL = "https://image.tmdb.org/t/p/w500";
const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const tagEL = document.getElementById("tags");
const prev = document.getElementById("prev");
const next = document.getElementById("next");
const current = document.getElementById("current");



const genre = [{ "id": 28, "name": "Action" }, { "id": 12, "name": "Adventure" }, { "id": 16, "name": "Animation" }, { "id": 35, "name": "Comedy" }, { "id": 80, "name": "Crime" }, { "id": 99, "name": "Documentary" }, { "id": 18, "name": "Drama" }, { "id": 10751, "name": "Family" }, { "id": 14, "name": "Fantasy" }, { "id": 36, "name": "History" }, { "id": 27, "name": "Horror" }, { "id": 10402, "name": "Music" }, { "id": 9648, "name": "Mystery" }, { "id": 10749, "name": "Romance" }, { "id": 878, "name": "Science Fiction" }, { "id": 10770, "name": "TV Movie" }, { "id": 53, "name": "Thriller" }, { "id": 10752, "name": "War" }, { "id": 37, "name": "Western" }]


var currentPage = 1 ;
var nextPage ;
var prevPage ;
var totalPages ;



var selectedGenre = [];
setGenre();
function setGenre() {
    tagEL.innerHTML = '';
    genre.forEach(gen => {
        const t = document.createElement('div');
        t.classList.add('tag');
        t.id = gen.id;
        t.innerText = gen.name;
        t.addEventListener('click', () => {
            if (selectedGenre.length == 0) {
                selectedGenre.push(gen.id);
            }
            else {
                if (selectedGenre.includes(gen.id)) {
                    selectedGenre.forEach((id, idx) => {
                        if (id == gen.id) {
                            selectedGenre.splice(idx, 1);
                        }
                    })
                } else {
                    selectedGenre.push(gen.id);
                }
            }

            getMovies(API_URL + `&with_genres=` + encodeURI(selectedGenre.join(',')));
            highlightSelection();
        })
        tagEL.append(t);
    })
}

function highlightSelection() {
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.classList.remove('highlight')
    })
    if (selectedGenre.length !== 0) {
        selectedGenre.forEach(id => {
            const highlightedTag = document.getElementById(id);
            highlightedTag.classList.add('highlight');
        })
    }
}




getMovies(API_URL);
function getMovies(url) {
    lastUrl = url;
    fetch(url).then(res => res.json()).then(data => {
        console.log(data);
        if (data.results.length !== 0) {
            showMovies(data.results);
            var currentPage = data.page;
            nextPage = currentPage + 1;


            

            prevPage = currentPage - 1;
            totalPages = data.total_pages;
            current.innerText = currentPage;
            if (currentPage <= 1) {
                prev.classList.add('disabled');
                next.classList.remove('disabled')
            }
            else if (currentPage >= 1 && currentPage <= totalPages) {
                prev.classList.remove('disabled')
                next.classList.remove('disabled')
            }
        }
        else {
            main.innerHTML = `<h1 class="no-results">No Results Found</h1>`
        }

    })
}


function showMovies(data) {

    main.innerHTML = "";
    data.forEach(movie => {
        const { title, poster_path, vote_average, overview } = movie;
        const movieel = document.createElement('div');
        movieel.classList.add('movie');
        movieel.innerHTML = `<img src=${poster_path ? IMG_URL + poster_path : "https://www.google.com/search?q=movie+placeholder+image&rlz=1C1VDKB_enIN964IN964&sxsrf=AOaemvJfO8v-JA4QopOs-l_3uQCeCnhIjg:1640680113516&tbm=isch&source=iu&ictx=1&fir=H_lXIFKKndmGiM%252CEPF90O_nF7eUcM%252C_%253BCE46yRxlJzUI1M%252CtwPSmunOpgUrUM%252C_%253BH6CTshXcedThGM%252C9LX8U020La1p_M%252C_%253BVBz1UKUIJ4gizM%252ChbN7_9bybs9HcM%252C_%253BPBuBS7xY9GT0bM%252C0AH6hWGoEGlaRM%252C_%253BW06xtuL_55bukM%252CjYFE1voYlfynsM%252C_%253B9xvf88bV8EcfeM%252Cy6fo67GcscwiHM%252C_%253BOoSp7EMpnmpPKM%252CtwPSmunOpgUrUM%252C_%253Byz0b8ezNeuhH6M%252CFRvK3nIQeHPUpM%252C_%253BlPtjMwGYT1O4AM%252CtwPSmunOpgUrUM%252C_%253Bgm3lkDYfRtoWOM%252Cbpj3RACMUtnKiM%252C_%253BFnsvSkQW9CSIAM%252CZggjYV5JIgA4IM%252C_%253BvvE-qRdZR1PRUM%252ChbN7_9bybs9HcM%252C_%253B7oMm2DBGuDdBKM%252CUSOmDZaOk7PzEM%252C_%253BGDtGGHfYhIuscM%252C7X1_gqVww-H1bM%252C_%253BJLhW26PwODnoqM%252C_ExRkVmFeQaMXM%252C_&vet=1&usg=AI4_-kTtsZN-Lu4TjR35gBPB3_W-qXBknw&sa=X&ved=2ahUKEwigiezaiYb1AhXHZt4KHVALAaYQ9QF6BAgEEAE#imgrc=yz0b8ezNeuhH6M"} alt =${title}>
       <div class="movie-info">
       <h1>${title}</h1>
       <span class="${getColor(vote_average)}">${vote_average} </span>
       </div>
       
       <div class ="overview">
       <h1>Overview</h1>
       ${overview}
       </div>`

        main.appendChild(movieel);
    });


}


function getColor(vote) {
    if (vote >= 8) {
        return `green`
    }
    else if (vote >= 5) {
        return `orange`
    }

    else {
        return `red`;
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = search.value;
    selectedGenre = [];
    highlightSelection();
    console.log(searchTerm)
    if (searchTerm) {
        console.log(searchURL + '&query=' + searchTerm)
        getMovies(searchURL + '&query=' + searchTerm);
    }
})


next.addEventListener('click', () => {
    
    if (nextPage <= totalPages) {
        pageCall(nextPage);
    }
})

prev.addEventListener('click', () => {
    if (prevPage >= 0) {
        pageCall(prevPage);
    }
})

function pageCall(page) {
    let urlSplit = lastUrl.split('?');
    let queryParams = urlSplit[1].split('&');

    let key = queryParams[queryParams.length - 1].split('=');
    if (key[0] != 'page') {
        let url = lastUrl + '&page=' + page;
        getMovies(url);
    }
    else {
        key[1] = page.toString();
        let a = key.join('=');
        queryParams[queryParams.length - 1] = a;
        let b = queryParams.join('&');
        let url = urlSplit[0] + '?' + b;
        getMovies(url);
    }
}