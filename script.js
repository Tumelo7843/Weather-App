// 🔐 ADD YOUR API KEY HERE
// import apikey from env file in server.js, so we keep it hidden from client-side code

const apiKey = "";

const searchBtn = document.getElementById("searchBtn");
const displayContent = document.getElementById("displayContent");
const hourlyGrid = document.getElementById("hourlyGrid");
const dailyList = document.getElementById("dailyList");

// ================================
// AUTO LOAD WEATHER USING LOCATION
// ================================
window.addEventListener("load", function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        getWeatherData(lat, lon);
      },
      function () {
        alert("Location access denied. Please search manually.");
      }
    );
  }
});

// ================================
// SEARCH BY CITY
// ================================
searchBtn.addEventListener("click", function () {
  const city = document.getElementById("cityInput").value.trim();
  if (city !== "") {
    getWeatherByCity(city);
  } else {
    alert("Please enter a city name.");
  }
});

async function getWeatherByCity(city) {
  try {
    // First get coordinates from city name
    const geoUrl =
      "https://api.openweathermap.org/geo/1.0/direct?q=" +
      city +
      "&limit=1&appid=" +
      apiKey;

    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();

    if (geoData.length === 0) {
      alert("City not found.");
      return;
    }

    const lat = geoData[0].lat;
    const lon = geoData[0].lon;

    getWeatherData(lat, lon);
  } catch (error) {
    console.log("City fetch error:", error);
  }
}

// ================================
// GET CURRENT + FORECAST DATA
// ================================
async function getWeatherData(lat, lon) {
  try {
    // Current weather
    const currentUrl =
      "https://api.openweathermap.org/data/2.5/weather?lat=" +
      lat +
      "&lon=" +
      lon +
      "&units=metric&appid=" +
      apiKey;

    const currentResponse = await fetch(currentUrl);
    const currentData = await currentResponse.json();

    // Forecast (3-hour intervals for 5 days)
    const forecastUrl =
      "https://api.openweathermap.org/data/2.5/forecast?lat=" +
      lat +
      "&lon=" +
      lon +
      "&units=metric&appid=" +
      apiKey;

    const forecastResponse = await fetch(forecastUrl);
    const forecastData = await forecastResponse.json();

    displayCurrentWeather(currentData);
    displayHourlyForecast(forecastData);
    displayDailyForecast(forecastData);
  } catch (error) {
    console.log("Weather fetch error:", error);
  }
}

// ================================
// DISPLAY CURRENT WEATHER
// ================================
function displayCurrentWeather(data) {
  const name = data.name;
  const country = data.sys.country;
  const description = data.weather[0].description;
  const icon = data.weather[0].icon;
  const temp = data.main.temp;
  const feels = data.main.feels_like;
  const humidity = data.main.humidity;
  const wind = data.wind.speed;

  displayContent.innerHTML =
    '<div class="current">' +
    "<div>" +
    "<h2>" +
    name +
    ", " +
    country +
    "</h2>" +
    "<p>" +
    description +
    "</p>" +
    "<p>Feels like: " +
    feels +
    "°C</p>" +
    "<p>Humidity: " +
    humidity +
    "%</p>" +
    "<p>Wind: " +
    wind +
    " m/s</p>" +
    "</div>" +
    "<div>" +
    '<img src="https://openweathermap.org/img/wn/' +
    icon +
    '@2x.png">' +
    "<h2>" +
    temp.toFixed(1) +
    "°C</h2>" +
    "</div>" +
    "</div>";
}

// ================================
// DISPLAY NEXT 5 HOURS
// ================================
function displayHourlyForecast(data) {
  hourlyGrid.innerHTML = ""; // clear old data

  const nextFive = data.list.slice(0, 5);

  for (let i = 0; i < nextFive.length; i++) {
    const item = nextFive[i];
    const time = new Date(item.dt * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const icon = item.weather[0].icon;
    const temp = item.main.temp;

    hourlyGrid.innerHTML +=
      '<div class="hourly">' +
      "<p>" +
      time +
      "</p>" +
      '<img src="https://openweathermap.org/img/wn/' +
      icon +
      '.png">' +
      "<p>" +
      temp.toFixed(1) +
      "°C</p>" +
      "</div>";
  }
}

// ================================
// DISPLAY NEXT 5 DAYS
// ================================
function displayDailyForecast(data) {
  dailyList.innerHTML = "";

  const groupedDays = {};

  // Group forecasts by day
  for (let i = 0; i < data.list.length; i++) {
    const item = data.list[i];
    const date = new Date(item.dt * 1000).toLocaleDateString();

    if (!groupedDays[date]) {
      groupedDays[date] = [];
    }

    groupedDays[date].push(item);
  }

  const days = Object.keys(groupedDays).slice(0, 5);

  for (let j = 0; j < days.length; j++) {
    const day = days[j];
    const dayData = groupedDays[day];

    let minTemp = dayData[0].main.temp;
    let maxTemp = dayData[0].main.temp;

    for (let k = 0; k < dayData.length; k++) {
      const temp = dayData[k].main.temp;
      if (temp < minTemp) minTemp = temp;
      if (temp > maxTemp) maxTemp = temp;
    }

    const icon = dayData[0].weather[0].icon;
    const weekday = new Date(day).toLocaleDateString("en-US", {
      weekday: "short",
    });

    dailyList.innerHTML +=
      '<div class="daily">' +
      "<span>" +
      weekday +
      "</span>" +
      '<img src="https://openweathermap.org/img/wn/' +
      icon +
      '.png">' +
      "<span>Min: " +
      minTemp.toFixed(1) +
      "°C</span>" +
      "<span>Max: " +
      maxTemp.toFixed(1) +
      "°C</span>" +
      "</div>";
  }
}
