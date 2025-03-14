var closestDistance = 40;
var calledIntro = false;
var locationReached = false;
var enteredHot = false;
var canHotCold = false;
var enteredCloseRadius = false;

var currentLocationToReach;

// main //Otters Club // Link road //  Mount mery 
var invalidLocations = [[72.9080753, 19.0864769]]

const audioSource = document.getElementById("AudioSource");

const hotcold = document.getElementById("HotColdIndicator");
hotcold.style.display = 'none';

mapboxgl.accessToken = 'pk.eyJ1IjoiZmFraHIiLCJhIjoiY2pseXc0djE0MHBibzN2b2h4MzVoZjk4aSJ9.ImbyLtfsfSsR_yyBluR8yQ';

function success(pos) {
    var coordinates = pos.coords;
    console.log(
      `Your location is: ${coordinates.latitude}} ${coordinates.longitude}`
    );
  }
  
  function error(error) {
    console.warn(`Error: ${error.message}`);
  }
  
  if ("permissions" in navigator) {
    navigator.permissions.query({
      name: "geolocation"
    }).then((result) => {
      if (result.state === "granted") {
        console.log("granted");
      } else if (result.state === "denied") {
        console.log("denial");
      } else {
        navigator.geolocation.getCurrentPosition(success, error, {
          timeout: 4000,
          maximumAge: 0
        });
      }
    });
  }
    
const map = new mapboxgl.Map({
    container: 'map', 
    style: 'mapbox://styles/mapbox/light-v11',
    //19.160340, 72.946439
    center: [72.946439, 19.160340],
    zoom: 11,
    minZoom: 10
});

const mapElement = document.getElementById("parentmap");
mapElement.addEventListener('click', () => {  
    GetUserLocation();
    const allNonScreenItem = document.getElementsByClassName("fullscreen");

    for (let index = 0; index < allNonScreenItem.length; index++) {
        const element = allNonScreenItem[index];
            element.style.display = 'none';
    }
    
    mapElement.style.height = '80vh';
    mapElement.style.width = '100wh'
    map.resize();

    if(!calledIntro)
    {
        PlayAudio("/audio/Intro.wav"); // add personal intro
        calledIntro = true;
    }
});



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
    locationMarker.style.backgroundImage = `url('../img/Loc.png')`;
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
.setLngLat(invalidLocations[0]) // main
.addTo(map);

locationDiv[0].addEventListener('click', () => {
    directions.setDestination(invalidLocations[0]);
    DisableMarkers(0);
    canHotCold = true;
});



function removeDefaultMarkers() {
    console.log("called on clock");
    const markers = document.querySelectorAll('.mapboxgl-marker');
    markers.forEach(marker => {
        if (marker.innerHTML.includes('A') || marker.innerHTML.includes('B')) {
            marker.style.display = 'none'; // Hides the marker
        }
    });
}

const directions = new MapboxDirections({
    accessToken: mapboxgl.accessToken,
    unit: 'metric', // Units: 'imperial' or 'metric'
    profile: 'mapbox/driving', // Routing profile: driving, walking, cycling
    addMarkers: false, // Disable the start and end markers
    interactive: false,
    marker: false, // Disable default A & B markers
    flyTo: false // Disables automatic panning to fit the route
    }
);

directions.on('origin', () => {
    map.jumpTo({ center: map.getCenter(), zoom: map.getZoom() });
});

map.addControl(directions, 'top-left');
const directionsContainer = document.querySelector('.mapboxgl-ctrl-directions');
directionsContainer.style.display = "none";
                
//directions.setOrigin([72.8840, 19.0753]); //19.082685132964084, 72.91854103288533

directions.on('route', (event) => {
    if (event.route.length) {
        setTimeout(removeDefaultMarkers, 500); // Delay to ensure markers are rendered before removal
        console.log("on route")
    }
});
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
            map.setLayoutProperty('directions-destination-label', 'visibility', 'none');
            map.setLayoutProperty('directions-origin-label', 'visibility', 'none');
        }
    });
});

function GetUserLocation(){
    if ('geolocation' in navigator) {
        navigator.geolocation.watchPosition(
            (position) => 
            {
                const currentUserLocation = [position.coords.longitude, position.coords.latitude];
                currentUserMarker.setLngLat(currentUserLocation);
                directions.setOrigin(currentUserLocation); //19.082685132964084, 72.91854103288533

                //invalidLocations.push(currentUserLocation);

                if(canHotCold)
                {
                    ClosureToStore(currentUserLocation[0], currentUserLocation[1])
                }
                
                if(locationReached)
                {
                    hasReached(currentUserLocation[0], currentUserLocation[1])
                }

                // map.flyTo({
                //     center: [72.8840, 19.0753], // New center coordinates
                //     zoom: 10, // starting zoom
                //     speed: 1.2,                    // Animation speed (default: 1.2)
                //   }); 
                console.log(currentUserLocation + " curr is after");

            },
            (error) => {
              console.error('Error getting location:', error);
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0,
            }
        )
    }
    else {
        console.error('Geolocation is not available in this browser.');
      };

    setTimeout(GetUserLocation, 3000);
}
// Function to check if user reached target location
function checkProximity(userCoords, targetLocation) {
    const userPoint = turf.point(userCoords);
    const targetPoint = turf.point(targetLocation);
    const distance = turf.distance(userPoint, targetPoint, { units: 'meters' });

    console.log(`Distance to target: ${distance.toFixed(2)} meters`);

    return distance.toFixed(2);
}

