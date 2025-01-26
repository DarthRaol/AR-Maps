//linking road, mount mary, Carter road and main spot 72.82381059620167,19.14447093225438curr
var narkerIndex;
var currentTolerance = 0.00004;
var invalidLocations = [[72.83319, 19.06456], [72.82231, 19.04669], [72.82182, 19.05925], [72.83442, 19.06039]]

const allAudio = [new Audio('../audio/intro.wav')]


const hotcold = document.getElementById("HotColdIndicator");
if(hotcold)
    hotcold.style.display = 'none';

mapboxgl.accessToken = 'pk.eyJ1IjoiZmFraHIiLCJhIjoiY2pseXc0djE0MHBibzN2b2h4MzVoZjk4aSJ9.ImbyLtfsfSsR_yyBluR8yQ';

const map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/light-v11', //hosted style id //default mapbox://styles/mapbox/streets-v12
    center: [72.8840, 19.0753], // starting position 19.075391698025193, 72.88401152026877
    zoom: 10, // starting zoom
    minZoom: 10 // keep it local
});

const mapElement = document.getElementById("parentmap");
mapElement.addEventListener('click', () => {
    // if (mapElement.requestFullscreen) {
    //     mapElement.requestFullscreen();
    //   } else if (mapElement.mozRequestFullScreen) { // Firefox
    //     mapElement.mozRequestFullScreen();
    //   } else if (mapElement.webkitRequestFullscreen) { // Safari and Chrome
    //     mapElement.webkitRequestFullscreen();
    //   } else if (mapElement.msRequestFullscreen) { // IE/Edge
    //     mapElement.msRequestFullscreen();
    //   }    

    const allNonScreenItem = document.getElementsByClassName("fullscreen");

    for (let index = 0; index < allNonScreenItem.length; index++) {
        const element = allNonScreenItem[index];
            element.style.display = 'none';
    }
    
    mapElement.style.height = '90vh';
    mapElement.style.width = '100wh'
    map.resize();
    //PlayAudio(0);
});

if (navigator.geolocation) 
{
    navigator.geolocation.getCurrentPosition(
        function(position) 
        {
            var currentUserLocation = [position.coords.longitude, position.coords.latitude];
            //invalidLocations.push(currentUserLocation);
        },
        function (e) 
        {
            console.log("1 " + e.message);

        }, 
        {
            enableHighAccuracy: true
        }
    )
};

//User marker style
const mainMarkerIcon = document.createElement('div');
mainMarkerIcon.className = 'marker';
mainMarkerIcon.style.backgroundImage = `url('../img/currentLocation.png')`;
mainMarkerIcon.style.width = `60px`;
mainMarkerIcon.style.height = `60px`;
mainMarkerIcon.style.backgroundSize = '100%';

var locationDiv = []
for(let i = 0; i < 4; i++)
{
    locationMarker = document.createElement('div');
    locationMarker.className = 'marker';
    locationMarker.style.backgroundImage = `url('../img/logo.png')`;
    locationMarker.style.width = `60px`;
    locationMarker.style.height = `60px`;
    locationMarker.style.backgroundSize = '100%';
    locationDiv.push(locationMarker);
}

//make a marker for each feature and add to the map
const currentUserMarker = new mapboxgl.Marker(mainMarkerIcon)
.setLngLat([0, 0])
.addTo(map);
    
const mainMarker = new mapboxgl.Marker(locationDiv[0])
.setLngLat([72.83442962698251, 19.06039440629186]) // main
.addTo(map);

locationDiv[0].addEventListener('click', () => {
    directions.setDestination([72.83442962698251, 19.06039440629186]);
    DisableMarkers(0);
});

const mountMaryMarker = new mapboxgl.Marker(locationDiv[1])
.setLngLat([72.8223198538909, 19.04669575360127]) // Marker in Mount Mary
.addTo(map);

locationDiv[1].addEventListener('click', () => {
    DisableMarkers(1);
    directions.setDestination([72.8223198538909, 19.04669575360127]);
});

const linkingRoadMarker = new mapboxgl.Marker(locationDiv[2])
.setLngLat([72.83319865767248, 19.064565201862816]) // Marker in linking road
.addTo(map);

locationDiv[2].addEventListener('click', () => {
    DisableMarkers(2);
    directions.setDestination([72.83319865767248, 19.064565201862816]);
});

const carterRoadMarker = new mapboxgl.Marker(locationDiv[3])
.setLngLat([72.82182527116375, 19.05925964768773]) // Marker in carter road
.addTo(map);

locationDiv[3].addEventListener('click', () => {
    DisableMarkers(3);
    directions.setDestination([72.82182527116375, 19.05925964768773]);
});

const directions = new MapboxDirections({
accessToken: mapboxgl.accessToken,
unit: 'metric', // Units: 'imperial' or 'metric'
profile: 'mapbox/driving', // Routing profile: driving, walking, cycling
addMarkers: false, // Disable the start and end markers
interactive: false
});
map.addControl(directions, 'top-left');
const directionsContainer = document.querySelector('.mapboxgl-ctrl-directions');
directionsContainer.style.display = "none";

