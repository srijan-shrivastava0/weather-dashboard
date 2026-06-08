// Configuration
const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // Get free key from openweathermap.org
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const geoBtn = document.getElementById('geoBtn');
const currentWeatherDiv = document.getElementById('currentWeather');
const hourlyForecastDiv = document.getElementById('hourlyForecast');
const dailyForecastDiv = document.getElementById('dailyForecast');
const recentSearchesDiv = document.getElementById('recentSearches');
const favoritesListDiv = document.getElementById('favoritesList');
const themeToggle = document.getElementById('themeToggle');

// State
let currentCity = null;
let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Weather Icons Map
const weatherIcons = {
    '01d': '☀️',
    '01n': '🌙',
    '02d': '⛅',
    '02n': '☁️',
    '03d': '☁️',
    '03n': '☁️',
    '04d': '☁️',
    '04n': '☁️',
    '09d': '🌧️',
    '09n': '🌧️',
    '10d': '🌦️',
    '10n': '🌧️',
    '11d': '⛈️',
    '11n': '⛈️',
    '13d': '❄️',
    '13n': '❄️',
    '50d': '🌫️',
    '50n': '🌫️',
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    initializeEventListeners();
    loadDefaultCity();
    renderRecentSearches();
    renderFavorites();
});

// Theme Toggle
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light-theme';
    document.body.className = savedTheme;
    themeToggle.textContent = savedTheme === 'dark-theme' ? '☀️' : '🌙';
}

themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.contains('dark-theme');
    if (isDark) {
        document.body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light-theme');
        themeToggle.textContent = '🌙';
    } else {
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark-theme');
        themeToggle.textContent = '☀️';
    }
});

// Event Listeners
function initializeEventListeners() {
    searchBtn.addEventListener('click', searchCity);
    geoBtn.addEventListener('click', getGeolocation);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchCity();
    });
}

// Search City
async function searchCity() {
    const city = searchInput.value.trim();
    if (!city) return;

    try {
        searchInput.disabled = true;
        searchBtn.disabled = true;
        currentWeatherDiv.innerHTML = '<div class="weather-loading">Loading...</div>';

        const response = await fetch(
            `${API_BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`
        );

        if (!response.ok) throw new Error('City not found');

        const data = await response.json();
        currentCity = { lat: data.coord.lat, lon: data.coord.lon, name: data.name, country: data.sys.country };

        addRecentSearch(city);
        searchInput.value = '';

        await Promise.all([
            displayCurrentWeather(data),
            fetchForecast(data.coord.lat, data.coord.lon)
        ]);
    } catch (error) {
        currentWeatherDiv.innerHTML = `<div class="weather-loading" style="color: red;">Error: ${error.message}</div>`;
    } finally {
        searchInput.disabled = false;
        searchBtn.disabled = false;
    }
}