function hasReached(currentLat, currentLng) 
{
        var currDistance = checkProximity([currentLat, currentLng], currentLocationToReach);
        
        if(currDistance < 20 && currentLocationToReach === invalidLocations[0])
        {
            locationReached = false;
            console.log("You have reached the main target location!");
            document.getElementById("CorrectLocationModal").style.display = 'block';
            //PlayAudio("../audio/CorrectLocation.wav");
            return true;
        }

        else if(currDistance < 150)
        {
            locationReached = false;
            console.log("You have reached the main target location!");
            document.getElementById("CorrectLocationModal").style.display = 'block';
            //PlayAudio("../audio/CorrectLocation.wav");
            return true;
        }
        else 
        {
            console.log("You have not reached the target location.");
            return false;
        }

        // // Compare current coordinates with target coordinates within the tolerance
        // const latDiff = Math.abs(currentLat - location[0]);
        // const lngDiff = Math.abs(currentLng - location[1]);

        // if (latDiff <= tolerance && lngDiff <= tolerance) 
        // {
        //     if(location[0] === 72.85544183423875 && location[1] === 19.257752987325663)
        //     {
        //         console.log("You have reached the main target location!");
        //         document.getElementById("CorrectLocationModal").style.display = 'block';
        //         PlayAudio("../audio/CorrectLocation.wav");
        //         return true;
        //     }
        //     console.log("You have reached the invalid target location!");
            
        //     document.getElementById("WrongLocationModal").style.display = 'block';
        //     switch(invalidCount)
        //     {
        //         case 0:
        //             PlayAudio("../audio/WrongLocation.wav");
        //             invalidCount++;
        //             break;
        //         case 1:
        //             PlayAudio("../audio/WrongLocation2.wav");
        //             invalidCount++;
        //             break;
        //         case 2:
        //             PlayAudio("../audio/WrongLocation.wav");
        //             invalidCount++;
        //             break;
        //         default:
        //             PlayAudio("../audio/WrongLocation.wav");
        //             invalidCount = 0;
        //             break;
        //     }
        //     return true;
        // }
        // else 
        // {
        //     console.log("You have not reached the target location.");
        //     return false;
        // }    
}

function ClosureToStore(currentLat, currentLng) 
{
    var currDistance = checkProximity([currentLat, currentLng], invalidLocations[0]);

    if(currDistance <= 100 && !enteredCloseRadius)
    {
        enteredCloseRadius = true;
        //PlayAudio("../audio/almostthere.wav");
    }

    if(closestDistance >= currDistance)
    {
        enteredHot = true;
        closestDistance = currDistance;
        hotcold.style.display = 'block';
        hotcold.children[0].classList.remove('Cold');
        hotcold.children[0].classList.add('Hot');
        canHotCold = false;
        setTimeout(() => {canHotCold = true;
            hotcold.style.display = 'none';
        }, 15000);
        //PlayAudio("../audio/hot.wav");
    }
    else if(closestDistance <= currDistance && currDistance <= 80 && enteredHot)
    {
        closestDistance = currDistance;
        hotcold.style.display = 'block';
        hotcold.children[0].classList.remove('Hot');
        hotcold.children[0].classList.add('Cold');
        canHotCold = false;
        setTimeout(() => {canHotCold = true;
        hotcold.style.display = 'none';
        }, 15000);
        //PlayAudio("../audio/cold.wav");
    }
    else
    {
        canHotCold = true;
        enteredHot = false;
        closestDistance = 40;
        hotcold.style.display = 'none';
    }

    // console.log("tolerance is " + currentTolerance + " passed tolerance is " + tolerance);
    // const latDiff = Math.abs(currentLat - invalidLocations[4][0]);
    // const lngDiff = Math.abs(currentLng - invalidLocations[4][1]);


    // if (latDiff < tolerance && lngDiff < tolerance) 
    // {
    //     hotcold.style.display = 'block';
    //     currentTolerance = latDiff;
    //     hotcold.children[0].classList.remove('Cold');
    //     hotcold.children[0].classList.add('Hot');
    //     canHotCold = false;
    //     setTimeout(() => {canHotCold = true;
    //         hotcold.style.display = 'none';
    //     }, 15000);
    //     PlayAudio("../audio/hot.wav");
    // }
    // else if (latDiff >= tolerance && lngDiff >= tolerance && latDiff <= tolerance + 0.00001 && lngDiff <= tolerance + 0.00001 && tolerance != 0) 
    // {
    //     hotcold.style.display = 'block';
    //     hotcold.children[0].classList.remove('Hot');
    //     hotcold.children[0].classList.add('Cold');
    //     canHotCold = false;
    //     setTimeout(() => {canHotCold = true;
    //     hotcold.style.display = 'none';
    //     }, 15000);
    //     PlayAudio("../audio/cold.wav");
    // }
    // else
    // {
    //     hotcold.style.display = 'none';
    // }
}

function DisableMarkers(index)
{
    for (let i = 0; i < locationDiv.length; i++) {
        if(i != index)
        {
            locationDiv[i].style.display = 'none';
        }
        //locationDiv[index].style.backgroundImage = `url('../img/logo-greyed.png')`;
        locationDiv[index].onclick = null;
    }
    locationReached = true;
    currentLocationToReach = invalidLocations[index];
}

function EnableMarkers()
{
    for (let i = 0; i < locationDiv.length; i++) {
            locationDiv[i].style.display = 'block';
    }
    directions.removeRoutes();
}

document.getElementsByClassName('retryBtn')[0].addEventListener('click', () => {
    EnableMarkers();
    document.getElementById("WrongLocationModal").style.display = 'none';
    map.flyTo({
        center: [72.83020389574983, 19.060727925746235],
        zoom: 12
        });
});

document.getElementsByClassName('ar-start')[0].addEventListener('click', () => {
    window.location.href = 'Gift.html';
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

function PlayAudio(source)
{
    audioSource.src = source;
    audioSource.load();
    audioSource.play();
}

function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }


