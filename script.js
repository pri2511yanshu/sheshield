let map;
let userLocation;
let contact = "";
let routeControl;
let userMarker;
let followUser = false;   
window.onload = function () {

    if(navigator.geolocation){

        navigator.geolocation.watchPosition(pos => {

            let lat = pos.coords.latitude;
            let lng = pos.coords.longitude;

            userLocation = [lat, lng];

           
            if(!map){
                map = L.map('map').setView(userLocation, 15);

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
                .addTo(map);
            }

            
            if(userMarker){
                map.removeLayer(userMarker);
            }

           
            userMarker = L.marker(userLocation).addTo(map);

           
            if(followUser){
                map.setView(userLocation, 15);
            }

            document.getElementById("locationInfo").innerHTML =
            `📍 Current Location<br>Lat: ${lat}<br>Lng: ${lng}`;

        });
    }
};

function saveContact(){
    contact = document.getElementById("contactNumber").value;
    alert("Contact saved successfully");
}

function deleteContact(){

    if(!contact){
        alert("No contact to delete");
        return;
    }

    contact = "";
    document.getElementById("contactNumber").value = "";

    alert("Contact deleted successfully");
}

function goToLive(){
    followUser = true;
    map.setView(userLocation,15);
}


function startNavigation(){
    searchLocation();
}

function toggleContact(){
    let p = document.getElementById("contactPanel");
    p.style.display = p.style.display==="none"?"block":"none";
}


function searchLocation(){

    let place = document.getElementById("destination").value;

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${place}`)
    .then(res=>res.json())
    .then(data=>{

        if(data.length === 0){
            alert("Location not found");
            return;
        }

        let lat = parseFloat(data[0].lat);
        let lon = parseFloat(data[0].lon);

        let destination = [lat, lon];

        
        map.flyTo(destination, 15);

        
        L.marker(destination).addTo(map);

        if(routeControl){
            map.removeControl(routeControl);
        }

       routeControl = L.Routing.control({
    waypoints: [
        L.latLng(userLocation[0], userLocation[1]),
        L.latLng(lat, lon)
    ],
    routeWhileDragging: false,
    show: true,
    fitSelectedRoutes: false   
}).addTo(map);

       
        routeControl.on('routesfound', function(e) {

            let route = e.routes[0];

            let distance = (route.summary.totalDistance / 1000).toFixed(1);
            let time = (route.summary.totalTime / 60).toFixed(0);

            document.getElementById("routeInfo").innerHTML =
                `<b>🧭 Route Info</b><br>
                 Distance: ${distance} km<br>
                 Time: ${time} min`;
        });

    });
}


document.getElementById("sosBtn").onclick = function(){

    if(!contact){
        alert("Enter contact first");
        return;
    }

    let lat = userLocation[0];
    let lng = userLocation[1];

    let msg = `🚨 HELP! https://maps.google.com/?q=${lat},${lng}`;

    window.open(`https://wa.me/${contact}?text=${encodeURIComponent(msg)}`);
};
function sendSMS(){

    if(!contact){
        alert("Enter contact first");
        return;
    }

    let lat = userLocation[0];
    let lng = userLocation[1];

    let msg = `🚨 HELP! My location: https://maps.google.com/?q=${lat},${lng}`;

   
    window.location.href = `sms:${contact}?body=${encodeURIComponent(msg)}`;
}