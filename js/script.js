import { API_KEY as apikey } from "./config.js";

const searchButton = document.querySelector(".search__button");
const city = document.querySelector(".city");
const country = document.querySelector(".country");
const temperature = document.querySelector(".tc");
const aqi = document.querySelector(".aqi");
const aqi__info = document.querySelector(".aqi__info");
const visibility = document.querySelector(".vis");
const visibility_info = document.querySelector(".vis__info");
const humidity = document.querySelector(".humidity__bar");
const humidInfo = document.querySelector(".humid__info");
const sunrise = document.querySelector(".dawn");
const sunset = document.querySelector(".dusk");
const windSpeed = document.querySelector(".wind__speed");
const windDir = document.querySelector(".direction");
const uvIndex = document.querySelector(".index");
const weatherNowIcon = document.querySelector(".w_now");

const currWeather = document.querySelector(".weather__curr");
const currWeatherDate = document.querySelector(".weather__curr-date");
const rainChances = document.querySelector(".rain__per");

//functions

function rotateWindIcon(degrees) {
  const icon = document.querySelector(".compass");
  icon.style.transform = `rotate(${degrees}deg)`;
}

const getHumidInfo = function (val) {
  if (val <= 30) humidInfo.textContent = "Normal";
  else if (val > 30 && val <= 60) humidInfo.textContent = "Moderate";
  else humidInfo.textContent = "High";
};

const getVisInfo = function (val) {
  if (val >= 10) visibility_info.textContent = "Clear";
  else if (val >= 5 && val < 10) visibility_info.textContent = "Moderate";
  else visibility_info.textContent = "Poor";
};

const getAqiInfo = function (index) {
  if (index <= 3) {
    aqi__info.textContent = "Low";
  } else if (index > 3 && index < 7) {
    aqi__info.textContent = "Moderate";
  } else if (index == 10) {
    aqi__info.textContent = "High";
  } else {
    aqi__info.textContent = "Very High";
  }
};

function getDayOfWeek(dateString) {
  // Create a Date object from the input date string
  const date = new Date(dateString);

  // Days of the week as an array
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Get the day of the week (0 = Sunday, 1 = Monday, ...)
  const dayIndex = date.getDay();

  // Return the day of the week as a string
  return daysOfWeek[dayIndex];
}

const setDayTime = function (dt) {
  const time = dt.slice(-5);

  const date = dt.slice(0, 10);
  const day = getDayOfWeek(date);
  const html = `${day},<span id="time">${time}</span>`;
  currWeatherDate.innerHTML = html;
};

const progressBar = document.querySelector(".bar");

const progress = function (progressValue) {
  const dg = `${progressValue * 4}` * 4.5;
  progressBar.style.rotate = `${-135 + dg}deg`;
};
progress(8);

const setWeatherIcons = function (param) {
  const code = param.condition.icon.slice(-7, -4);
  const path = `weather_icons/${param.is_day ? "day" : "night"}/${code}.png`;
  weatherNowIcon.src = path;
};

const getWeatherIconCode = function (param) {
  const code = param.day.condition.icon.slice(-7, -4);
  return code;
};

const setCardIcons = function (arr) {
  for (let i = 1; i <= 7; ++i) {
    const card = document.querySelector(`.card--${i}`);
    const day = getDayOfWeek(arr[i].date).slice(0, 3);

    card.innerHTML = `<p class="day">${day}</p>
    <img src="weather_icons/day/${getWeatherIconCode(
      arr[i]
    )}.png" alt="weather class="icon" />
    <div class="temp">
      <span class="max">${Math.round(arr[i].day.maxtemp_c)}&deg;</span>
      <span class="min">${Math.round(arr[i].day.mintemp_c)}&deg;</span>
    </div>`;
  }
};

const getWeatherDetails = async function (inputLocation) {
  try {
    if (inputLocation == "") return;
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${apikey}&q=${inputLocation}&days=8&aqi=yes`
    );
    const data = await response.json();
    if (data.location === undefined) {
      alert("Invalid City Name!");
      throw new Error("Invalid City Name");
    }
    //setting icon according to weather
    setWeatherIcons(data.current);
    //setting temp
    temperature.textContent = Math.round(data.current.temp_c);
    //setting city and country
    city.textContent = `${data.location.name},`;
    country.textContent = data.location.country;
    //AQI
    aqi.textContent = data.current.air_quality["gb-defra-index"];
    getAqiInfo(data.current.air_quality["gb-defra-index"]);
    //Visibility
    visibility.innerHTML = `${data.current.vis_km} <span class="km">km</span>`;
    getVisInfo(`${data.current.vis_km}`);
    //Humidity
    humidity.textContent = `${data.current.humidity}%`;
    getHumidInfo(`${data.current.humidity}`);
    //Local Time
    setDayTime(`${data.location.localtime}`);
    //Current Weather
    currWeather.textContent = data.current.condition.text;
    //Wind details
    windDir.textContent = data.current.wind_dir;
    windSpeed.innerHTML = `${data.current.wind_kph} <span class="km">km/h</span>`;
    const deg = -45 + data.current.wind_degree;
    rotateWindIcon(deg);
    //Uv index bar
    progress(data.current.uv);
    uvIndex.textContent = data.current.uv;
    //Sunrise and Sunset
    sunrise.textContent = data.forecast.forecastday[0].astro.sunrise;
    sunset.textContent = data.forecast.forecastday[0].astro.sunset;
    //Rain Chances
    const hourlength = data.forecast.forecastday[0].hour.length;
    rainChances.innerHTML = `${
      data.forecast.forecastday[0].hour[hourlength - 1].chance_of_rain
    }% - Rain`;
    // console.log(data);

    const foreCastArray = data.forecast.forecastday;
    // console.log(foreCastArray);
    setCardIcons(foreCastArray);
  } catch (err) {
    console.error(err);
  }
};

searchButton.addEventListener("click", function (e) {
  e.preventDefault();
  let inputLocation = document.querySelector(".search__input");

  getWeatherDetails(inputLocation.value);
  inputLocation.value = "";
});
