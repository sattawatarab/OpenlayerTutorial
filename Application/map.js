var wmsSource = new ol.source.ImageWMS({
    url: 'https://ahocevar.com/geoserver/wms',
    params: {
        'LAYERS': 'ne:ne'
    },
});

var wmsLayerAdmin = new ol.layer.Image({
    source: wmsSource
});

var wmsSourceTambon = new ol.source.ImageWMS({
    url: 'http://192.168.1.33:8079/geoserver/SmallWaterArea/wms',
    params: {
        'LAYERS': 'SmallWaterArea:Landuse'
    },
});

var wmsLayerTambon = new ol.layer.Image({
    source: wmsSourceTambon
});

var wmsSourceAmphoe = new ol.source.ImageWMS({
    url: 'http://localhost:8082/geoserver/sattwat/wms?',
    params: {
        'LAYERS': 'sattwat:Amphoe2554'
    },
});

var wmsLayerAmphoe = new ol.layer.Image({
    source: wmsSourceAmphoe
});

var wmsSourceDam = new ol.source.ImageWMS({
    url: 'http://localhost:8080/geoserver/training/wms',
    params: {
        'LAYERS': '	training:Dam'
    },
});

var wmsLayerDam = new ol.layer.Image({
    source: wmsSourceDam
});

var view = new ol.View({
    center: ol.proj.fromLonLat([100.4833, 13.7500]),
    zoom: 6
});
  
var layers = [new ol.layer.Tile({
    source: new ol.source.OSM()
})];

var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');
var overlay = new ol.Overlay({
	element: container,
	autoPan: true,
	autoPanAnimation: {
	  duration: 250
	}
});

closer.onclick = function() {
	overlay.setPosition(undefined);
	closer.blur();
	content.innerHTML = '';
	return false;
};

var map = new ol.Map({	
    controls: ol.control.defaults().extend([
        new ol.control.FullScreen({
            source: 'fullscreen'
        })
    ]),
	overlays: [overlay],
    layers: layers,
    target: 'map',
    view: view
});

function showMapLayer(el) {
    checkedLayer = window[el.value];

    if (el.checked) {
        layers.push(checkedLayer);
        map.addLayer(checkedLayer);
    } else {
        var index = layers.indexOf(checkedLayer);
        layers.splice(index, 1);
        map.removeLayer(checkedLayer);
    }
}

map.on('singleclick', function(evt) {
	var coordinate = evt.coordinate;
	//document.getElementById('info').innerHTML = '';
	var viewResolution = /** @type {number} */ (view.getResolution());
	var url = wmsSourceTambon.getGetFeatureInfoUrl(
		evt.coordinate, viewResolution, 'EPSG:3857',
		{'INFO_FORMAT': 'application/json'});
	if (url) {
	  /* document.getElementById('info').innerHTML = '<iframe id="info-iframe" src="' + url + '"></iframe>'; */
	  //console.log(url)
	  fetch(url)
	  .then(function(response) {
		return response.json();
	  })
	  .then(function(response) {
		//console.log(myJson);
		var temp = response.features[0];
        var features = temp.properties;
		var resHtml = '';
		
		if(temp){
			resHtml += '<table class="table table-hover">';
			for(prop in features){
				resHtml += '<tr>';
				resHtml += '<td> ' + prop +' </td>';
				resHtml += '<td> ' + features[prop] +' </td>';
				resHtml += '<tr>';
			}
			
			resHtml += '</table>';
			content.innerHTML = resHtml;
			overlay.setPosition(coordinate);
		}else{
			closer.click();
		}		
	  });
	}	
});

/* map.on('pointermove', function(evt) {
	if (evt.dragging) {
	  return;
	}
	var pixel = map.getEventPixel(evt.originalEvent);
	var hit = map.forEachLayerAtPixel(pixel, function() {
	  return true;
	});
	map.getTargetElement().style.cursor = hit ? 'pointer' : '';
}); */

document.getElementById('export-png').addEventListener('click', function() {
        map.once('postcompose', function(event) {
          var canvas = event.context.canvas;
          if (navigator.msSaveBlob) {
            navigator.msSaveBlob(canvas.msToBlob(), 'map.png');
          } else {
            canvas.toBlob(function(blob) {
              saveAs(blob, 'map.png');
            });
          }
        });
        map.renderSync();
      });

// Get the modal
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
} 
