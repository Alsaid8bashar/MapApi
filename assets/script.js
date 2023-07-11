const GEOCODING_API_KEY = 'VwLHskq3W+MM/YD51fJqLg==9TPHL4XBmXFzpjZE';

function initMap() {
  const map = createMap();
  const marker = createMarker(map);

  createAutocomplete();

  document.getElementById('searchForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const city = document.getElementById('cityInput').value;
    showSpinner();
    getGeoCoding(city)
      .then((location) => {
        hideSpinner();
        updateMap(map, marker, location);
      })
      .catch((error) => {
        hideSpinner();
        console.error(error);
        alert('No results found for the entered city.');
      });
  });
}

function createMap() {
  return new google.maps.Map(document.getElementById('map'), {
    zoom: 1,
    center: { lat: 0, lng: 0 }
  });
}

function createMarker(map) {
  return new google.maps.Marker({
    map: map,
    animation: google.maps.Animation.DROP
  });
}

function createAutocomplete() {
  const input = document.getElementById('cityInput');
  const options = {
    types: ['(cities)']
  };
  const autocomplete = new google.maps.places.Autocomplete(input, options);
  autocomplete.setFields(['geometry']);
  return autocomplete;
}

function updateMap(map, marker, location) {
  map.setCenter(location);
  map.setZoom(10);
  marker.setPosition(location);
  marker.setMap(map);
}

async function getGeoCoding(city) {
  try {
    const response = await fetch(`https://api.api-ninjas.com/v1/geocoding?city=${city}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': GEOCODING_API_KEY
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