// Wait for the map to load
map.on('load', () => {
    // Listen for when a route is rendered
    directions.on('route', () => {
        const routeLayerId = 'directions-route-line'; // Layer for the inner route line

        // Check if the layer exists and update its properties
        if (map.getLayer(routeLayerId)) {
        map.setPaintProperty(routeLayerId, 'line-color', '#D3D3D3'); // Set route color
        map.setPaintProperty(routeLayerId, 'line-width', 5); // Optional: Adjust route width
        }

        const casingLayerId = 'directions-route-line-casing'; // Layer for the outer casing

        // Optionally customize the casing layer too
        if (map.getLayer(casingLayerId)) {
        map.setPaintProperty(casingLayerId, 'line-color', '#A9A9A9'); // Set casing color
        map.setPaintProperty(casingLayerId, 'line-width', 8); // Adjust casing width
        }

        const DirectionId = 'directions-origin-point'; // Layer for the outer casing

        // Optionally customize the casing layer too
        if (map.getLayer(DirectionId)) {
            map.setLayoutProperty('directions-origin-point', 'visibility', 'none');
            map.setLayoutProperty('directions-destination-point', 'visibility', 'none');
        }
    });
});

GetUserLocation();

function GetUserLocation(){
    // do whatever you like here


    if (navigator.geolocation) 
    {
        navigator.geolocation.getCurrentPosition(
            (position) => 
            {
                var currentUserLocation = [position.coords.longitude, position.coords.latitude];
                currentUserMarker.setLngLat(currentUserLocation);
                directions.setOrigin(currentUserLocation); //19.082685132964084, 72.91854103288533

                console.log(currentUserLocation + "curr is ");
                hasReached(currentUserLocation[0], currentUserLocation[1], 0.00001)
                ClosureToStore(currentUserLocation[0], currentUserLocation[1], currentTolerance)

                map.flyTo(
                {
                    center: [72.8840, 19.0753], 
                    zoom: 10,
                    speed:0.1
                });
            }
        )

        

    };

    setTimeout(GetUserLocation, 5000);
}

function hasReached(currentLat, currentLng, tolerance = 0.0001) 
{
    invalidLocations.forEach(location => 
    {
        // Compare current coordinates with target coordinates within the tolerance
        const latDiff = Math.abs(currentLat - location[0]);
        const lngDiff = Math.abs(currentLng - location[1]);

        if (latDiff <= tolerance && lngDiff <= tolerance) 
        {
            if(location == [72.83442, 19.06039])
            {
                console.log("You have reached the main target location!");
                document.getElementById("CorrectLocationModal").style.display = 'block';
                return true;
            }
            console.log("You have reached the invalid target location!");
            document.getElementById("WrongLocationModal").style.display = 'block';
            return true;
        }
        else 
        {
            console.log("You have not reached the target location.");
            return false;
        }
    });
    
}

function ClosureToStore(currentLat, currentLng, tolerance) 
{
    const latDiff = Math.abs(currentLat - 72.83442);
    const lngDiff = Math.abs(currentLng - 72.83442);

    if (latDiff <= tolerance && lngDiff <= tolerance) 
    {
        hotcold.style.display = 'block';
        currentTolerance = latDiff;
        hotcold.children[0].classList.remove('Cold');
        hotcold.children[0].classList.add('Hot')
    }
    else if (latDiff >= tolerance && lngDiff >= tolerance && latDiff <= tolerance + 0.00001 && lngDiff <= tolerance + 0.00001) 
    {
        hotcold.style.display = 'block';
        hotcold.children[0].classList.remove('Hot');
        hotcold.children[0].classList.add('Cold')
    }
    else
    {
        hotcold.style.display = 'none';
    }
}

function DisableMarkers(index)
{
    narkerIndex = index;
    for (let i = 0; i < locationDiv.length; i++) {
        if(i != index)
        {
            locationDiv[i].style.display = 'none';
        }
        locationDiv[index].style.backgroundImage = `url('../img/logo-greyed.png')`;
        locationDiv[index].onclick = 'none';
        
    }
}

function EnableMarkers()
{
    for (let i = 0; i < locationDiv.length; i++) {
            locationDiv[i].style.display = 'block';
    }
}
document.getElementsByClassName('retryBtn')[0].addEventListener('click', () => {
    EnableMarkers();
    document.getElementById("WrongLocationModal").style.display = 'none';
});

document.getElementsByClassName('ar-start')[0].addEventListener('click', () => {
    window.location.href = 'https://darthraol.github.io/AR-Maps/pages/Intro.html';
});

function generate4DigitCode(input) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash = hash & hash; 
  }

  const code = Math.abs(hash).toString().slice(-4).padStart(4, "0");
  console.log("code is " + code);

  return code;
}

function PlayAudio(index)
{
    allAudio[index].play();
    console.log("called");
}


