let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";

d3.json(url).then(function (data) {
  console.log(data);

  createFeatures(data.features);
});

function markerSize(magnitude) {
  return magnitude * 15000;
};

function markerColor(depth){
  if (depth < 10) return "green";
  else if (depth < 30) return "greenyellow";
  else if (depth < 50) return "yellow";
  else if (depth < 70) return "orange";
  else if (depth < 90) return "orangered";
  else return "red";
}

function createFeatures(earthquakeData) {

  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h4>Location: ${feature.properties.place}</h4><hr><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
  }


  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,

    pointToLayer: function(feature, coords) {

      let markers = {
        radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.geometry.coordinates[2]),
        fillOpacity: 0.5,
        color: "black",
        stroke: true,
        weight: 0.5
      }
      return L.circle(coords,markers);
    }
  });

  createMap(earthquakes);
}

function createMap(earthquakes) {

  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let myMap = L.map("map", {
    center: [
      40.689,-74.754
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

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
  legend.addTo(myMap)
};



