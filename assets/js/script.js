// OpenWeatherMap API Key
var WEATHER_API_KEY = "1670204c5a924ce630949733d048f494";

// API URLs for current weather and forecast
var url = "https://api.openweathermap.org/data/2.5/weather?q=";
var foreCastURL = "https://api.openweathermap.org/data/2.5/forecast?q=";

// HTML elements
var cityResultText = $("#cityResult");
var tempResultText = $("#tempResult");
var windResultText = $("#windResult");
var humidityResult = $("#humidityResult");
var buttonArray = $("#buttonsArray");
var rowCards = $("#rowCards");
var mainIcon =$("#mainIcon");

// Local storage for the list of searched cities
var cityList = JSON.parse(localStorage.getItem("currentCity")) || [];

// Get the current date
var today = dayjs().format('MMM D, YYYY');

// Object to store forecast weather icons
var forecastImage = {};

// Document ready function to execute when the DOM is ready
$(document).ready(function (){

    // Get the last searched city from the list
    var userInput = cityList[cityList.length - 1];

    // Render the search history buttons
    renderSearch();

    // Get the coordinates of the last searched city
    getCoordinates(userInput);

    // Fetch and display the current weather for the last searched city
    currentWeather(userInput);

    // Fetch and display the forecast for the last searched city
    foreCast(userInput);  
});

// Event handler for the search button
$(".btn").on("click", function (event){
    event.preventDefault();

    // Get the user's input from the search input field
    var Input = $("#searchInput").val().trim().toLowerCase();
    console.log(Input);

    // Check if the user has entered a city name
    if (Input == ""){
        alert("Please enter a city name");
        return;
    }

    // Clear the search input field
    $("#searchInput").val("");

    // Fetch and display the current weather for the entered city
    currentWeather(Input);

    // Fetch and display the forecast for the entered city
    foreCast(Input);

    // Render the updated search history buttons
    renderSearch();
});

// Function to get the coordinates (latitude and longitude) of a city
function getCoordinates(userInput){
    var forecastURL = url + userInput + "&units=imperial&APPID=" + WEATHER_API_KEY; 
    $.ajax({
        url: forecastURL,
        method: "GET"
    }).then(response => {
        var longitude = response.coord.lon;
        console.log("Get Coordinates longitude: " + longitude)
        var latitude = response.coord.lat;
        console.log("Get Coordinates latitude: " + latitude)
        localStorage.setItem("longitude", JSON.stringify(longitude));
        localStorage.setItem("latitude", JSON.stringify(latitude));
    })
}

// Function to fetch and display the current weather for a city
function currentWeather (userInput) {
    // Clear the main weather icon container
    mainIcon.empty();

    // Create a header element for the current weather forecast
    var fore5 = $("<h2>").attr("class", "forecast").text("Today's weather: "); 

    // API URL for the current weather of the city
    var currentURL = url + userInput + "&units=imperial&APPID=" + WEATHER_API_KEY;
    console.log(currentURL);

    // Fetch the current weather data using AJAX
    $.ajax({
        url: currentURL,
        method: "GET"
    }).then(response => {
        console.log(response);

        // Save the searched city to the local storage
        saveSearch(response.name);

        // Extract relevant weather data from the API response
        var city = response.name;
        var icon = response.weather[0].icon;
        var newImgMain = $("<img>").attr("class", "card-img-top").attr("src", "https://openweathermap.org/img/wn/" + icon + "@2x.png");
        mainIcon.append(newImgMain);
        var temp = response.main.temp;
        var humidity = response.main.humidity;
        var wind = response.wind.speed;

        // Update the HTML elements with the current weather information
        cityResultText.text(city + " ("  + today + ")");
        tempResultText.text("Temperature: " + temp + " ºF");
        humidityResult.text("Humidity: " + humidity + " %");
        windResultText.text("Wind Speed: " + wind + " MPH");

        // Display the main weather icon
        $('.this').attr("style", "display: flex; width: 98%;");   
    });
}

