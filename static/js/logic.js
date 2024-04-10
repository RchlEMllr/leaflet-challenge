//Establish URL to pull data
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";

//Pull in the earthquake data and log it in the console
d3.json(url).then(function (data) {
  console.log(data);

  //Send data to the marker creation function
  createFeatures(data.features);
});

//Set up relationship between marker size and earthquake magnitude at a scale that is visually interesting
function markerSize(magnitude) {
  return magnitude * 15000;
};

//Set up relationship between marker color and depth of the earthquake origin
function markerColor(depth){
  if (depth < 10) return "green";
  else if (depth < 30) return "greenyellow";
  else if (depth < 50) return "yellow";
  else if (depth < 70) return "orange";
  else if (depth < 90) return "orangered";
  else return "red";
}

//Function to build the markers
function createFeatures(earthquakeData) {

  //Function to create informational popup when markers are clicked on
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h4>Location: ${feature.properties.place}</h4><hr><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
  }

  //Prepare to send the markers to the map
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,

    //Direct the markers to the correct map layer
    pointToLayer: function(feature, coords) {

      //Outline the appearance of the markers using the relationships established outside of the function
      let markers = {
        radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.geometry.coordinates[2]),
        fillOpacity: 0.5,
        color: "black",
        stroke: true,
        weight: 0.5
      }

      //Send the markers
      return L.circle(coords,markers);
    }
  });

  //Create the map with the data
  createMap(earthquakes);
}

//Function to set up the map
function createMap(earthquakes) {

  //Establish base map and where we got it
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  //Initialize the appearance on load
  let myMap = L.map("map", {
    center: [
      40.689,-74.754
    ],
    //New Jersey because who saw that coming??
    zoom: 5,
    layers: [street, earthquakes]
  });

  //Set up legend per Leaflet outline
  let legend = L.control({position: "bottomright"});
  legend.onAdd = function(myMap) {
    let div = L.DomUtil.create("div", "info legend"),
    depth = [0, 10, 30, 50, 70, 90];

    div.innerHTML += "<h3 style='text-align: center'>Depth in km</h3>"

    for (let i = 0; i < depth.length; i++) {
      div.innerHTML +=
      '<i style="background:' + markerColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }
    return div;
  };

  //Send the legend to the map
  legend.addTo(myMap)
};



