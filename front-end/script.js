document.addEventListener("DOMContentLoaded", async () => {
    const API_URL = "http://localhost:8000/api/aggregated-data/";
    const WEATHER_API_KEY = "47d4843a458bfbd7c96feadea3765ebc"; // OpenWeather API key
    const HOLIDAY_API_KEY = "rKCC91TKVyqwL6fofBu9xED1hdttCj0X"; // Calendarific API key

    // DOM elements
    const newsContainer = document.getElementById("news-container");
    const weatherContainer = document.getElementById("weather-container");
    const holidayContainer = document.getElementById("holiday-container"); 
    const cityInput = document.getElementById("city-input");
    const timeSelect = document.getElementById("time-select");
    const fetchWeatherButton = document.getElementById("fetch-weather");
    const countryInput = document.getElementById("country-input");
    const fetchHolidaysButton = document.getElementById("fetch-holidays");

    // Fetch Aggregated Data
    async function fetchAggregatedData() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error("Failed to fetch aggregated data");

            const aggregatedData = await response.json();

            // Handle News Data
            const newsData = aggregatedData.news;
            newsContainer.innerHTML = ""; // Clear previous news
            const seenUrls = new Set();
            newsData.forEach(article => {
                if (!article.image || !article.url || !article.title) return;
                const uniqueIdentifier = `${article.url}-${article.title}`;
                if (seenUrls.has(uniqueIdentifier)) return;
                seenUrls.add(uniqueIdentifier);

                const newsItem = document.createElement("div");
                newsItem.classList.add("news-item");
                newsItem.innerHTML = `
                    <img src="${article.image}" alt="News Image" class="news-image">
                    <div class="news-content">
                        <a href="${article.url}" target="_blank">
                            <h3 class="news-title">${article.title}</h3>
                        </a>
                        <p class="news-description">${article.description}</p>
                        <p class="news-meta">By ${article.author || "Unknown"} | ${new Date(article.published_at).toLocaleString()}</p>
                    </div>
                `;
                newsContainer.appendChild(newsItem);
            });

            // Handle Weather Data
            const weatherData = aggregatedData.weather;
            weatherContainer.innerHTML = `
                <p class="weather-info">${weatherData.city}: ${weatherData.temperature}°C</p>
                <p class="weather-description">${weatherData.description}</p>
            `;

            // Handle Holiday Data
            const holidayData = aggregatedData.holidays;
            holidayContainer.innerHTML = ""; // Clear previous holidays
            if (holidayData.length === 0) {
                holidayContainer.innerHTML = "<p>No upcoming holidays found for this country.</p>";
            }
            holidayData.forEach(holiday => {
                const holidayItem = document.createElement("div");
                holidayItem.classList.add("holiday-item");
                holidayItem.innerHTML = ` 
                    <h4 class="holiday-name">${holiday.name}</h4>
                    <p class="holiday-date">${new Date(holiday.date.iso).toLocaleDateString()}</p>
                `;
                holidayContainer.appendChild(holidayItem);
            });

        } catch (error) {
            console.error("Error fetching aggregated data:", error);
            newsContainer.innerHTML = "<p>Failed to load data.</p>";
            weatherContainer.innerHTML = "<p>Failed to load weather.</p>";
            holidayContainer.innerHTML = "<p>Failed to load holidays.</p>";
        }
    }

    // Fetch Weather Data
    async function fetchWeather() {
        const city = cityInput.value.trim() || "Oshawa"; // Default to Oshawa
        const timeOption = timeSelect.value;

        let weatherAPI;
        if (timeOption === "current") {
            weatherAPI = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`;
        } else if (timeOption === "forecast") {
            weatherAPI = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${WEATHER_API_KEY}&units=metric`;
        }

        try {
            const response = await fetch(weatherAPI);
            if (!response.ok) throw new Error("Failed to fetch weather");

            const weatherData = await response.json();

            if (timeOption === "current") {
                const roundedTemp = Math.round(weatherData.main.temp);
                weatherContainer.innerHTML = `
                    <p class="weather-info">${weatherData.name}: ${roundedTemp}°C</p>
                    <p class="weather-description">${weatherData.weather[0].description}</p>
                `;
            } else if (timeOption === "forecast") {
                const forecast = weatherData.list[0]; 
                const roundedTemp = Math.round(forecast.main.temp);
                weatherContainer.innerHTML = `
                    <p class="weather-info">${weatherData.city.name}: ${roundedTemp}°C</p>
                    <p class="weather-description">${forecast.weather[0].description}</p>
                    <p class="weather-meta">Forecast for ${forecast.dt_txt}</p>
                `;
            }

        } catch (error) {
            console.error("Error fetching weather:", error);
            weatherContainer.innerHTML = "<p>Failed to load weather.</p>";
        }
    }


    // Fetch Holiday Data 
    async function fetchHolidays() {
        const country = countryInput.value.trim().toUpperCase(); // Get country code

        // Check if country code is entered
        if (!country) {
            holidayContainer.innerHTML = "<p>Please enter a valid country code (e.g., US, CA, VN).</p>";
            return;
        }

        const currentDate = new Date();
        const endDate = new Date(currentDate);
        endDate.setMonth(currentDate.getMonth() + 2); // Set end date 2 months from now

        const year = new Date().getFullYear(); 
        const holidayAPI = `https://calendarific.com/api/v2/holidays?api_key=${HOLIDAY_API_KEY}&country=${country}&year=${year}`;

        try {
            const response = await fetch(holidayAPI);
            if (!response.ok) throw new Error("Failed to fetch holidays");

            const { response: { holidays } } = await response.json();
            holidayContainer.innerHTML = ""; // Clear previous holidays

            // Filter holidays for the next 2 months only
            const filteredHolidays = holidays.filter(holiday => {
                const holidayDate = new Date(holiday.date.iso);
                return holidayDate >= currentDate && holidayDate <= endDate; 
            });

            // Remove duplicate holidays based on holiday name and date
            const uniqueHolidays = [];
            const seen = new Set();

            filteredHolidays.forEach(holiday => {
                const holidayIdentifier = `${holiday.name}-${holiday.date.iso}`;
                if (!seen.has(holidayIdentifier)) {
                    seen.add(holidayIdentifier);
                    uniqueHolidays.push(holiday);
                }
            });

            // Display holidays
            if (uniqueHolidays.length === 0) {
                holidayContainer.innerHTML = "<p>No upcoming holidays found for this country in the next 2 months.</p>";
            }

            uniqueHolidays.forEach(holiday => {
                const holidayItem = document.createElement("div");
                holidayItem.classList.add("holiday-item");

                holidayItem.innerHTML = `
                    <h4 class="holiday-name">${holiday.name}</h4>
                    <p class="holiday-date">${new Date(holiday.date.iso).toLocaleDateString()}</p>
                `;

                holidayContainer.appendChild(holidayItem);
            });

        } catch (error) {
            console.error("Error fetching holidays:", error);
            holidayContainer.innerHTML = "<p>Failed to load holidays.</p>";
        }
    }

    // Event Listeners for Fetching Data
    fetchWeatherButton.addEventListener("click", fetchWeather);
    fetchHolidaysButton.addEventListener("click", fetchHolidays);

    // Load aggregated data on page load
    fetchAggregatedData();
});
