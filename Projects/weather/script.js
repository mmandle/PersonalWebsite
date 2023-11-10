const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');

const APIKey = '3a6e3098c63ff9dfd07d3150856994d3';

search.addEventListener('click', () => {
    const cityInput = document.querySelector('.search-box input');
    const city = cityInput.value.trim();

    if (city === '') {
        console.error('Please enter a city');
        return;
    }

    error404.style.display = 'none'; // Hide the previous error message
    error404.classList.remove('fadeIn');

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.cod === '404') {
                container.style.height = '400px';
                weatherBox.style.display = 'none';
                weatherDetails.style.display = 'none';
                error404.style.display = 'block';
                error404.classList.add('fadeIn');
                console.error('City not found');
                throw new Error('City not found');
            }
        })
        .catch(error => {
            console.error('Error checking city:', error);
            // Handle the error as needed
        });

    // Continue with the rest of the code (getLatLon and the subsequent API call)
    getLatLon(city, APIKey)
        .then(({ lat, lon }) => {
            return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${APIKey}`);
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(json => {
            console.log('API Response:', json);

            if (!json.current || !json.current.weather || !json.current.weather[0]) {
                console.error('Invalid API response format - weather data not found');
                return;
            }

            const currentWeather = json.current;

            const image = document.querySelector('.weather-box img');
            const temperature = document.querySelector('.weather-box .temperature');
            const description = document.querySelector('.weather-box .description');
            const humidity = document.querySelector('.weather-details .humidity span');
            const wind = document.querySelector('.weather-details .wind span');

            switch (currentWeather.weather[0].main) {
                case 'Clear':
                    image.src = 'images/clear.png';
                    break;

                case 'Rain':
                    image.src = 'images/rain.png';
                    break;

                case 'Snow':
                    image.src = 'images/snow.png';
                    break;

                case 'Clouds':
                    image.src = 'images/cloud.png';
                    break;

                case 'Haze':
                    image.src = 'images/mist.png';
                    break;

                default:
                    image.src = '';
            }

            temperature.innerHTML = `${parseInt((currentWeather.temp - 273.15) * 9/5 + 32)}<span>°F</span>`;
            description.innerHTML = `${currentWeather.weather[0].description}`;
            humidity.innerHTML = `${currentWeather.humidity}%`;
            wind.innerHTML = `${parseInt(currentWeather.wind_speed)}mph`;

            weatherBox.style.display = '';
            weatherDetails.style.display = '';
            weatherBox.classList.add('fadeIn');
            weatherDetails.classList.add('fadeIn');
            container.style.height = '590px';
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

async function getLatLon(city, apiKey) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    const lat = data.coord.lat;
    const lon = data.coord.lon;
    return { lat, lon };
}