// Function to fetch and display the weather forecast for a city
function foreCast(userInput){
    // Clear the forecast cards container
    rowCards.empty();

    // API URLs for the current weather and forecast of the city
    var forecastURL1 = foreCastURL + userInput + "&units=imperial&APPID=" + WEATHER_API_KEY;
    var currentURL = url + userInput + "&units=imperial&APPID=" + WEATHER_API_KEY;
    console.log(currentURL);

    // Fetch the current weather data using AJAX
    $.ajax({
        url: currentURL,
        method: "GET"
    }).then(response => {
        console.log(response);

        // Save the searched city to the local storage
        saveSearch(response.name);

        // Extract latitude and longitude of the city from the API response
        var city = response.name;
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        console.log("Forcast longitude: " + lon)
        console.log("Forcast longitude: " + lat)

        // API URL for the forecast of the city
        var forecastURL = foreCastURL + lat + "&lon=" + lon + "&limit=5&appid=" + WEATHER_API_KEY;
        console.log("Forcast URL" + forecastURL);

        // Fetch the forecast data using AJAX
        $.ajax({
            url: forecastURL1,
            method: "GET"
        }).then(response => {
            for (let i =7; i< response.list.length; i+= 8){
                console.log(response);
                forecastImage[i] = response.list[i].weather[0].icon;

                // Create card elements to display forecast information
                var newCol2 = $("<div>").attr("class", "col-lg-2 col-sm-12");
                rowCards.append(newCol2);
                var newDivCard = $("<div>").attr("class", "card text-white bg-primary mb-3");
                newDivCard.attr("style", "max-width: 30rem;");
                newCol2.append(newDivCard);

                var newCardBody1 = $("<div>").attr("class", "card-header bg-secondary");
                newDivCard.append(newCardBody1);
                var date = $("<h4>").text(response.list[i].dt_txt);
                var reformatDate = dayjs(response.list[i].dt_txt).format('DD/MM/YYYY');
                newCardBody1.append(reformatDate);

                var newCardBody = $("<div>").attr("class", "card-body");
                newDivCard.append(newCardBody);

                var newImg = $("<img>").attr("class", "card-img-top").attr("src", "https://openweathermap.org/img/wn/" + forecastImage[i] + "@2x.png");
                newCardBody.append(newImg);

                var temp = $("<p>").text("Temp: " + (response.list[i].main.temp)  + " ºF");
                newCardBody.append(temp);
                var wind = $("<p>").text("Wind Speed: " + response.list[i].wind.speed + " MPH");
                newCardBody.append(wind);
                var humidity = $("<p>").text("Humidity: " + response.list[i].main.humidity  + " %");
                newCardBody.append(humidity);
            }
        });
    });
}

// Function to save the user's search history in local storage
function saveSearch(Input){
    var foundCity = false;

    // Check if the city is already in the search history list
    if (cityList != null) {
        $(cityList).each(function(x) {
            if (cityList[x] === Input) {
                foundCity = true;
            }
        });
    }

    // If the city is not found in the list, add it to the list
    if (foundCity === false) {
        cityList.push(Input);
    }

    // Save the updated search history list to local storage
    localStorage.setItem("currentCity", JSON.stringify(cityList));

    // Render the updated search history buttons
    renderSearch();
}

// Function to render the search history as buttons
function renderSearch(){
    // Clear the search history buttons container
    buttonArray.empty();

    // Iterate through the list of cities and create buttons for each
    for (var i = 0; i < cityList.length; i ++) {
        var newButton = $('<button>').attr("type", "button").attr("class"," col-lg-12 col-sm-12 savedBtn btn btn-secondary btn-lg btn-block");
        newButton.attr("data-name",  cityList[i]);

        newButton.text(cityList[i]);
        buttonArray.prepend(newButton);
    }

    // Event handler for the saved city buttons
    $(".savedBtn").on("click", function (event){
        event.preventDefault();

        // Clear the forecast cards container
        $('#rowcards').empty();

        // Get the city name from the button's data attribute
        var Input = $(this).data('name');

        // Get the coordinates of the selected city
        getCoordinates(Input);

        // Fetch and display the current weather for the selected city
        currentWeather(Input);

        // Fetch and display the forecast for the selected city
        foreCast(Input);

        // Render the updated search history buttons
        renderSearch();     
    });
}
