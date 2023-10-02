$(document).ready(function() {
    // Check if localStorage has movie data, and initialize if not
    if (!localStorage.getItem('movies')) {
        localStorage.setItem('movies', JSON.stringify([]));
    }

    // Function to retrieve movies from localStorage
    function getMovies() {
        return JSON.parse(localStorage.getItem('movies'));
    }

    // Function to save movies to localStorage
    function saveMovies(movies) {
        localStorage.setItem('movies', JSON.stringify(movies));
    }

    // Function to display movies in the list
    function displayMovies() {
        const movies = getMovies();
        const movieList = $('#movie-list');
        movieList.empty();
	movieList.append(drawHTableHeaders());
        movies.forEach(function(movie, index) {
            movieList.append(`
                <tr>
                    <td class="movie-index">${index + 1}</td>
                    <td class="movie-title">${movie.title}</td>
                    <td class="movie-director">${movie.director}</td>
                    <td class="movie-year">${movie.year}</td>
                    <td><button class="edit-movie" data-index="${index}">Edit</button></td>
                    <td><button class="delete-movie" data-index="${index}">Delete</button></td>
		    <td><button class="view-movie" data-index="${index}">View</button></td>
                </tr>
            `);
        });
		console.log(movies);
    }

    // Display movies on page load
    displayMovies();

    // Add movie to localStorage
    $('#movie-form').submit(function(event) {
        event.preventDefault();
        const title = $('#title').val();
        const director = $('#director').val();
        const year = $('#year').val();
        const movies = getMovies();
        movies.push({ title, director, year });
        saveMovies(movies);
        $('#title').val('');
        $('#director').val('');
        $('#year').val('');
        displayMovies();
    });

    // Delete movie from localStorage
    $('#movie-list').on('click', '.delete-movie', function() {
        const index = $(this).data('index');
        const movies = getMovies();
        movies.splice(index, 1);
        saveMovies(movies);
        displayMovies();
    });

    // Edit movie in localStorage
    $('#movie-list').on('click', '.edit-movie', function() {
        const index = $(this).data('index');
        const movies = getMovies();
        const movie = movies[index];
        const newTitle = prompt('Enter a new title:', movie.title);
        const newDirector = prompt('Enter a new director:', movie.director);
        const newYear = prompt('Enter a new year:', movie.year);
        movies[index] = {
            title: newTitle,
            director: newDirector,
            year: newYear,
        };
        saveMovies(movies);
        displayMovies();
    });

    // Search functionality
    $('#search').on('input', function() {
        const searchValue = $(this).val().toLowerCase();
        const movies = getMovies();
        const filteredMovies = movies.filter(function(movie) {
            return movie.title.toLowerCase().includes(searchValue) ||
                movie.director.toLowerCase().includes(searchValue) ||
                movie.year.toString().includes(searchValue);
        });
        displayFilteredMovies(filteredMovies);
    });
	
	$('#movie-list').on('click', '.view-movie', function() {
        const index = $(this).data('index');
        const movies = getMovies();
        const movie = movies[index];
        const message = `Title: ${movie.title}\nDirector: ${movie.director}\nYear: ${movie.year}`;
        alert(message);
    });
	
	
	$('#export-csv').click(function() {
        const movies = getMovies();

        if (movies.length === 0) {
            alert('No data to export.');
            return;
        }

        let csvContent = 'data:text/csv;charset=utf-8,';

        // Create the CSV header
        const header = ['Title', 'Director', 'Year'].join(',');
        csvContent += header + '\r\n';

        // Add movie data to the CSV
        movies.forEach(function(movie) {
            const row = [movie.title, movie.director, movie.year].join(',');
            csvContent += row + '\r\n';
        });

        // Create a hidden link to trigger the download
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'movies.csv');
        document.body.appendChild(link);

        // Trigger the download
        link.click();
    });

    // Function to display filtered movies
    function displayFilteredMovies(filteredMovies) {
        const movieList = $('#movie-list');
        movieList.empty();
	movieList.append(drawHTableHeaders());
        filteredMovies.forEach(function(movie, index) {
            movieList.append(`
                <tr>
                    <td class="movie-index">${index + 1}</td>
                    <td class="movie-title">${movie.title}</td>
                    <td class="movie-director">${movie.director}</td>
                    <td class="movie-year">${movie.year}</td>
                    <td><button class="edit-movie" data-index="${index}">Edit</button></td>
                    <td><button class="delete-movie" data-index="${index}">Delete</button></td>
	            <td><button class="view-movie" data-index="${index}">View</button></td>
                </tr>
            `);
        });
		
		console.log(filteredMovies);
    }
	
	
	$('#load-csv').submit(function(event) {
        event.preventDefault();
        const fileInput = document.getElementById('csv-file');
        const file = fileInput.files[0];

        if (!file) {
            alert('Please select a CSV file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const csvData = e.target.result;
            const movies = parseCSV(csvData);

            if (movies.length === 0) {
                alert('No valid movie data found in the CSV file.');
                return;
            }

            const existingMovies = getMovies();
            const updatedMovies = [...existingMovies, ...movies];
            saveMovies(updatedMovies);
            alert(`Loaded ${movies.length} movies from the CSV file.`);
            displayMovies();
        };

        reader.readAsText(file);
    });
	
	// Function to parse CSV data into an array of objects
    function parseCSV(csvData) {
        const lines = csvData.split('\n');
        const movies = [];
        for (let i = 1; i < lines.length; i++) { // Start from 1 to skip header
            const fields = lines[i].split(',');
            if (fields.length === 3) {
                const [title, director, year] = fields.map(field => field.trim());
                if (title && director && year) {
                    movies.push({ title, director, year });
                }
            }
        }
        return movies;
    }

   function drawHTableHeaders(){
	   
	   var tableHeaders = "<tr>";
	   tableHeaders += "<th>Index</th>";
	   tableHeaders += "<th>Title</th>";
	   tableHeaders += "<th>Director</th>";
	   tableHeaders += "<th>Year</th>";
	   tableHeaders += "<th></th>";
	   tableHeaders += "<th></th>";
	   tableHeaders += "<th></th>";
	   tableHeaders += "</tr>";

	   return tableHeaders;
   }
	
	
});
