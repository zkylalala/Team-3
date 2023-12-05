let url1 = "https://api.openweathermap.org/data/2.5/weather?lat=";
let baseLat = "49.2827";
let url2 = "&lon="
let baseLon = "-123.1207";
let unit = "&units=metric"
let url3 = "&appid=";
let apiKey = "8ed42ab210b1eb192ef8b12506a7e2e2";
let weatherDescription;
let curWeather ="";
let curLoc;
let curTemp;
let curBody;
let curhumid;
let curWind;

function setup() {
  getUserLocation();

  loadJSON(url1 + baseLat + url2 + baseLon + unit + url3  + apiKey, getData);

  var input = document.getElementById('locationSearch');
  input.addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
          event.preventDefault(); // Prevent the default action to stop form submission
          searchLocation(); // Call the search function
      }
  });
}

function getColorForTemperature(temp) {
    if (temp > 25) {
        return "orange"; 
    } else if (temp >= 5 && temp <= 25) {
        return "yellow"; // yellow for temp between 5 and 25
    } else {
        return "blue"; // Blue for temp under 5
    }
}


function draw() {
    background(255); // Clear the background (white)
}


var myMap = L.map("map").setView([49.2827, -123.1207], 10);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 20,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(myMap);

var pointsOfInterest = [
    { lat: 49.2405, lon: -123.1124, description: "Queen E" },
    { lat: 49.2602, lon: -123.2501, description: "UBC" },
    { lat: 49.2817, lon: -123.1203, description: "DT Vancouver" },
    { lat: 49.2359, lon: -122.9753, description: "Deer Lake Park" },
    { lat: 49.1929, lon: -123.1770, description: "YVR" },
    { lat: 49.1233, lon: -123.1852, description: "Fisherman's wharf" },
    { lat: 49.3056, lon: -123.1399, description: "Stanely Park" },
    { lat: 49.3477, lon: -123.1159, description: "Capilano Park" },
    // ... more points of interest
];

pointsOfInterest.forEach(function (poi) {
    var marker = L.marker([poi.lat, poi.lon]).addTo(myMap);
    marker.bindPopup(poi.description);
  
    // Add a click event listener to each marker
    marker.on('click', function (e) {
      // Update baseLat and baseLon to the clicked location
      baseLat = e.latlng.lat;
      baseLon = e.latlng.lng;
  
      // Fetch weather data for the clicked location
      loadJSON(url1 + baseLat + url2 + baseLon + unit + url3 + apiKey, function(data) {
        // Update weather information
        curLoc = poi.description;
        curTemp = data.main.temp;
        curWeather = data.weather[0].description;
  
        // Update the marker's popup content
        marker.getPopup().setContent('Current Weather: ' + curWeather + '<br>Location: ' + poi.description + '<br>Temperature: ' + curTemp.toFixed(2) + '°C');
        getData(data);
    });
    });
  });


function getData(data) {
  weatherDescription = data.weather[0].description;
 
  curWeather = data.weather[0].description;
  curLoc = data.name;
  curTemp = data.main.temp;
  curBody = data.main.feels_like;
  curhumid = data.main.humidity;
  curWind = data.wind.speed;
  document.getElementById("weather").textContent = curWeather.toUpperCase();
  document.getElementById("location").textContent = curLoc.toUpperCase();
  document.getElementById("temp").textContent = curTemp;
  document.getElementById("bodytemp").textContent = curBody;
  document.getElementById("humid").textContent = curhumid;
  document.getElementById("wind").textContent = curWind;

  var tempDot = document.getElementById("temp-dot");
  tempDot.style.backgroundColor = getColorForTemperature(curBody);
}

function getUserLocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        baseLat = position.coords.latitude;
        baseLon = position.coords.longitude;
  
        myMap.setView([baseLat, baseLon], 10);
        loadJSON(url1 + baseLat + url2 + baseLon + unit + url3 + apiKey, getData);
      }, function() {
        console.error("Geolocation is not supported or permission denied");
        // Handle the error or use default location
      });
    } else {
      console.error("Geolocation is not available in this browser");
      // Handle the absence of geolocation
    }
  }

function searchLocation() {
    let searchQuery = document.getElementById('locationSearch').value;
    let mapboxApi = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
    let mapboxAccessToken = "pk.eyJ1Ijoiemt5bGVsZWxlIiwiYSI6ImNscGc4YjhheDFpeHEycW5sbzB2ZWEwaWsifQ.v4zCH6Qs8lhlLR_srCW62w"; 

    fetch(`${mapboxApi}${encodeURIComponent(searchQuery)}.json?access_token=${mapboxAccessToken}`)
        .then(response => response.json())
        .then(data => {
            if (data.features && data.features.length > 0) {
                let lat = data.features[0].center[1];
                let lng = data.features[0].center[0];

                myMap.setView([lat, lng], 10); // Move the map to the searched location

                // Update weather for the new location
                updateWeatherForLocation(lat, lng); 
            } else {
                alert("Location not found");
            }
        })
        .catch(error => {
            console.error("Error fetching location data: ", error);
            alert("Error fetching location data");
        });
}

function updateWeatherForLocation(lat, lng) {
    loadJSON(url1 + lat + url2 + lng + unit + url3 + apiKey, getData);
}

function updateWeatherForLocation(lat, lng) {
    loadJSON(url1 + lat + url2 + lng + unit + url3 + apiKey, getData);
}


  myMap.on('click', e => {
   //alert("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng)
    myMap.setView([e.latlng.lat,e.latlng.lng])
    baseLat = e.latlng.lat
    baseLon = e.latlng.lng;
    loadJSON(url1 + baseLat + url2 + baseLon + unit + url3 + apiKey, getData);
    
    var popup = L.popup()
    .setLatLng(e.latlng)
    .setContent('Current Weather: ' + curWeather + '<br>Location: ' + curLoc + '<br>Temperature: ' + curTemp + '°C')
    .openOn(myMap);

});
