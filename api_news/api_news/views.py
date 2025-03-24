from rest_framework.response import Response
from rest_framework.views import APIView
import requests

class AggregatedDataView(APIView):
    def get(self, request):
        # News API
        news_api_url = "https://api.mediastack.com/v1/news"
        news_access_key = "6e8f40f862fb923889faf4d4b719933c"
        news_params = {
            "access_key": news_access_key,
            "countries": "ca",
            "limit": 20,
            "offset": 2
        }
        news_response = requests.get(news_api_url, params=news_params)
        news_data = None
        if news_response.status_code == 200:
            news_data = news_response.json()
        else:
            return Response({"error": "Failed to fetch news"}, status=news_response.status_code)

        # Weather API
        weather_api_key = "47d4843a458bfbd7c96feadea3765ebc"
        city = "Oshawa"  # Default city
        weather_api_url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={weather_api_key}&units=metric"
        weather_response = requests.get(weather_api_url)
        weather_data = None
        if weather_response.status_code == 200:
            weather_data = weather_response.json()
        else:
            return Response({"error": "Failed to fetch weather"}, status=weather_response.status_code)

        # Holiday API
        holiday_api_key = "rKCC91TKVyqwL6fofBu9xED1hdttCj0X"
        country = "CA"  # Default country
        holiday_api_url = f"https://calendarific.com/api/v2/holidays?api_key={holiday_api_key}&country={country}&year=2025"
        holiday_response = requests.get(holiday_api_url)
        holiday_data = None
        if holiday_response.status_code == 200:
            holiday_data = holiday_response.json().get('response', {}).get('holidays', [])
        else:
            return Response({"error": "Failed to fetch holidays"}, status=holiday_response.status_code)

        # Aggregate the data into a single response
        aggregated_data = {
            "news": news_data.get('data', []),
            "weather": {
                "city": weather_data.get("name", ""),
                "temperature": weather_data.get("main", {}).get("temp", ""),
                "description": weather_data.get("weather", [{}])[0].get("description", ""),
            },
            "holidays": holiday_data,
        }

        return Response(aggregated_data)

