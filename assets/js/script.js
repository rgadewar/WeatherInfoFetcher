var WEATHER_API_KEY = "1670204c5a924ce630949733d048f494";
var url = "https://api.openweathermap.org/data/2.5/weather?q="
var foreCastURL = "https://api.openweathermap.org/data/2.5/forecast?q="
var cityResultText = $("#cityResult");
var tempResultText = $("#tempResult");
var windResultText = $("#windResult")
var humidityResult = $("#humidityResult");
var buttonArray = $("#buttonsArray");
var rowCards = $("#rowCards");
var mainIcon =$("#mainIcon");
var cityList = JSON.parse(localStorage.getItem("currentCity")) || [];
var today = dayjs().format('MMM D, YYYY');
var forecastImage = {};


$(document).ready(function (){
    var userInput = cityList[cityList.length - 1];
    renderSearch();
    getCoordinates(userInput);
    currentWeather(userInput);
    foreCast(userInput);  
});

$(".btn").on("click", function (event){
    event.preventDefault();

    var Input = $("#searchInput").val().trim().toLowerCase();
    console.log(Input);

    if (Input == ""){
        alert("Please enter city name")
        return;
    }
    $("#searchInput").val("");
    currentWeather(Input);
    foreCast(Input);
    renderSearch();
});

function getCoordinates(userInput){
    var forecastURL = url + userInput + "&units=imperial&APPID=" + WEATHER_API_KEY; 
    $.ajax({
        url: forecastURL,
        method: "GET"
    }).then(response => {
        // console.log(response)
        var longitude = response.coord.lon;
        console.log("Get Coordinates longitude: " + longitude)
        var latitude = response.coord.lat;
        console.log("Get Coordinates latitude: " + latitude)
        localStorage.setItem("longitude", JSON.stringify(longitude));
        localStorage.setItem("latitude", JSON.stringify(latitude));
    })

}

function currentWeather (userInput) {
    mainIcon.empty();
    var fore5 = $("<h2>").attr("class", "forecast").text("Today's weather: "); 
    var currentURL = url + userInput + "&units=imperial&APPID=" + WEATHER_API_KEY;
    // var forecastURL = "http://api.openweathermap.org/geo/1.0/reverse?lat=51.5098&lon=-0.1180&limit=5&appid=1670204c5a924ce630949733d048f494";
    console.log(currentURL)
    $.ajax({
        url: currentURL,
        method: "GET"
    }).then(response => {
        console.log(response)
        saveSearch(response.name);
        var city = response.name;
        var icon = response.weather[0].icon;
        var newImgMain = $("<img>").attr("class", "card-img-top").attr("src", "https://openweathermap.org/img/wn/" + icon + "@2x.png");
        mainIcon.append(newImgMain);
        var temp = response.main.temp;
        var humidity = response.main.humidity;
        var wind = response.wind.speed;
        var icon = response.weather[0].icon;
        cityResultText.text(city + " ("  + today + ")");
        tempResultText.text("Temperature: " + temp + " ºF");
        humidityResult.text("Humidity: " + humidity + " %");
        windResultText.text("Wind Speed: " + wind + " MPH");
        $('.this').attr("style", "display: flex; width: 98%");   
      })
        }

function foreCast(userInput){
    rowCards.empty();
    var forecastURL1 = foreCastURL + userInput + "&units=imperial&APPID=" + WEATHER_API_KEY;
    var currentURL = url + userInput + "&units=imperial&APPID=" + WEATHER_API_KEY;
    console.log(currentURL)
    $.ajax({
        url: currentURL,
        method: "GET"
    }).then(response => {
        console.log(response)
        saveSearch(response.name);
        var city = response.name;
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        console.log("Forcast longitude: " + lon)
        console.log("Forcast longitude: " + lat)
        var forecastURL = foreCastURL + lat + "&lon=" + lon + "&limit=5&appid=" + WEATHER_API_KEY;
        console.log("Forcast URL" + forecastURL);
        $.ajax({
            url: forecastURL1,
            method: "GET"
        }).then(response => {
            for (let i =7; i< response.list.length; i+= 8){
            console.log(response)
            forecastImage[i] = response.list[i].weather[0].icon;


            var newCol2 = $("<div>").attr("class", "col-lg-2 col-sm-12");
            rowCards.append(newCol2);
            var newDivCard = $("<div>").attr("class", "card  text-white bg-primary mb-3");
            newDivCard.attr("style", "max-width: 30rem;")
            newCol2.append(newDivCard);

            var newCardBody1 = $("<div>").attr("class", "card-header bg-secondary");
            newDivCard.append(newCardBody1);
            var date = $("<h4>").text(response.list[i].dt_txt)
            var reformatDate = dayjs(response.list[i].dt_txt).format('DD/MM/YYYY');
            newCardBody1.append(reformatDate)

            var newCardBody = $("<div>").attr("class", "card-body");
            newDivCard.append(newCardBody);
            // var date = $("<h4>").text(response.list[i].dt_txt)
            // var reformatDate = dayjs(response.list[i].dt_txt).format('DD/MM/YYYY');
            // newCardBody.append(reformatDate)
            
            var newImg = $("<img>").attr("class", "card-img-top").attr("src", "https://openweathermap.org/img/wn/" + forecastImage[i] + "@2x.png");
            newCardBody.append(newImg);
            
            var temp = $("<p>").text("Temp: " + (response.list[i].main.temp)  + " ºF")
            newCardBody.append(temp)
            var wind = $("<p>").text("Wind Speed: " + response.list[i].wind.speed + " MPH")
            newCardBody.append(wind)
            var humidity = $("<p>").text("Humidity: " + response.list[i].main.humidity  + " %")
            newCardBody.append(humidity)
            }
        })
    })
    }

 function  saveSearch(Input){
    var foundCity = false;
    if (cityList != null) {
		$(cityList).each(function(x) {
			if (cityList[x] === Input) {
				foundCity = true;
			}
		});
	}
	if (foundCity === false) {
        cityList.push(Input);
	}
    localStorage.setItem("currentCity", JSON.stringify(cityList));
    renderSearch();
  }

  function renderSearch(){
    buttonArray.empty()
    for (var i = 0; i < cityList.length; i ++) {
        var newButton = $('<button>').attr("type", "button").attr("class"," col-lg-12 col-sm-12 savedBtn btn btn-secondary btn-lg btn-block");
        newButton.attr("data-name",  cityList[i])

        newButton.text( cityList[i]);
        buttonArray.prepend(newButton);
    }
    $(".savedBtn").on("click", function (event){
        event.preventDefault();
        $('#rowcards').empty();
        var Input = $(this).data('name');
        getCoordinates(Input);
        currentWeather(Input);
        foreCast(Input);
        renderSearch();     
    });
  }

