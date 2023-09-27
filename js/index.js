let starWarsfilmRepo = (function () {

    const apiUrl = "https://swapi.dev/api/films/?format=json";
    let filmList = [];



    //fetching the film data from URL
    function fetchList() {
        return fetch(apiUrl).then(function (response) {
            return response.json();
        }).then(function (json) {
            // Clear the existing filmList before populating it
            filmList = [];
            json.results.forEach(function (item) {
                let film = {
                    title: item.title,
                    episode: item.episode_id,
                    planets: item.planets
                };
                filmList.push(film);
            });
        }).catch(function (e) {
            console.error(e);
        })
    }

    //fetch planet information
    function fetchPlanetInfo(planetURL) {
        return fetch(planetURL).then(function (response) {
            return response.json();
        })
    }

    //return the list of films
    function getAll() {
        return filmList;
    }

    //sort films by episode 
    function sortByEpisode() {
        const sortedFilmList = [...filmList].sort((a, b) => {
            return a.episode - b.episode;
        });
        return sortedFilmList;
    }

    function addListItem(listData, list) {
        if (listData.length !== 0) {
            listData.forEach((film) => {
                let li = document.createElement('li');
                li.textContent = `${film.title} (episode: ${film.episode})`;
                list.appendChild(li);
            })
        }
    }

    //add film titles and planet names to the third list
    function loadPlanetInfo(film) {
        let filmsWithPlanets = document.querySelector('#filmsWithPlanets');

        const li = document.createElement('li');
        li.textContent = `${film.title} (episode: ${film.episode})`;
        filmsWithPlanets.appendChild(li);

        let planetList = document.createElement('ul');

        film.planets.forEach(function (planetURL) {
            fetchPlanetInfo(planetURL).then(function (planetData) {
                const liPlanet = document.createElement('li');
                liPlanet.textContent = planetData.name;
                planetList.appendChild(liPlanet);
            });
        });
        filmsWithPlanets.appendChild(planetList);
    }


    return {
        fetchList,
        getAll,
        addListItem,
        sortByEpisode,
        fetchPlanetInfo,
        loadPlanetInfo
    };
})();


starWarsfilmRepo.fetchList().then(function () {
    const filmList = starWarsfilmRepo.getAll();
    const sortedFilmList = starWarsfilmRepo.sortByEpisode();
    let filmUlList = document.querySelector('#filmList');
    let sortedFilmUlList = document.querySelector('#sortedFilmList');

    // Get filmlist without sorting
    starWarsfilmRepo.addListItem(filmList, filmUlList);

    // Get filmlist after sorting
    starWarsfilmRepo.addListItem(sortedFilmList, sortedFilmUlList);

    // Load information about each planet from the sorted filmlist
    sortedFilmList.forEach(function (film) {
        starWarsfilmRepo.loadPlanetInfo(film);
    });
});

