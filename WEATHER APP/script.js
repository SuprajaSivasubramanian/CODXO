document.getElementById('get-weather-btn').addEventListener('click', () => {
    const location = document.getElementById('location-input').value;
    if (location) {
        retrieveWeatherData(location);
    } else {
        alert('Please enter a city name.');
    }
});

document.getElementById('use-location-btn').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            retrieveWeatherData(null, lat, lon);
        }, error => {
            console.error('Geolocation error:', error);
            alert('Could not get your location.');
        });
    } else {
        alert('Geolocation is not supported by your browser.');
    }
});

function retrieveWeatherData(city, lat = null, lon = null) {
    const apiKey = 'a36924eddc5d17850fa52d120c43fd0c'; // Replace with your OpenWeatherMap API key
    let url = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&units=metric`;

    if (city) {
        url += `&q=${city}`;
    } else if (lat && lon) {
        url += `&lat=${lat}&lon=${lon}`;
    } else {
        return;
    }

    console.log('Fetching weather data from URL:', url);

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log('Weather data:', data);
            showWeatherData(data);
        })
        .catch(error => {
            console.error('Fetch error:', error);
            alert('Failed to fetch weather data.');
        });
}

function showWeatherData(data) {
    if (data.cod !== 200) {
        alert(`Error: ${data.message}`);
        return;
    }

    const weatherDetails = document.getElementById('weather-details');
    weatherDetails.innerHTML = `
        <div>City: ${data.name}</div>
        <div>Temperature: ${data.main.temp}°C</div>
        <div>Weather: ${data.weather[0].description}</div>
        <div>Humidity: ${data.main.humidity}%</div>
        <div>Wind Speed: ${data.wind.speed} m/s</div>
    `;
}
``