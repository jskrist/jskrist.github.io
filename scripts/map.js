function initMap() {
    var mapCanvas = document.getElementById("map");
    var latLon = new google.maps.LatLng(38.802379, -89.966680);
    var mapOptions = {
        center: latLon,
        zoom: 10
    };
    var map = new google.maps.Map(mapCanvas, mapOptions);

    var marker = new google.maps.Marker({
              position: latLon,
              map: map,
              title: 'Edwardsville, IL'
            });

}
