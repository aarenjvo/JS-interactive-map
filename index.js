// Things we need to do: 
// Create the Leaflet map [x]
// Get the user's location [x]
// Get nearby locations of business types [x]
// After a category is selected and the user clicks search (addEventListener) [x]
// Make a fetch request to the foursquare api [x]
// use the place searcch method [x]
// specify latitude, longitude, categories, and sort [x]
// Programmatically render a list of results
// Map the locations on the map

// const express = require('express');
// require('dotenv').config();

// console.log(process.env)
// console.log('hellooo')

let selectEl = document.querySelector('select')
let listEl = document.querySelector('ul')
let marker = null
let currentPosition = null

const myIcon = L.icon({
    iconUrl: './public/assets/red-pin.png',
    iconSize: [38, 38],
    iconAnchor: [16, 38],
    popupAnchor: [0, -38]
})

let map = L.map('map').setView([32.715, -117.16], 13)
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

navigator.geolocation.getCurrentPosition((position) => {
    // position = (coords = (latitude, longitude, accuracy))
    let { coords: { latitude, longitude } } = position
    console.log('It works!', [latitude, longitude])
    // store my location within a variable to use outside of this scope
    currentPosition = { latitude, longitude }
    map.setView([latitude, longitude])
    // create marker with custom icon
    marker = L.marker([latitude, longitude], { icon: myIcon }).addTo(map)
    marker.bindPopup('<p1><b>North Park, San Diego</b></p1>').openPopup()
    console.log(marker.toGeoJSON())
}, (error) => {
    console.log(error)
})


// find latitude & longitude of any location that is clicked
function onMapClick(e) {
    alert(e.latlng)
}
map.on('click', onMapClick);

document.querySelector('button').addEventListener('click', (event) => {
    const categoryID = selectEl.value

    // Check if currentPosition is available
    if (!currentPosition) {
        console.log('Current position not available')
        return
    } else {
        console.log('Current position is available')
    }

    const latitude = currentPosition.latitude
    const longitude = currentPosition.longitude
    console.log(latitude)
    console.log(longitude)

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'fsq3gsdNEi8KDUB6dQcdt1hckFwdkhYA+2uYnsH8nY3MVYc='
        }
    };

    fetch(`https://api.foursquare.com/v3/places/search?categories=${categoryID}&ll=${latitude},${longitude}&sort=DISTANCE&limit=5`, options)
        .then(response => response.json())
        .then(({ results }) => {
            console.log(results)
            listEl.innerHTML = ''
            // we are destructuring the parsed json response object
            // results = [(name, location, distance), ...]

            // Create markers for each business
            // Iterate over each business result

            // Remove existing markers
            map.eachLayer(layer => {
                if (layer instanceof L.Marker) {
                    map.removeLayer(layer);
                    console.log('layer removed!')
                }
            });

            // Programmatically render a list of results
            // Map the locations on the map
            // Create list elements and append to ul

            const locationsArray = []

            for (let i = 0; i < results.length; i++) {
                results[i]
                const listItem = document.createElement('li')
                listItem.textContent = results[i].name
                listEl.append(listItem)
                const lat = results[i].geocodes.main.latitude
                const lng = results[i].geocodes.main.longitude
                console.log(lat, lng)
                const location = { lat, lng }
                locationsArray.push(location)
                console.log(location)
                L.marker([lat, lng]).addTo(map)
                L.polygon([locationsArray]).addTo(map)
            }

        })
        .catch(err => console.error(err));
})