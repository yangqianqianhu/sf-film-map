mapboxgl.accessToken = 'pk.eyJ1IjoieWg5dWMiLCJhIjoiY2puYzQ5dmR3MDBqNjNxcGl3em02amE2cyJ9.tfOeBBBpvJuC3clrOEjaUA';

var map = new mapboxgl.Map({
	container: 'map',
    center: [-122.407424,37.787085],
    zoom: 14,
	style: 'mapbox://styles/yh9uc/cjnc4fhh432jw2rmdtsl7n02d', 	
});

$("#about").on('click', function() {
    $("#screen").fadeToggle();
    $(".modal").fadeToggle();
});

$(".modal>.close-button").on('click', function() {
    $("#screen").fadeToggle();
    $(".modal").fadeToggle();
});

var layers = [
    '1910s',
    '1920s',
    '1930s',
    '1940s',
    '1950s',
    '1960s',
    '1970s',
    '1980s',
    '1990s',
    '2000s',
    '2010s'
];

var colors = [
    '#f8f1f1',
    '#eec5ba', 
    '#e3b2ab',
    '#d89d97',
    '#cd8b88',
    '#c17677',
    '#b76266',
    '#ac4d54',
    '#a13a44',
    '#972633',
    '#8c1222'
];

for (i=0; i<layers.length; i++) {
    var layer =layers[i];
    var color =colors[i];
    var item = document.createElement('div');
    var key = document.createElement('span');
    key.className = 'legend-key';
    key.style.backgroundColor = color;
    var value = document.createElement('span');
    value.innerHTML = layer;
    
    item.appendChild(key);
    item.appendChild(value);
    legend.appendChild(item);
};

map.on('mousemove', function(e) {   // Event listener to do some code when the mouse moves, see https://www.mapbox.com/mapbox-gl-js/api/#events. 

        var filmsf = map.queryRenderedFeatures(e.point, {    
            layers: ['film-locations']    // replace 'cville-parks' with the name of the layer you want to query (from your Mapbox Studio map, the name in the layers panel). For more info on queryRenderedFeatures, see the example at https://www.mapbox.com/mapbox-gl-js/example/queryrenderedfeatures/. Documentation at https://www.mapbox.com/mapbox-gl-js/api/#map#queryrenderedfeatures.
        });
        
        console.log(filmsf);
        
        if (filmsf.length > 0) {   // if statement to make sure the following code is only added to the info window if the mouse moves over a state

            $('#more-info').html('<h3><strong>' + "&lt;" + filmsf[0].properties.Title + "&gt;" + '</strong></h3>' +  '<p>' + filmsf[0].properties.ReleaseYear + '</p>' + '<p>' + filmsf[0].properties.Director + '</p>' + '<p>' + filmsf[0].properties.ProductionCompany + '</p>');

        } else {    // what shows up in the info window if you are NOT hovering over a park

            $('#more-info').html('<p>Hover over a site to learn about the film and its director.</p>' + '<p>Click on it to for actors and some fun facts!</p>');
            
        }

    });

// POPUPS CODE

    // Create a popup on click 
    map.on('click', function(e) {   // Event listener to do some code when user clicks on the map

      var f = map.queryRenderedFeatures(e.point, {  // Query the map at the clicked point. See https://www.mapbox.com/mapbox-gl-js/example/queryrenderedfeatures/ for an example on how queryRenderedFeatures works and https://www.mapbox.com/mapbox-gl-js/api/#map#queryrenderedfeatures for documentation
        layers: ['film-locations']    // replace this with the name of the layer from the Mapbox Studio layers panel
    });

      // if the layer is empty, this if statement will exit the function (no popups created) -- this is a failsafe to avoid non-functioning popups
      if (f.length == 0) {
        return;
    }

    // Initiate the popup
    var popup = new mapboxgl.Popup({ 
        closeButton: true, // If true, a close button will appear in the top right corner of the popup. Default = true
        closeOnClick: true, // If true, the popup will automatically close if the user clicks anywhere on the map. Default = true
        anchor: 'bottom', // The popup's location relative to the feature. Options are 'top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left' and 'bottom-right'. If not set, the popup's location will be set dynamically to make sure it is always visible in the map container.
        offset: [0, -15], // A pixel offset from the centerpoint of the feature. Can be a single number, an [x,y] coordinate, or an object of [x,y] coordinates specifying an offset for each of the different anchor options (e.g. 'top' and 'bottom'). Negative numbers indicate left and up.
    });

      // Set the popup location based on each feature
      popup.setLngLat(f[0].geometry.coordinates);

      // Set the contents of the popup window
      popup.setHTML('<h3><p>' + "Actors:" + f[0].properties.Actor1 + " and " + f[0].properties.Actor2 + '</p>' + '<p>' + f[0].properties.FunFacts + '</h3><p>' + '</p>');
            // stops[0].properties.stop_id will become the title of the popup (<h3> element)
            // stops[0].properties.stop_name will become the body of the popup


        // popup.setHTML('<p>' + stops[0].properties.stop_name + '</p>')
        

      // Add the popup to the map 
      popup.addTo(map);  // replace "map" with the name of the variable in line 4, if different
  });


// SHOW/HIDE LAYERS
// See example at https://www.mapbox.com/mapbox-gl-js/example/toggle-layers/
    
    var layers = [  // an array of the layers you want to include in the layers control (layers to turn off and on)

        // [layerMachineName, layerDisplayName]
        // layerMachineName is the layer name as written in your Mapbox Studio map layers panel
        // layerDisplayName is the way you want the layer's name to appear in the layers control on the website
        ['parks', 'Parks'],  
        ['bicycle-lane', 'Bike Lane'],  
        ['building', 'Buildings'], 
        ['poi-label', 'Landmarks'],
    ]; 

    // functions to perform when map loads
    map.on('load', function () {
        
        for (i=0; i<layers.length; i++) {

            // add a button for each layer
            $("#layers-control").append("<a href='#' class='active button-default' id='" + layers[i][0] + "'>" + layers[i][1] + "</a>");
        }

        // show/hide layers when button is clicked
        $("#layers-control>a").on('click', function(e) {

                var clickedLayer = e.target.id;
                e.preventDefault();
                e.stopPropagation();

                var visibility = map.getLayoutProperty(clickedLayer, 'visibility');  // see https://www.mapbox.com/mapbox-gl-js/api/#map#getlayoutproperty
                console.log(visibility);

                if (visibility === 'visible') {
                    map.setLayoutProperty(clickedLayer, 'visibility', 'none');  // see https://www.mapbox.com/mapbox-gl-js/api/#map#setlayoutproperty
                    $(e.target).removeClass('active');
                } else {
                    $(e.target).addClass('active');
                    map.setLayoutProperty(clickedLayer, 'visibility', 'visible'); // see https://www.mapbox.com/mapbox-gl-js/api/#map#setlayoutproperty
                }
        });
    });