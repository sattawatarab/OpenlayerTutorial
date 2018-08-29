var wmsSourceAmphoe = new ol.source.ImageWMS({
    url: 'http://localhost/geoserver/test/wms',
    params: {
        'LAYERS': 'test:WaterSource'
    },
    crossOrigin: 'anonymous'
});

var wmsLayerchonburi = new ol.layer.Image({
    source: wmsSourceAmphoe
});

var wmsSourceDam = new ol.source.ImageWMS({
    url: 'http://localhost/geoserver/test/wms',
    params: {
        'LAYERS': 'test:Dam'
    },
    crossOrigin: 'anonymous'
});

var wmsLayerDam = new ol.layer.Image({
    source: wmsSourceDam
});

// osm tile
var OSM = new ol.layer.Tile({
	visible: true,
	source: new ol.source.OSM()
});

// init map
var map = new ol.Map({
    controls: ol.control.defaults().extend([
        new ol.control.FullScreen({
            source: 'fullscreen'
        }),
		new ol.control.ScaleLine({
			units: 'metric'
		})
    ]),
    layers: [OSM],
    target: 'map',
    view: new ol.View({
		center: ol.proj.fromLonLat([100.4833, 13.7500]),
		zoom: 6
	})
});

// layer toggle
function showMapLayer(el) {
    checkedLayer = window[el.value];

    if (el.checked) {
        map.addLayer(checkedLayer);
    } else {
        map.removeLayer(checkedLayer);
    }
}

// bing base map
var bingKey = 'As1HiMj1PvLPlqc_gtM7AqZfBL8ZL3VrjaS3zIb22Uvb9WKhuJObROC-qUpa81U5';
var Aerial = new ol.layer.Tile({
	preload: Infinity,
	source: new ol.source.BingMaps({
		key: bingKey,
		imagerySet: 'Aerial'
	})
});

var AerialWithLabels = new ol.layer.Tile({
	preload: Infinity,
	source: new ol.source.BingMaps({
		key: bingKey,
		imagerySet: 'AerialWithLabels'
	})
});

var Road = new ol.layer.Tile({
	preload: Infinity,
	source: new ol.source.BingMaps({
		key: bingKey,
		imagerySet: 'Road'
	})
});

// base map func
function changeBaseMap(el){
	var style = el.dataset.style;
	if(style){
		map.getLayers().removeAt(0);
		switch(style){
			case 'OSM':
				map.getLayers().insertAt(0, OSM);
				break;
			case 'Aerial':
				map.getLayers().insertAt(0, Aerial);
				break;
			case 'AerialWithLabels':
				map.getLayers().insertAt(0, AerialWithLabels);
				break;
			case 'Road':
				map.getLayers().insertAt(0, Road);
			break;		
				default:
			  break;		
		}
	}	
}

// base map dropdown menu
/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}
