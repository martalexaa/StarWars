let starWarsfilmRepo = (function () {

    const apiUrl = "https://swapi.dev/api/films/?format=json";
    let filmList = [];

    // Function to show loading message
    function showLoading() {
        document.getElementById('loading').style.display = 'block';
    }

    // Function to hide loading message
    function hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }

    //fetching the film data from URL
    async function fetchList() {
        try {
            showLoading();
            const response = await fetch(apiUrl);
            const json = await response.json();
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
            hideLoading();
        } catch (e) {
            console.error(e);
            hideLoading();
        }
    }

    // Fetch planet information
    async function fetchPlanetInfo(planetURL) {
        try {
            const response = await fetch(planetURL);
            return await response.json();
        } catch (e) {
            console.error(e);
        }
    }

    // Return the list of films
    function getAll() {
        return filmList;
    }

    // Sort films by episode 
    function sortByEpisode() {
        const sortedFilmList = [...filmList].sort((a, b) => {
            return a.episode - b.episode;
        });
        return sortedFilmList;
    }

    // Add item to the HTML list
    function addListItem(listData, list) {
        if (listData.length !== 0) {
            listData.forEach((film) => {
                let li = document.createElement('li');
                li.textContent = `${film.title} (episode: ${film.episode})`;
                list.appendChild(li);
            })
        }
    }

    // Add film titles and planets to the list
    function loadPlanetInfo(sortedFilmList, filmsWithPlanets) {
        sortedFilmList.forEach(function (film) {
            addListItem([film], filmsWithPlanets); // Pass an array with the current film
            appendPlanets(film, filmsWithPlanets);
        });
    }

    // Append planet list to each film
    function appendPlanets(film) {
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
    let sortedFilmList = starWarsfilmRepo.sortByEpisode();
    let filmUlList = document.querySelector('#filmList');
    let sortedFilmUlList = document.querySelector('#sortedFilmList');
    let filmsWithPlanets = document.querySelector('#filmsWithPlanets');

    // Get filmlist without sorting
    starWarsfilmRepo.addListItem(filmList, filmUlList);

    // Get filmlist after sorting
    starWarsfilmRepo.addListItem(sortedFilmList, sortedFilmUlList);

    // Load information about each planet from the sorted filmlist
    starWarsfilmRepo.loadPlanetInfo(sortedFilmList, filmsWithPlanets);
});

