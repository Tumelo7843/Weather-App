const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const displayContent = document.getElementById("displayContent");
const hourlyGrid = document.getElementById("hourlyGrid");
const dailyList = document.getElementById("dailyList");

// Fetch weather from your Render backend
async function getWeather(city) {
  try {
    const response = await fetch(`/weather?city=${city}`);

    if (!response.ok) {
      throw new Error("City not found");
    }

    const data = await response.json();

    displayCurrentWeather(data);
    displayHourlyForecast(data);
    displayDailyForecast(data);

  } catch (error) {
    displayContent.innerHTML = `<h2>${error.message}</h2>`;
    hourlyGrid.innerHTML = "";
    dailyList.innerHTML = "";
  }
}

// Display current weather
function displayCurrentWeather(data) {
  const current = data.list[0];

  displayContent.innerHTML = `
    <div class="current">
      <div>
        <h2>${data.city.name}</h2>
        <p>${current.weather[0].description}</p>
      </div>
      <div>
        <h2>${Math.round(current.main.temp)}°C</h2>
      </div>
      <div>
        <p>Humidity: ${current.main.humidity}%</p>
        <p>Wind: ${current.wind.speed} m/s</p>
      </div>
    </div>
  `;
}

// Display first 5 hourly forecasts
function displayHourlyForecast(data) {
  hourlyGrid.innerHTML = "";

  const hourlyData = data.list.slice(0, 5);

  hourlyData.forEach(item => {
    const date = new Date(item.dt * 1000);
    const hour = date.getHours();

    hourlyGrid.innerHTML += `
      <div class="hourly">
        <p>${hour}:00</p>
        <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" />
        <p>${Math.round(item.main.temp)}°C</p>
      </div>
    `;
  });
}

// Display 5-day forecast (one per day at 12:00)
function displayDailyForecast(data) {
  dailyList.innerHTML = "";

  const dailyData = data.list.filter(item =>
    item.dt_txt.includes("12:00:00")
  );

  dailyData.slice(0, 5).forEach(item => {
    const date = new Date(item.dt * 1000);
    const day = date.toLocaleDateString("en-US", { weekday: "long" });

    dailyList.innerHTML += `
      <div class="daily">
        <p>${day}</p>
        <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" />
        <p>${Math.round(item.main.temp)}°C</p>
      </div>
    `;
  });
}

// Search button click
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    getWeather(city);
  }
});

// Press Enter to search
cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});

// Load default city on page load
window.onload = () => {
  getWeather("Johannesburg");
};
