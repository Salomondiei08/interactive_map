// Initialization
var map = L.map("map").setView([51.505, -0.09], 13);
L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">Salomon DIEI</a>',
  }
).addTo(map);

var markersData = [];
var markerObjects = new Map();

function updateSidePanel() {
  var sidePanel = document.querySelector('.sidebar-panel');
  sidePanel.innerHTML = '';

  var list = document.createElement('ul');
  list.className = 'list-group';

  markersData.forEach(function (markerData, index) {
    var listItem = document.createElement('li');
    listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
    listItem.textContent = 'Marker #' + (index + 1) + ': ' + markerData.latlng.toString();

    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'btn-primary rounded-button';
    deleteButton.addEventListener('click', function() {
      map.removeLayer(markerObjects.get(markerData.id));
      markerObjects.delete(markerData.id);
      markersData = markersData.filter(marker => marker.id !== markerData.id);
      updateSidePanel();
    });

    listItem.appendChild(deleteButton);
    list.appendChild(listItem);
  });

  sidePanel.appendChild(list);
}

var newMarker;
document.getElementById('add-marker').addEventListener('click', function () {
  newMarker = L.marker([51.505, -0.09], {
    draggable: true,
    autoPan: true,
  })
  .addTo(map);

  newMarker.on('dragend', function () {
    markersData.find(marker => marker.id === newMarker._leaflet_id).latlng = newMarker.getLatLng();
    updateSidePanel();
  });

  markersData.push({
    id: newMarker._leaflet_id,
    latlng: newMarker.getLatLng()
  });
  markerObjects.set(newMarker._leaflet_id, newMarker);
  updateSidePanel();

  document.getElementById('set-marker').disabled = false;
});

document.getElementById('set-marker').addEventListener('click', function () {
  if (newMarker) {
    newMarker.dragging.disable();
    newMarker = null;
    document.getElementById('set-marker').disabled = true;
  }
});