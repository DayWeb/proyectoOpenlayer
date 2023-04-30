window.onload=inicio;
function inicio(){

	//Adicionar basemap Open Street Map
    var basemapOSM=new ol.layer.Tile({
        source: new ol.source.OSM()
    });

	//colores personalizados por el uso vivienda
    var uso_plaza = new ol.style.Style({
        fill : new ol.style.Fill({
            color:[218,247,166,0.8]
        }),    
        stroke : new ol.style.Stroke({
            color:[0,0,0,1],
            width:2
        })
    })

	//colores personalizados por el uso recreacion
    var uso_campodeportivo = new ol.style.Style({
        fill : new ol.style.Fill({
            color:[0,255,0,0.8]
        }),    
        stroke : new ol.style.Stroke({
            color:[0,0,0,1],
            width:2
        })
    })

	//colores personalizados por el uso comercio
    var uso_residencia = new ol.style.Style({
        fill : new ol.style.Fill({
            color:[0,128,128,0.6]
        }),    
        stroke : new ol.style.Stroke({
            color:[0,0,0,1],
            width:2
        })
    })

	//funcion para etiquetas y colores personalizados
    var estilosmanzana=function(feature){
        var usomanzanageojson=feature.get('tipo');

        var etiquetauso = new ol.style.Style({
            text: new ol.style.Text({
                font:'bold 10px arial',
                text:usomanzanageojson,
                scale:1.2,
                fill:new ol.style.Fill({
                    color:[0,0,0,1]
                })

            })
        })

        if (usomanzanageojson=='Plaza'){
            feature.setStyle([uso_plaza,etiquetauso])
        }
        if (usomanzanageojson=='Area residencial'){
            feature.setStyle([uso_residencia,etiquetauso])
        } 
        if (usomanzanageojson=='Campo deportivo'){
            feature.setStyle([uso_campodeportivo,etiquetauso])
        }                
    }

	//Adicionar una capa vectorial desde un geojson
    var manzanageojson = new ol.layer.Vector({
        source: new ol.source.Vector({
            url:'data/manzanos.geojson',
            format: new ol.format.GeoJSON()
        }),
        visible:true,
        title:'Tipos de Manzanos',
        style: estilosmanzana
    })

	var pointStyle = new ol.style.Style({
        image: new ol.style.Icon({
          src:'data/icon/semaforo.png',// Ruta a la imagen del icono
          scale: 0.09 // Escala del icono
        })
      });
    

	//adicion de puntos desde un geojson
    var puntosgeojson = new ol.layer.Vector({
        source: new ol.source.Vector({
            url:'data/semaforos.geojson',
            format: new ol.format.GeoJSON()
        }),
        visible:true,
        title:'Semaforos de la Zona Central',
        style: pointStyle
    })

	//color de la linea
    var estilovia=new ol.style.Stroke({
        color:[255,0,255],
        width:3,
        
    }) 

	//Adicionar via desde un geojson
    var viassgeojson = new ol.layer.Vector({
        source: new ol.source.Vector({
            url:'data/vias_centro.geojson',
            format: new ol.format.GeoJSON()
        }),
        visible:true,
        title:'Vias de la zona central',
        style: new ol.style.Style({
            stroke: estilovia
        })
    })    

	//mapa de calor
    var mapacaliente = new ol.layer.Heatmap({
        source: new ol.source.Vector({
            url:'data/heatmap.geojson',
            format: new ol.format.GeoJSON()
        }),
        gradient:['#00f','#0ff','#0f0','#f00','#000'],
        radius:20,
        blur:15,
        weight:'tasa',
        visible:true,
        title:'Mapa Caliente'
    }) 



    var vistaMapa=new ol.View({
        
       center:[-68.12382908704066,-16.499390542484555],// longitud, latitud
        zoom:18,
        projection:'EPSG:4326'//Datum: WGS84 Geográficas:4326
    });

    const map = new ol.Map({
        view: vistaMapa,
       //layers:[basemapOSM,manzanageojson,puntosgeojson,viassgeojson,mapacaliente],
        target:"mapa",
        controls:[]
    })

    var pantallaCompleta = new ol.control.FullScreen();
    map.addControl(pantallaCompleta);

    var barraEscala = new ol.control.ScaleLine({
        bar:true,
        text:true
    });
    map.addControl(barraEscala);


    var basemapOSM = new ol.layer.Tile({
		title: 'Open Street Map',
		visible: false,
		type: 'base',
		source: new ol.source.OSM()
	});

    var basemapGoogleSatelite = new ol.layer.Tile({
		title:'Google Satellite',
		type:'base',
		visible:true,
		source: new ol.source.XYZ({
			url: "http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}"
			})
	});

	var basemapGoogle = new ol.layer.Tile({
		title:'Google Callejero',
		type:'base',
		visible:false,
		source: new ol.source.XYZ({
			url: "https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}"
			})
	});

	var basemapBing = new ol.layer.Tile({
		title:'Bing Map',
		type:'base',
		visible:false,
		source: new ol.source.BingMaps({
			key:'Anzbo5_U1A0SuxVZpc8rqUBSRLsHmJ1ZgCGzhYnxXKpkpm9k3SuyK7OgitBhBPUs',
			imagerySet:'Aerial'
			})
	});	

    var baseGroup = new ol.layer.Group({
		title: 'Mapas Base',
		fold: true,
		layers: [basemapBing,basemapGoogle, basemapGoogleSatelite, basemapOSM]
	});

	map.addLayer(baseGroup);

    var baseGroup_2 = new ol.layer.Group({
		title: 'Informacion del Macrodistrito Centro',
		fold: true,
		layers: [manzanageojson,viassgeojson,puntosgeojson]
	});

	map.addLayer(baseGroup_2);

    


    var overviewMap = new ol.control.OverviewMap({
        layers:[
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        collapsed:true
    });
    map.addControl(overviewMap);

    var mostrarCoordenadas = new ol.control.MousePosition({
        projection:'EPSG:4326',
        coordinateFormat: function(coordenada){
            return ol.coordinate.format(coordenada, '{y}, {x}', 6)
        }
    });
    map.addControl(mostrarCoordenadas);

    var controlCapas=new ol.control.LayerSwitcher({
        tipLabel:"Leyenda"
    });
    map.addControl(controlCapas);

	//Adicion de popup (ventana emergente)
    var ventanaTitulo = document.getElementById('popup-title');
    var ventanaContenido = document.getElementById('popup-content');
    var ventanaContenedor = document.getElementById('popup-container');
    var overlay = new ol.Overlay({
        element:ventanaContenedor
    })

    map.on('click',function(e){
        overlay.setPosition(undefined);
        map.forEachFeatureAtPixel(e.pixel, function(feature,layer){
            var usomanzana = feature.get('tipo');
            map.addOverlay(overlay);
            ventanaTitulo.innerHTML='Tipo de Manzano <br>';
            ventanaContenido.innerHTML = ' ' + usomanzana + '<br>';
            overlay.setPosition(e.coordinate);
        })
    })



}
