//Endereço da API
BASE_URL = "http:127.0.0.1:2000"

//Inicializar rasterLayer
var rasterLayer = new ol.layer.Tile({
    source : new ol.source.OSM({
        wrapX : false,
        noWrap : true
    })
})

//Inicializa a layer do shape
var shapeVectorSource = new ol.source.Vector({});
var shapeVectorLayer = new ol.layer.Vector({
    source : shapeVectorSource
}) 

//Inicializa a layer dos pontos
var vectorSource = new ol.source.Vector() 
var vectorLayer = new ol.layer.Vector({
    source : vectorSource
}) 

//Configura um estilo padrão para os pontos
var pointStyle = new ol.style.Style({
    image: new ol.style.Icon({
      color: '#4271AE',
      crossOrigin: 'anonymous',
      src: 'static/img/dot.png',
    })
});

function loadPoints(){
    axios.get(`/api/pontos`)
        .then(function(response){
            if(response.status === 200){
                var coordsArray = response.data.pontos;
                
                coordsArray.map(coords =>{
                    
                    var point = new ol.Feature({
                        geometry : new ol.geom.Point(ol.proj.fromLonLat(coords)), 
                        text : `Preço: ${coords[2]} reais, Bar: ${coords[3]} `
                    });
                    
                    point.setStyle(pointStyle);
                    vectorSource.addFeature(point)
                }); 

                //Fit nos pontos
                map.getView().fit(vectorSource.getExtent());
            }

        })
}

//Adiciona as interações no mapa
var selec = new ol.interaction.Select()
selec.getFeatures().on('add', function(e){
   
    var selectedFeatures = selec.getFeatures().getArray()
    console.log(selectedFeatures)

          

    var coord = selectedFeatures[0].getGeometry().getCoordinates();
    coord = ol.proj.transform(coord, 'EPSG:3857', 'EPSG:4326');
    var lon = coord[0];
    var lat = coord[1];
    console.log(coord[0], coord[1]);

    var aux = selectedFeatures[1].getGeometry().getCoordinates();
    aux = ol.proj.transform(aux, 'EPSG:3857', 'EPSG:4326');
    var lon2 = aux[0];
    var lat2 = aux[1];
    console.log(aux[0], aux[1]);



function getDistanceFromLatLonInKm(_lat,_lon,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-_lat);  // deg2rad below
  var dLon = deg2rad(lon2-_lon); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(_lat)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

var d = getDistanceFromLatLonInKm(lat, lon, lat2, lon2);

console.log(d);
alert('Distancia entre os bares: ' + d + ' km');

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

    var label = typeof (e.element.getProperties().text) != 'undefined' ? e.element.getProperties().text : ''
    if(label != ''){
        alert(e.element.getProperties().text)
    }
    
})

// pode arrastar
var dragPan = new ol.interaction.DragPan()
// pode dar zoom
var ZoomWheel = new ol.interaction.MouseWheelZoom() 

//Inicializa o openlayers no arquivo html
var map = new ol.Map({
    view : new ol.View({
        projection:"EPSG:3857",
        center : ol.proj.fromLonLat([-44.3,-2.52]),
        zoom : 2,
        // maxZoom : 8
    }),
    target : "map",
    interactions : [dragPan, ZoomWheel, selec],
    controls : [],
    // precisa estar em ordem as layers
    layers : [rasterLayer, 
                shapeVectorLayer, vectorLayer]
});

//Define função que carrega o shape da nossa api
function loadShape(estado){
    axios.get(`/api/municipios/${estado}`).then(function(response){
        if(response.status === 200){
            var shapefeatures = new ol.format.GeoJSON()
                .readFeatures(response.data, {
                    featureProjection: 'EPSG:3857'
                });

            shapeVectorSource.clear();
            shapeVectorSource.addFeatures(shapefeatures);
            shapeVectorSource.forEachFeature(function(feature){
                //Gera cores aleatorias... apenas para testes
                //Depois pode ser utilizado para fazer mapas de densidade
                max = 255,
                min =  0;
                let r = Math.floor(Math.random()*(max-min+1)+min);
                let g = Math.floor(Math.random()*(max-min+1)+min);
                let b = Math.floor(Math.random()*(max-min+1)+min);
                
                var style = new ol.style.Style({
                    fill: new ol.style.Fill ({
                            color: `rgba(${r}, ${g}, ${b}, 0.4)`,
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'rgba(255, 255, 255,1)'
                    })
                    
                });
                feature.setStyle(style);
            });
        }
    })
}

//Função que carrega pontos da api e coloca no mapa
/*function loadPoints(){
    axios.get(`/api/pontos`)
        .then(function(response){
            if(response.status === 200){
                var coordsArray = response.data.pontos;
                
                coordsArray.map(coords =>{
                    
                    var point = new ol.Feature({
                        geometry : new ol.geom.Point(ol.proj.fromLonLat(coords)), 
                        text : `Preço: ${coords[2]} reais, Bar:${coords[3]} `
                    });
                    
                    point.setStyle(pointStyle);
                    vectorSource.addFeature(point)
                }); 

                //Fit nos pontos
                map.getView().fit(vectorSource.getExtent());
            }

        })
}*/

//Carrega shape do estado definido (por sigla)
loadShape('ma')

//Carrega pontos
loadPoints()
