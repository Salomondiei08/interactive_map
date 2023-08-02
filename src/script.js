// Initialization
// Create a Leaflet map with a default view centered at latitude 5.359952 and longitude -4.008256 with zoom level 12.
var map = L.map("map").setView([5.359952, -4.008256], 12);

// Add an OpenStreetMap tile layer to the map with attribution to Salomon DIEI.
L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">Salomon DIEI</a>',
  }
).addTo(map);

// Initialize arrays and a map to store markers' data and objects.
var markersData = [];
var markerObjects = new Map();

// Function to update the side panel with the list of markers.
function updateSidePanel() {
  var sidePanel = document.querySelector('.sidebar-panel');
  sidePanel.innerHTML = '';

  var list = document.createElement('ul');
  list.className = 'list-group';

  // Loop through each marker's data and create list items with delete buttons.
  markersData.forEach(function (markerData, index) {
    var listItem = document.createElement('li');
    listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
    listItem.textContent = 'Marker #' + (index + 1) + ': ' + markerData.latlng.toString();

    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'btn-primary rounded-button';

    // Add a click event listener to the delete button to remove the marker from the map and the data arrays.
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

// Add a marker on the Map
document.getElementById('add-marker').addEventListener('click', function () {
  // Create a new draggable marker on the map.
  newMarker = L.marker([5.359952, -4.008256], {
    draggable: true,
    autoPan: true,
  }).addTo(map);

  // Add a dragend event listener to update the marker's position in the markersData array when it is dragged.
  newMarker.on('dragend', function () {
    markersData.find(marker => marker.id === newMarker._leaflet_id).latlng = newMarker.getLatLng();
    updateSidePanel();
  });

  // Store the new marker's data and object in their respective arrays and update the side panel.
  markersData.push({
    id: newMarker._leaflet_id,
    latlng: newMarker.getLatLng()
  });
  markerObjects.set(newMarker._leaflet_id, newMarker);
  updateSidePanel();

  // Enable/disable buttons to manage marker addition.
  document.getElementById('set-marker').disabled = false;
  document.getElementById('add-marker').disabled = true;
});

// Set Marker Position
document.getElementById('set-marker').addEventListener('click', function () {
  // If a new marker exists, disable dragging, bind a popup with coordinates, and reset the newMarker variable.
  if (newMarker) {
    newMarker.dragging.disable();
    newMarker.bindPopup("Coordinates: " + newMarker.getLatLng());
    newMarker = null;
    // Enable/disable buttons to manage marker addition.
    document.getElementById('set-marker').disabled = true;
    document.getElementById('add-marker').disabled = false;
  }
});
