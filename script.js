
if (!apiKey) {
  console.warn('No API key in client. Requests will fail. Use a server proxy or ask me to create one.');
}
const searchBtn = document.getElementById("searchBtn");
const displayContent = document.getElementById("displayContent");
const hourlyGrid = document.getElementById("hourlyGrid");
const dailyList = document.getElementById("dailyList");
const now = new Date();
const hours = now.getHours();
 const minutes = now.getMinutes();
const seconds = now.getSeconds();
window.addEventListener("load",()=>{
    if (navigator.geolocation){
        console.log(navigator.geolocation)
        navigator.geolocation.getCurrentPosition(
            position =>{
                const lat =position.coords.latitude
                const lon = position.coords.longitude
                console.log(lat)
                console.log(lon)
                getWeatherByLocation(lat,lon)
                getWeatherByHour(lat,lon)
             
                

            }
        )
        
        


    }else{

    }
})

searchBtn.addEventListener("click", () => {
  const city = document.getElementById("cityInput").value.trim();
  if (city) {
    getWeatherByCity(city);
  } else {
    alert("Please enter a city name.");
  }
});
async function getWeatherByCity(city){
const url=`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
 getWeather(url)   


}
async function getWeatherByLocation(lat,lon){
    const url=`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    getWeather(url)
    
}
async function getWeatherByHour(lat,lon){
    const url=`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    getWeather(url)
}

    


async function  getWeather(url){
    try{
        const response = await fetch(url)
        if(!response.ok)
            console.log(error)
        else{
            const data =await response.json();
            console.log(data)
        
            if (data.list) {
                displayHourlyForecast(data)
                displayDailyForecast(data)
            } else {
                displayWeather(data)
            }
        }
    }catch(error){

    }
    
   
}


// current forecast
function displayWeather(data){
    const {name }=data;
    const {icon,description}=data.weather[0]
    const {deg,speed}= data.wind
    const {temp,humidity,feels_like}=data.main
    const {country}=data.sys
    const {dt_txt} =data.weather[0]

    displayContent.innerHTML=`
    <div class="current">  
    <div>
    <h3>${name}</h3>
    <p>${hours}:${minutes}</p>
    <p>${description}</p>
    </div>
    <div class="now">
    <h2><img src="https://openweathermap.org/img/wn/${icon}.png" alt="" style=""> ${temp}</h2>
    </div>

    <div>
    <p>feels like: ${feels_like}</p>
    <p>wind: ${speed} mph</p>
    <p>humidity: ${humidity}</p>
    <p></p>
    </div>
    </div>
    <br><br>
    `
}
function displayHourlyForecast(data) {
 
  data.list.slice(0, 5).forEach((item) => {
    const { icon, description } = item.weather[0];
    const { temp } = item.main;
    const time = new Date(item.dt * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    hourlyGrid.innerHTML += `
      <div class="hourly">
        <p>${time}</p>
        <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${description}">
        <p>${temp.toFixed(1)}°C</p>
      </div>
    `;
  });

  
}
 function displayDailyForecast(data) {
  dailyList.innerHTML = "";
  const dailyData = [];

  // Group by day
  data.list.forEach((item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    if (!dailyData[date]) dailyData[date] = [];
    dailyData[date].push(item);
  });

  const days = Object.keys(dailyData).slice(0, 7);
  days.forEach((day) => {
    const temps = dailyData[day].map((i) => i.main.temp);
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);
    const icon = dailyData[day][0].weather[0].icon;
    const desc = dailyData[day][0].weather[0].description;

    dailyList.innerHTML += `
      <div class="daily">
        <span>${new Date(day).toLocaleDateString("en", {
          weekday: "short",
        })}</span>
        <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${desc}">
        <span>${minTemp.toFixed(1)}°C<input type="range" id="temperature" name="temperature" min=" ${minTemp.toFixed(1)}" max="${maxTemp}">${maxTemp}°C</span>
      </div>
    `;
  });
}




