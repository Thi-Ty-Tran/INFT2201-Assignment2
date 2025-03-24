# Weather & News Dashboard

This project provides a web dashboard that aggregates data from multiple publicly available APIs. The dashboard displays the latest news, weather information, and upcoming holidays. It consists of two main components:

- A **Backend Service** built with Django that consumes data from public APIs and serves it through a RESTful API.
- A **Frontend Service** built with HTML, CSS, and JavaScript that presents the aggregated data in a visually appealing dashboard.

The project is containerized using Docker and orchestrated with Docker Compose for scalability.

---

## Features

- **Latest News**: Displays the latest news fetched from a news API.
- **Weather Information**: Fetches current data for a specified city.
- **Upcoming Holidays**: Displays upcoming holidays based on a country code.
- **Responsive Design**: The dashboard is designed to be responsive for both desktop and mobile devices.

---

## Prerequisites

Before running the project, ensure that you have the following installed:

- **Docker**: [Install Docker](https://www.docker.com/get-started)
- **Docker Compose**: [Install Docker Compose](https://docs.docker.com/compose/install/)

---

## Project Setup

### 1. Clone the Repository

Clone this repository to your local machine:

```bash
git clone https://github.com/Thi-Ty-Tran/INFT2201-Assignment2.git
```
```bash
cd weather-news-holidays-dashboard
```

### 2. Build and Start Services
From the project root directory, run the following command:

```bash
docker-compose up --build
```
This command will:

- Build the backend (Django API) and frontend (Dashboard) Docker images.

- Start both services and make them available on the following ports:

    - **Backend (Django API)**: http://localhost:8000

    - **Frontend (Dashboard)**: http://localhost:8080

### 3. Access the Dashboard

Once the services are up and running, open your browser and navigate to http://localhost:8080 to access the weather and news dashboard.