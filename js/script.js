const searchButton = document.querySelector(".search__button");

const getWeather = async function (inputLocation) {
  if (inputLocation == "") return;
  const response = await fetch(
    `https://api.weatherapi.com/v1/current.json?key=3bb2dcb7567d448bad5110206231008&q=${inputLocation}&aqi=no`
  );
  const data = await response.json();
  console.log(data);
};

searchButton.addEventListener("click", function (e) {
  e.preventDefault();
  const inputLocation = document.querySelector(".search__input").value;
  getWeather(inputLocation);
  inputLocation.value = "";
});
