let starWarsfilmRepo = (function () {

    const apiUrl = "https://swapi.dev/api/films/?format=json";
    const filmList = [];



    //fetching the film data from URL
    function loadList() {
        return fetch(apiUrl).then(function (response) {
            return response.json();
        }).then(function (json) {
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

    //return the list of films
    function getAll() {
        console.log("Not sorted filmlist", filmList);
        return filmList;
    }

    //add film titles to the HTML list <ul>
    function addListItem(film) {
        let ulList = document.querySelector('#filmList');
        let li = document.createElement('li');
        li.textContent = film.title;
        ulList.appendChild(li);
    }

    //sort films by episode 
    function sortByEpisode() {
        const sortedFilmList = [...filmList].sort((a, b) => {
            return a.episode - b.episode;
        });
        console.log("Sorted Film List:", sortedFilmList);
        return sortedFilmList;
    }

    //print a sorted list of films in HTML
    function addSortedListItem(film) {
        let ulList = document.querySelector('#sortedFilmList');
        let li = document.createElement('li');
        li.textContent = `${film.title} (episode: ${film.episode})`;
        ulList.appendChild(li);
    }



    function getPlanetURL(film) {
        console.log(film.planets)
        return film.planets;
    }


    function fetchPlanetInfo(planetURL) {
        return fetch(planetURL).then(function (response) {
            return response.json();
        })
    }


    function loadPlanetInfo(film, planetURL) {

        let ulList = document.querySelector('#filmsWithPlanets');

        filmList.forEach(function (film) {
            let planetURLs = getPlanetURL(film);
            let planetList = document.createElement('ul');

            planetURLs.forEach(function (planetURL) {
                fetchPlanetInfo(planetURL).then(function (planetData) {
                    // Create a list item for each planet and add it to the planetList
                    const liPlanet = document.createElement('li');
                    liPlanet.textContent = planetData.name;
                    planetList.appendChild(liPlanet);
                }).catch(function (e) {
                    console.error(e)
                })
            });

            // Create a list item for the film and its planets
            const li = document.createElement('li');
            li.textContent = `${film.title} (episode: ${film.episode})`;

            ulList.appendChild(li);
            ulList.appendChild(planetList);
        })
    }




    return {
        loadList: loadList,
        getAll: getAll,
        addListItem: addListItem,
        sortByEpisode: sortByEpisode,
        addSortedListItem: addSortedListItem,
        getPlanetURLs: getPlanetURL,
        fetchPlanetInfo: fetchPlanetInfo,
        loadPlanetInfo: loadPlanetInfo

    }

})();


starWarsfilmRepo.loadList().then(function () {
    const sortedFilmList = starWarsfilmRepo.sortByEpisode(); // Sort the film list by episode

    starWarsfilmRepo.getAll().forEach(function (film) {
        starWarsfilmRepo.addListItem(film);
    });

    sortedFilmList.forEach(function (film) {
        starWarsfilmRepo.addSortedListItem(film); // Add films to the sorted list
    });

    sortedFilmList.forEach(function (film) {
        starWarsfilmRepo.getPlanetURLs(film);
        starWarsfilmRepo.loadPlanetInfo();
    });
});
