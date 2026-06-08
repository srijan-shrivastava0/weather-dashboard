# 🌤️ Weather Dashboard

A responsive, feature-rich weather dashboard that fetches real-time weather data from the OpenWeatherMap API.

## Features

✨ **Current Weather Display**
- Real-time temperature, humidity, wind speed
- Weather description and "feels like" temperature
- Detailed metrics (pressure, visibility, UV index)

📊 **Forecasts**
- Hourly forecast (next 24 hours)
- 7-day extended forecast
- High/low temperatures

🏙️ **City Search**
- Search by city name
- Geolocation support
- Recent searches history
- Favorite cities

🎨 **UI/UX**
- Responsive design (mobile, tablet, desktop)
- Dark/Light theme toggle
- Smooth animations and transitions
- Weather-specific icons

💾 **Local Storage**
- Persist recent searches
- Save favorite cities
- Theme preference

## Setup Instructions

### 1. Get API Key
1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Generate an API key from your dashboard
4. No credit card required for free tier

### 2. Install & Setup

```bash
# Clone the repository
git clone https://github.com/srijan-shrivastava0/weather-dashboard.git
cd weather-dashboard

# Create .env file
cp .env.example .env

# Add your API key to .env
# REACT_APP_WEATHER_API_KEY=your_key_here
```

### 3. Update API Key in script.js

Replace `'YOUR_OPENWEATHERMAP_API_KEY'` in `script.js`:

```javascript
const API_KEY = 'your_actual_api_key_here';
```

### 4. Run Locally

```bash
# Simple HTTP server (Python 3)
python -m http.server 8000

# Or using Node.js
npx http-server

# Open browser and visit http://localhost:8000
```

### 5. Deploy to GitHub Pages

```bash
# Push to GitHub
git add .
git commit -m "Initial weather dashboard"
git push origin main

# Enable GitHub Pages in repository settings
# Select 'main' branch as source
```

## API Usage

- **Free Tier**: 1,000 calls/day
- **Current Weather**: 5-day forecast included
- **Forecast Data**: 3-hour intervals
- **Rate Limit**: 60 calls/minute

## Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Flexbox, Grid, animations
- **Vanilla JavaScript** - No dependencies
- **OpenWeatherMap API** - Weather data

## File Structure

```
weather-dashboard/
├── index.html          # Main HTML structure
├── styles.css          # Responsive styling
├── script.js           # Weather API logic
├── .env.example        # Environment variables template
├── .gitignore          # Git ignore file
└── README.md          # This file
```

## Features Walkthrough

### Search City
1. Type city name in search box
2. Click Search or press Enter
3. View current weather and forecasts
4. City is added to recent searches

### Use Geolocation
1. Click the 📍 button
2. Allow browser permission
3. Weather for your location loads automatically

### Favorite Cities
1. Click ⭐ button in current weather
2. Favorite appears in Favorites section
3. Click favorite card to view its weather
4. Click Remove to unfavorite

### Theme Toggle
1. Click 🌙/☀️ in header
2. Switch between light and dark modes
3. Preference is saved

## Responsive Breakpoints

- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: < 768px

## Performance Optimizations

- Lazy loading of forecast data
- Efficient DOM manipulation
- LocalStorage caching
- Debounced search (Enter to search)
- Async/await for API calls

## Known Limitations

- Free tier: 1000 calls/day
- No historical weather data
- Limited to 5-day forecast
- Some metrics (UV index) require paid subscription

## Future Enhancements

- [ ] Alert system for severe weather
- [ ] Weather maps integration
- [ ] Air quality index
- [ ] Pollen forecasts
- [ ] Astronomical data (sunrise/sunset)
- [ ] Multiple location comparison
- [ ] Weather notifications

## Troubleshooting

**Q: "City not found" error?**
A: Try using country code, e.g., "London, GB"

**Q: Geolocation not working?**
A: Ensure HTTPS connection or localhost. Check browser permissions.

**Q: API key not working?**
A: Verify key is valid and active on OpenWeatherMap dashboard.

**Q: Forecast data missing?**
A: Check API rate limit. Free tier has 1000 calls/day limit.

## License

MIT License - feel free to use for personal or commercial projects.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Author

Created by Srijan Shrivastava

## Support

For issues or questions, please open an issue on GitHub.

---

**Happy coding! ⛈️🌦️☀️**