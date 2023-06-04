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


$(document).ready(function (){
    var userInput = cityList[cityList.length - 1];
    renderSearch();
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

function currentWeather (userInput) {
    mainIcon.empty();
    var fore5 = $("<h2>").attr("class", "forecast").text("Today's weather: "); 
    var forecastURL = url + userInput + "&units=metric&APPID=" + WEATHER_API_KEY;
    $.ajax({
        url: forecastURL,
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
        tempResultText.text("Temperature: " + temp + " ºC");
        humidityResult.text("Humidity: " + humidity + " %");
        windResultText.text("Wind Speed: " + wind + " MPH");
        $('.this').attr("style", "display: flex; width: 98%");   
      })
        }

function foreCast(userInput){
    rowCards.empty();
    // var fore5 = $("<h2>").attr("class", "forecast").text("5-Day Forecast: "); 
    var forecastURL1 = foreCastURL + userInput + "&units=metric&APPID=" + WEATHER_API_KEY;
    $.ajax({
        url: forecastURL1,
        method: "GET"
    }).then(response => {
        for (let i =7; i< response.list.length; i+= 8){
        var newCol2 = $("<div>").attr("class", "col-2");
        rowCards.append(newCol2);
        var newDivCard = $("<div>").attr("class", "card  text-white bg-primary mb-2");
        newDivCard.attr("style", "max-width: 30rem;")
        newCol2.append(newDivCard);
        var newCardBody = $("<div>").attr("class", "card-body");
        newDivCard.append(newCardBody);
        var date = $("<h4>").text(response.list[i].dt_txt)
        var reformatDate = dayjs(response.list[i].dt_txt).format('DD/MM/YYYY');
        newCardBody.append(reformatDate)
        var temp = $("<p>").text("Temp: " + (response.list[i].main.temp)  + " ºC")
        newCardBody.append(temp)
        var wind = $("<p>").text("Wind Speed: " + response.list[i].wind.speed + " MPH")
        newCardBody.append(wind)
        var humidity = $("<p>").text("Humidity: " + response.list[i].main.humidity  + " %")
        newCardBody.append(humidity)
        }
      })
}

 function  saveSearch(Input){
    // cityList.push(Input);
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
  }

  function renderSearch(){
    buttonArray.empty()
    for (var i = 0; i < cityList.length; i ++) {
        var newButton = $('<button>').attr("type", "button").attr("class","savedBtn btn btn-secondary btn-lg btn-block");
        newButton.attr("data-name",  cityList[i])

        newButton.text( cityList[i]);
        buttonArray.prepend(newButton);
    }
    $(".savedBtn").on("click", function (event){
        event.preventDefault();
        $('#rowcards').empty();
        var Input = $(this).data('name');
        currentWeather(Input);
        foreCast(Input);
        renderSearch();
       
    });
  }

