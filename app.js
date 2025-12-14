// Initialize the map
let map = L.map('map').setView([16.0544, 108.2022], 6); // Center on Vietnam

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
}).addTo(map);

// Store markers
let markers = [];
let locationMarker = null;

// DOM elements
const locationInput = document.getElementById('locationInput');
const searchBtn = document.getElementById('searchBtn');
const loadingIndicator = document.getElementById('loadingIndicator');
const errorMessage = document.getElementById('errorMessage');
const poiList = document.getElementById('poiList');

const weatherSection = document.getElementById('weatherSection')
const weatherLoading = document.getElementById('weatherLoading');
const weatherContent = document.getElementById('weatherContent');
const weatherError = document.getElementById('weatherError');

const translateInput = document.getElementById('translateInput');
const translateOutput = document.getElementById('translateOutput');
const targetLanguage = document.getElementById('targetLanguage');
const translateBtn = document.getElementById('translateBtn');
const clearTranslateBtn = document.getElementById('clearTranslateBtn');
const copyTranslationBtn = document.getElementById('copyTranslationBtn');
const translationLoading = document.getElementById('translationLoading');
const translationError = document.getElementById('translationError');
const detectedLang = document.getElementById('detectedLang');
const autoTranslatePOI = document.getElementById('autoTranslatePOI');

// API base URL
const API_BASE_URL = '/api';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const TRANSLATE_API_URL = 'https://api.mymemory.translated.net/get';

// Function to show loading
function showLoading(show) {
    loadingIndicator.classList.toggle('hidden', !show);
}

// Function to show error
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    setTimeout(() => {
        errorMessage.classList.add('hidden');
    }, 5000);
}

// Function to clear markers
function clearMarkers() {
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
    if (locationMarker) {
        map.removeLayer(locationMarker);
        locationMarker = null;
    }
}

// Function to get POI icon based on type
function getPOIIcon(type) {
    const iconMap = {
        'attraction': '🎭',
        'museum': '🏛️',
        'restaurant': '🍽️',
        'cafe': '☕',
        'hotel': '🏨',
        'viewpoint': '👁️',
        'park': '🌳',
        'monument': '🗿',
        'temple': '⛩️',
        'church': '⛪',
        'historic': '🏰',
        'theatre': '🎭',
        'cinema': '🎬',
        'library': '📚',
        'castle': '🏰',
        'memorial': '🗿',
        'artwork': '🎨'
    };
    return iconMap[type] || '📍';
}

// Function to get type display name
function getTypeDisplayName(type) {
    return type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, ' ');
}

// Function to display POIs on the map
function displayPOIsOnMap(pois, centerLat, centerLon) {
    clearMarkers();

    // Add marker for the searched location
    locationMarker = L.marker([centerLat, centerLon], {
        icon: L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: #4F46E5; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 18px; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">📍</div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        })
    }).addTo(map);

    // Add markers for POIs
    pois.forEach((poi, index) => {
        const icon = getPOIIcon(poi.type);
        const marker = L.marker([poi.lat, poi.lon], {
            icon: L.divIcon({
                className: 'custom-div-icon',
                html: `<div style="background-color: white; border-radius: 50%; width: 35px; height: 35px; display: flex; align-items: center; justify-content: center; font-size: 20px; border: 2px solid #4F46E5; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">${icon}</div>`,
                iconSize: [35, 35],
                iconAnchor: [17, 17]
            })
        }).addTo(map);

        marker.bindPopup(`
            <div style="min-width: 200px;">
                <h3 style="font-weight: bold; font-size: 16px; margin-bottom: 5px;">${icon} ${poi.name}</h3>
                <p style="color: #666; font-size: 14px; margin-bottom: 5px;">Type: ${getTypeDisplayName(poi.type)}</p>
                ${poi.tags.address ? `<p style="font-size: 12px; color: #888;">${poi.tags.address}</p>` : ''}
            </div>
        `);

        markers.push(marker);
    });

    // Fit map to show all markers
    const bounds = L.latLngBounds(
        [centerLat, centerLon],
        ...pois.map(poi => [poi.lat, poi.lon])
    );
    map.fitBounds(bounds, { padding: [50, 50] });
}