// Geolocation
function getGeolocation() {
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
        return;
    }

    geoBtn.disabled = true;
    geoBtn.textContent = '📍 Loading...';

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            currentCity = { lat: latitude, lon: longitude };

            try {
                const response = await fetch(
                    `${API_BASE_URL}/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
                );
                const data = await response.json();
                currentCity.name = data.name;
                currentCity.country = data.sys.country;

                await Promise.all([
                    displayCurrentWeather(data),
                    fetchForecast(latitude, longitude)
                ]);

                addRecentSearch(`${data.name}, ${data.sys.country}`);
            } catch (error) {
                alert('Error fetching weather for your location');
            } finally {
                geoBtn.disabled = false;
                geoBtn.textContent = '📍';
            }
        },
        (error) => {
            alert('Error getting location: ' + error.message);
            geoBtn.disabled = false;
            geoBtn.textContent = '📍';
        }
    );
}

// Display Current Weather
async function displayCurrentWeather(data) {
    const isFavorite = favorites.some(fav => fav.name === data.name);
    const weatherIcon = weatherIcons[data.weather[0].icon] || '🌤️';

    const html = `
        <div class="weather-header">
            <div class="city-info">
                <h2>${data.name}, ${data.sys.country}</h2>
                <p>${new Date(data.dt * 1000).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })}</p>
            </div>
            <button class="favorite-btn ${isFavorite ? 'active' : ''}" onclick="toggleFavorite('${data.name}', ${data.main.temp}, '${data.weather[0].main}')">
                ${isFavorite ? '⭐' : '☆'}
            </button>
        </div>

        <div class="weather-main">
            <div class="weather-item">
                <div class="temperature">${Math.round(data.main.temp)}°C</div>
                <div class="weather-icon">${weatherIcon}</div>
                <div class="weather-description">${data.weather[0].main}</div>
                <p>${data.weather[0].description}</p>
            </div>
        </div>

        <div class="weather-details">
            <div class="detail-item">
                <div class="detail-label">Feels Like</div>
                <div class="detail-value">${Math.round(data.main.feels_like)}°C</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Humidity</div>
                <div class="detail-value">${data.main.humidity}%</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Wind Speed</div>
                <div class="detail-value">${(data.wind.speed * 3.6).toFixed(1)} km/h</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Pressure</div>
                <div class="detail-value">${data.main.pressure} mb</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Visibility</div>
                <div class="detail-value">${(data.visibility / 1000).toFixed(1)} km</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">UV Index</div>
                <div class="detail-value">${data.uvi ? data.uvi.toFixed(1) : 'N/A'}</div>
            </div>
        </div>
    `;

    currentWeatherDiv.innerHTML = html;
}

// Fetch Forecast
async function fetchForecast(lat, lon) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );
        const data = await response.json();

        displayHourlyForecast(data.list.slice(0, 8));
        displayDailyForecast(data.list);
    } catch (error) {
        console.error('Error fetching forecast:', error);
    }
}

// Display Hourly Forecast
function displayHourlyForecast(hourlyData) {
    const html = hourlyData.map(item => {
        const time = new Date(item.dt * 1000);
        const icon = weatherIcons[item.weather[0].icon] || '🌤️';
        return `
            <div class="hourly-item">
                <div class="hourly-time">${time.getHours()}:00</div>
                <div class="hourly-icon">${icon}</div>
                <div class="hourly-temp">${Math.round(item.main.temp)}°C</div>
            </div>
        `;
    }).join('');

    hourlyForecastDiv.innerHTML = html;
}

// Display Daily Forecast
function displayDailyForecast(forecastData) {
    const dailyMap = {};

    forecastData.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        if (!dailyMap[date]) {
            dailyMap[date] = {
                temps: [],
                weather: item.weather[0],
                icon: item.weather[0].icon,
                date: new Date(item.dt * 1000)
            };
        }
        dailyMap[date].temps.push(item.main.temp);
    });

    const dailyData = Object.values(dailyMap).slice(0, 7);

    const html = dailyData.map(day => {
        const minTemp = Math.round(Math.min(...day.temps));
        const maxTemp = Math.round(Math.max(...day.temps));
        const icon = weatherIcons[day.icon] || '🌤️';

        return `
            <div class="daily-item">
                <div class="daily-date">${day.date.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                })}</div>
                <div class="daily-icon">${icon}</div>
                <div class="daily-description">${day.weather.main}</div>
                <div class="daily-temp-range">
                    <div class="daily-high">↑${maxTemp}°</div>
                    <div class="daily-low">↓${minTemp}°</div>
                </div>
            </div>
        `;
    }).join('');

    dailyForecastDiv.innerHTML = html;
}

// Recent Searches
function addRecentSearch(city) {
    recentSearches = recentSearches.filter(s => s !== city);
    recentSearches.unshift(city);
    recentSearches = recentSearches.slice(0, 5);
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    renderRecentSearches();
}

function renderRecentSearches() {
    const html = recentSearches.map(city =>
        `<div class="recent-search-tag" onclick="searchForCity('${city}')">${city}</div>`
    ).join('');
    recentSearchesDiv.innerHTML = html;
}

function searchForCity(city) {
    searchInput.value = city;
    searchCity();
}

// Favorites
function toggleFavorite(cityName, temp, description) {
    const index = favorites.findIndex(fav => fav.name === cityName);
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push({ name: cityName, temp: Math.round(temp), description });
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    renderFavorites();
    if (currentCity) {
        displayCurrentWeather({ ...currentCity, main: { temp }, weather: [{ main: description }] });
    }
}

function renderFavorites() {
    if (favorites.length === 0) {
        favoritesListDiv.innerHTML = '<div class="empty-state">No favorite cities yet. Add one!</div>';
        return;
    }

    const html = favorites.map(fav => `
        <div class="favorite-card" onclick="searchForCity('${fav.name}')">
            <div class="favorite-city-name">${fav.name}</div>
            <div class="favorite-city-temp">${fav.temp}°C</div>
            <div class="favorite-city-desc">${fav.description}</div>
            <button class="remove-favorite" onclick="removeFavorite('${fav.name}', event)">Remove</button>
        </div>
    `).join('');

    favoritesListDiv.innerHTML = html;
}

function removeFavorite(cityName, event) {
    event.stopPropagation();
    favorites = favorites.filter(fav => fav.name !== cityName);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    renderFavorites();
}

// Load Default City
async function loadDefaultCity() {
    const defaultCity = 'London';
    searchInput.value = defaultCity;
    searchCity();
}