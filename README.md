# Vietnam Points of Interest Finder

A web application that allows users to search for locations in Vietnam and displays points of interest on an interactive map using OpenStreetMap API, along with real-time weather information and language translation features.

## Features

- 🔍 Search for any location in Vietnam
- 🗺️ Interactive map display using Leaflet.js and OpenStreetMap
- 📍 Shows points of interest near the searched location
- ☀️ Real-time weather information using OpenWeatherMap API
- 🌐 Text translation feature using MyMemory Translation API
- 🔐 User authentication with Firebase (Google Sign-In and Email/Password)
- 👤 User profile management with sign-in/sign-out functionality
- 🎨 Beautiful UI with Tailwind CSS
- 📱 Responsive design for mobile and desktop

## Technologies Used

### Frontend
- **HTML5**: Structure
- **Tailwind CSS**: Styling and responsive design
- **Leaflet.js**: Interactive map visualization

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web server framework
- **Axios**: HTTP client for API requests

### APIs
- **OpenStreetMap Nominatim API**: Location geocoding
- **Overpass API**: Points of interest data
- **OpenWeatherMap API**: Real-time weather information
- **MyMemory Translation API**: Text translation service
- **Firebase Authentication**: User authentication and authorization

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure the Weather API:
   - Open `config.js` in the root directory
   - Replace the placeholder API key with your OpenWeatherMap API key
   - Get a free API key at [OpenWeatherMap](https://openweathermap.org/api)

```javascript
const config = {
    WEATHER_API_KEY: 'YOUR_API_KEY_HERE'
}
```

3. Configure Firebase Authentication:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication in your Firebase project:
     - Go to **Authentication** → **Sign-in method**
     - Enable **Google** sign-in provider
     - Enable **Email/Password** authentication
     - Add authorized domains (e.g., `localhost`)
   - Copy your Firebase configuration from **Project Settings** → **General** → **Your apps**
   - Create `firebase-config.js` in the root directory and add your config:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

## Running the Application

1. Start the server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

## Usage

### User Authentication
1. Click the **"Sign In"** button in the top-right corner
2. Choose your preferred sign-in method:
   - **Google Sign-In**: Click "Continue with Google" and follow the OAuth flow
   - **Email/Password**: 
     - Enter your email and password
     - Click "Sign In" to log in
     - Or click "Sign up" to create a new account
3. Once signed in:
   - Your profile picture and name will be displayed
   - Access personalized features
4. Click **"Sign Out"** to log out of your account

### Location Search
1. Enter a location name in Vietnam (e.g., "Hanoi", "Ho Chi Minh City", "Da Nang")
2. Click the "Search" button or press Enter
3. View the location and points of interest on the map
4. Check the real-time weather information for the selected location
5. Click on markers to see more details about each location
6. Scroll down to see a detailed list of all points of interest with icons and coordinates

### Translation Feature
1. Navigate to the "Translate" section
2. Enter the text you want to translate in the input box
3. Select your target language from the dropdown menu
4. Click "Translate" button or press Enter
5. View the translated text in the output area
6. Click "Copy" to copy the translation to clipboard
7. Click "Clear" to reset and start a new translation

## API Endpoints

### GET `/api/search-location`
Search for a location in Vietnam.

**Query Parameters:**
- `location` (required): Name of the location in Vietnam

**Response:**
```json
{
  "name": "Hanoi, Vietnam",
  "lat": 21.0285,
  "lon": 105.8542,
  "boundingbox": [...]
}
```

### GET `/api/points-of-interest`
Get points of interest near a location.

**Query Parameters:**
- `lat` (required): Latitude
- `lon` (required): Longitude
- `radius` (optional): Search radius in meters (default: 2000, frontend uses 5000)

**Response:**
```json
{
  "pois": [
    {
      "id": 123456,
      "name": "Hoan Kiem Lake",
      "type": "attraction",
      "lat": 21.0285,
      "lon": 105.8542,
      "tags": {...}
    }
  ]
}
```

## Project Structure

```
├── index.html          # Main HTML file with auth UI
├── app.js              # Frontend JavaScript (map, weather & translation)
├── auth.js             # Firebase authentication logic
├── config.js           # Weather API key configuration
├── firebase-config.js  # Firebase configuration (create this file)
├── server.js           # Express server with API endpoints
├── package.json        # Dependencies and scripts
└── README.md           # This file
```

## Weather Information

The application displays comprehensive weather data including:
- Current temperature and "feels like" temperature
- Weather description with animated icons
- Humidity percentage
- Wind speed (m/s)
- Atmospheric pressure (hPa)
- Visibility (km)

Weather data is automatically fetched when you search for a location.

## Translation Feature

The translation tool supports multiple languages:
- **English** (en)
- **Vietnamese** (vi)
- **Chinese** (zh)
- **Japanese** (ja)
- **Korean** (ko)
- **French** (fr)
- **German** (de)
- **Spanish** (es)
- **Italian** (it)
- **Portuguese** (pt)
- **Russian** (ru)
- **Thai** (th)
- **Arabic** (ar)

Features:
- Instant translation using MyMemory API
- Copy translated text to clipboard
- Clear button to reset translation
- Enter key support for quick translation
- User-friendly error messages

## Notes

- The application uses OpenStreetMap's free APIs with rate limiting
- Weather data requires an OpenWeatherMap API key (configured in `config.js`)
- Firebase Authentication requires a Firebase project setup (configured in `firebase-config.js`)
- Translation uses MyMemory API (free tier with usage limits)
- Please be respectful of API usage limits
- Results may vary based on available data in OpenStreetMap
- The application is configured to search specifically within Vietnam
- Weather information updates with each location search
- Translation quality depends on MyMemory API database

## Dependencies

- **express** (^4.18.2): Web server framework
- **axios** (^1.6.0): HTTP client for API requests
- **cors** (^2.8.5): Enable CORS for API endpoints
- **nodemon** (^3.0.1): Development auto-reload (dev dependency)

## Future Enhancements

- Add filters for different types of POIs (restaurants, museums, etc.)
- Save favorite locations (user-specific with Firebase)
- Add directions between points
- Weather forecast (multi-day predictions)
- Export POI list
- Auto-translate POI names and descriptions
- Language detection for translation input
- Translation history
- Offline translation support
- Voice input for translation

## License

ISC