// Function to display POIs in the list
function displayPOIsList(pois) {
    if (pois.length === 0) {
        poiList.innerHTML = `
            <p class="text-gray-500 col-span-full text-center py-8">
                No points of interest found in this area. Try searching for a larger city.
            </p>
        `;
        return;
    }

    poiList.innerHTML = pois.map((poi, index) => {
        const icon = getPOIIcon(poi.type);
        const description = poi.tags.description || poi.tags.tourism || poi.tags.amenity || 'A point of interest';
        
        return `
            <div class="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 shadow hover:shadow-lg transition duration-200 border border-indigo-100">
                <div class="flex items-start gap-3">
                    <div class="text-3xl">${icon}</div>
                    <div class="flex-1">
                        <h3 class="font-bold text-lg text-gray-800 mb-1">${poi.name}</h3>
                        <p class="text-sm text-indigo-600 mb-2">${getTypeDisplayName(poi.type)}</p>
                        <p class="text-xs text-gray-600 mb-2">${description}</p>
                        <div class="flex items-center gap-2 text-xs text-gray-500">
                            <span>📍 ${poi.lat.toFixed(5)}, ${poi.lon.toFixed(5)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Function to fetch weather data
async function fetchWeatherData(lat, lon, locationName) {
    if (!config || !config.WEATHER_API_KEY || config.WEATHER_API_KEY === 'YOUR_WEATHER_API_KEY_HERE') {
        console.error('Weather API key not configured');
        showWeatherError('Weather API key not configured. Please add your API key to config.js')
        return;
    }

    // Show weather section and loading state
    weatherSection.classList.remove('hidden')
    weatherLoading.classList.remove('hidden')
    weatherContent.classList.add('hidden')
    weatherError.classList.add('hidden');

    try {
        const url = `${WEATHER_API_URL}?lat=${lat}&lon=${lon}&appid=${config.WEATHER_API_KEY}&units=metric`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Weather data not available');
        }

        const weatherData = await response.json();
        displayWeatherInfo(weatherData, locationName);

    } catch (error) {
        console.error('Error fetching weather:', error);
        showWeatherError('Unable to load weather data, please try again')
    } finally {
        weatherLoading.classList.add('hidden');
    }
}

function displayWeatherInfo(data, locationName) {
    weatherContent.classList.remove('hidden');
    weatherError.classList.add('hidden')

    // Update location and date
    document.getElementById('weatherLocation').textContent = locationName || data.name;
    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('weatherDate').textContent = currentDate;

    // Update temparature
    document.getElementById('weatherTemp').textContent = Math.round(data.main.temp);
    document.getElementById('weatherFeelsLike').textContent = 
        `Feel like: ${Math.round(data.main.feels_like)}°C`;
    
    // Update weather description
    const description = data.weather[0].description;
    document.getElementById('weatherDescription').textContent = 
        description.charAt(0).toUpperCase() + description.slice(1);

    // Update weather icon
    const iconCode = data.weather[0].icon;
    document.getElementById('weatherIcon').src = 
        `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    document.getElementById('weatherIcon').alt = description;

    // Update detailed info
    document.getElementById('weatherHumidity').textContent = `${data.main.humidity}%`;
    document.getElementById('weatherWind').textContent = `${data.wind.speed} m/s`;
    document.getElementById('weatherPressure').textContent = `${data.main.pressure} hPa`;

    // Visibility (convert from meters to kilometers)
    const visibilityKm = (data.visibility / 1000).toFixed(1);
    document.getElementById('weatherVisibility').textContent = `${visibilityKm} km`;
}

function showWeatherError(message) {
    weatherContent.classList.add('hidden');
    weatherLoading.classList.add('hidden');
    weatherError.classList.remove('hidden');
    weatherError.querySelector('p').textContent = message;
}

// Function to search for location and POIs
async function searchLocation() {
    const location = locationInput.value.trim();
    
    if (!location) {
        showError('Please enter a location name');
        return;
    }

    showLoading(true);
    errorMessage.classList.add('hidden');

    try {
        // Step 1: Search for the location
        const locationResponse = await fetch(`${API_BASE_URL}/search-location?location=${encodeURIComponent(location)}`);
        
        if (!locationResponse.ok) {
            throw new Error('Location not found. Please try another location in Vietnam.');
        }

        const locationData = await locationResponse.json();
        
        // Step 2: Get points of interest near the location
        const poisResponse = await fetch(`${API_BASE_URL}/points-of-interest?lat=${locationData.lat}&lon=${locationData.lon}&radius=5000`);
        
        if (!poisResponse.ok) {
            throw new Error('Failed to fetch points of interest');
        }

        const poisData = await poisResponse.json();
        
        // Display results
        displayPOIsOnMap(poisData.pois, locationData.lat, locationData.lon);
        displayPOIsList(poisData.pois);

        // Fetch and display weather data
        fetchWeatherData(locationData.lat, locationData.lon, locationData.name || location);

    } catch (error) {
        console.error('Error:', error);
        showError(error.message);
    } finally {
        showLoading(false);
    }
}

// Function to translate text
async function translateText(text, targetLang, sourceLang = 'auto') {
    try {
        // MyMemory API format: ? q=text&langpair=source|target
        const langPair = sourceLang === 'auto' ? `en|${targetLang}` : `${sourceLang}|${targetLang}`;
        const url = `${TRANSLATE_API_URL}?q=${encodeURIComponent(text)}&langpair=${langPair}`;
        
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Translation failed');
        }

        const data = await response.json();
        
        if (data.responseStatus === 200) {
            return data.responseData.translatedText;
        } else {
            throw new Error(data.responseDetails || 'Translation failed');
        }
    } catch (error) {
        console.error('Translation error:', error);
        throw error;
    }
}

// Function to show translation loading
async function showTranslationLoading(show) {
    translationLoading.classList.toggle('hidden', !show);
}

// Function to show translation error
async function showTranslationError(message) {
    translationError.textContent = message;
    translationError.classList.remove('hidden');
    setTimeout(()=>{
        translationError.classList.add("hidden")
    }, 5000);
}

// Main translate button handler
async function handleTranslate() {
    const textToTranslate = translateInput.value.trim();
    const targetLang = targetLanguage.value;

    if (!textToTranslate) {
        showTranslationError('Please enter text to translate');
        return;
    }

    showTranslationLoading(true);
    translationError.classList.add('hidden');
    translateBtn.disabled = true;

    try {
        const translatedText = await translateText(textToTranslate, targetLang);

        translateOutput.innerHTML = translatedText;
        copyTranslationBtn.classList.remove('hidden');
    } catch (error) {
        showTranslationError(`${error}`);
        translateOutput.innerHTML = '<span class="text-gray-400">Translation failed... </span>';
    } finally {
        showTranslationLoading(false);
        translateBtn.disabled = false;
    }
}

// Show typing indicator
let detectTimeout;
translateInput.addEventListener('input', () => {
    clearTimeout(detectTimeout);
    const text = translateInput.value.trim();

    if (text. length > 0) {
        detectedLang.textContent = 'Ready to translate... ';
    } else {
        detectedLang.textContent = '';
    }
});

// Clear translation
clearTranslateBtn.addEventListener('click', () => {
    translateInput.value = '';
    translateOutput.innerHTML = '<span class="text-gray-400">Translation will appear here...</span>';
    detectedLang.textContent = '';
    copyTranslationBtn.classList.add('hidden');
});

// Copy translation
copyTranslationBtn.addEventListener('click', () => {
    const text = translateOutput.textContent;
    navigator.clipboard.writeText(text). then(() => {
        const originalText = copyTranslationBtn. textContent;
        copyTranslationBtn.textContent = '✓ Copied!';
        setTimeout(()=>{
            copyTranslationBtn.textContent = originalText;
        }, 2000);
    });
});

// Translate button click
translateBtn.addEventListener('click', handleTranslate);

// Enter key to translate
translateInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleTranslate();
    }
});

// Event listeners
searchBtn.addEventListener('click', searchLocation);

locationInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchLocation();
    }
});

// Initial message
console.log('Vietnam POI Finder loaded successfully!');
console.log('Enter a location in Vietnam to start exploring...');


