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
const rainNowIcon = document.querySelector(".w_rain");
const currWeather = document.querySelector(".weather__curr");
const rainChances = document.querySelector(".rain__per");

function rotateWindIcon(degrees) {
  const icon = document.querySelector(".compass");
  icon.style.transform = `rotate(${degrees}deg)`;
}

const setTime = function (curr) {
  const currTime = curr.slice(-5);
};
function getDayName(curr) {
  const date = new Date(curr);
  return date.toLocaleDateString({ weekday: "long" });
}
console.log(getDayName("2023-08-17"));

const getHumidInfo = function () {};

const getVisInfo = function () {};

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

const progressBar = document.querySelector(".bar");

const progress = function (progressValue) {
  const dg = `${progressValue * 4}` * 4.5;
  progressBar.style.rotate = `${-135 + dg}deg`;
};

progress(8);

const getWeatherDetails = async function (inputLocation) {
  try {
    if (inputLocation == "") return;
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=3bb2dcb7567d448bad5110206231008&q=${inputLocation}&aqi=yes`
    );
    const data = await response.json();
    if (data.location === undefined) {
      alert("Invalid City Name!");
      throw new Error("Invalid City Name");
    }
    //setting icon according to weather
    const code = data.current.condition.icon.slice(-7, -4);
    console.log(code);
    const path = `weather_icons/${
      data.current.is_day ? "day" : "night"
    }/${code}.png`;
    weatherNowIcon.src = path;
    temperature.textContent = Math.round(data.current.temp_c);
    city.textContent = `${data.location.name},`;
    country.textContent = data.location.country;
    aqi.textContent = data.current.air_quality["gb-defra-index"];
    getAqiInfo(data.current.air_quality["gb-defra-index"]);
    visibility.innerHTML = `${data.current.vis_km} <span class="km">km</span>`;
    humidity.textContent = `${data.current.humidity}%`;
    currWeather.textContent = data.current.condition.text;
    windDir.textContent = data.current.wind_dir;
    progress(data.current.uv);
    uvIndex.textContent = data.current.uv;
    windSpeed.innerHTML = `${data.current.wind_kph} <span class="km">km/h</span>`;
    const deg = -45 + data.current.wind_degree;

    rotateWindIcon(deg);
    sunrise.textContent = data.forecast.forecastday[0].astro.sunrise;
    sunset.textContent = data.forecast.forecastday[0].astro.sunset;

    const hourlength = data.forecast.forecastday[0].hour.length;

    rainChances.innerHTML = `${
      data.forecast.forecastday[0].hour[hourlength - 1].chance_of_rain
    }% - Rain`;
    console.log(data);
  } catch (err) {
    console.error(err);
  }
};

searchButton.addEventListener("click", function (e) {
  e.preventDefault();
  const inputLocation = document.querySelector(".search__input").value;

  getWeatherDetails(inputLocation);
  inputLocation.value = "";
});
