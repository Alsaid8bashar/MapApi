let regex = /^[A-Za-z\s\-']+$/;
const GEOCODING_API_KEY = 'VwLHskq3W+MM/YD51fJqLg==9TPHL4XBmXFzpjZE';


function initMap() {
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 1,
    center: { lat: 0, lng: 0 }
  });

  const marker = new google.maps.Marker({
    map: map,
    animation: google.maps.Animation.DROP
  });

  document.getElementById('searchForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const city = document.getElementById('cityInput').value;
    if (validateCityName(city)) {
      showSpinner();
      getGeoCoding(city)
        .then((location) => {
          hideSpinner();
          map.setCenter(location);
          map.setZoom(10);
          marker.setPosition(location);
          marker.setMap(map);
        }).catch((error) => {
          hideSpinner();
          alert('No results found for the entered city.');
        });
    }
  });
}

async function getGeoCoding(city) {
  try {
    const response = await fetch(`https://api.api-ninjas.com/v1/geocoding?city=${city}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": GEOCODING_API_KEY
      },
    });

    const data = await response.json();
    if (data.length > 0) {
      const result = data[0];
      console.log(data);
      return { lat: result.latitude, lng: result.longitude };
    } else {
      throw new Error('No results found for the entered city.');
    }
  } catch (error) {
    console.log(error);
    throw new Error('Failed to fetch geocoding data from the API.');
  }
}

function showSpinner() {
  document.getElementById('spinner').style.display = 'block';
}

function hideSpinner() {
  document.getElementById('spinner').style.display = 'none';
}

function validateCityName(city) {
  if (regex.test(city)) {
    return true;
  }
  else {
    alert('Invalid city name.');
    return false;
  }
}