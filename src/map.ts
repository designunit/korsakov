import mapboxgl, { LngLatLike } from "mapbox-gl"

const key = 'pk.eyJ1IjoidG1zaHYiLCJhIjoiZjYzYmViZjllN2MxNGU1OTAxZThkMWM5MTRlZGM4YTYifQ.uvMlwjz7hyyY7c54Hs47SQ'

export function initMap(container: any, initPhase: string) {
    mapboxgl.accessToken = key
    const center: LngLatLike = [
        142.79405865469897,
        46.6188040383542,
    ]
    var map = new mapboxgl.Map({
        // style: 'mapbox://styles/mapbox/light-v10',
        style: 'mapbox://styles/mapbox/satellite-v9', // style URL
        // style: 'mapbox://styles/grigorybbb/8sy4fqrv',
        center,
        zoom: 14.11258863317506,
        pitch: 57.99999999999994,
        bearing: -8.799999999999962,
        container,
        // container: 'map',
        antialias: true,
    });

    map.on('moveend', event => {
        console.log({
            center: map.getCenter(),
            zoom: map.getZoom(),
            pitch: map.getPitch(),
            bearing: map.getBearing(),
        })
    })

    map.on('load', function () {
        map.addSource('korsakov-osm', {
            type: 'geojson',
            data: '/static/korsakov-osm.geojson'
        });
        map.addSource('korsakov-buildings', {
            type: 'geojson',
            data: '/static/korsakov-buildings.geojson',
        });
        map.addSource('korsakov-zones', {
            type: 'geojson',
            data: '/static/korsakov-zones.geojson',
        });

        // for vector mapbox style
        // map.setLayoutProperty('building', 'visibility', 'none');
        // map.setLayoutProperty('building-outline', 'visibility', 'none');

        // Add terrain source, with slight exaggeration
        map.addSource('mapbox-dem', {
            'type': 'raster-dem',
            'url': 'mapbox://mapbox.terrain-rgb',
            'tileSize': 512,
            'maxzoom': 14
        });
        map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

        // map.addSource('korsakov-tiles', {
        //     url: "mapbox://grigorybbb.8sy4fqrv",
        //     type: "raster",
        //     tileSize: 256,
        // });
        // map.addLayer({
        //     "id": "kt",
        //     "type": "raster",
        //     "paint": {},
        //     "layout": {},
        //     "source": "korsakov-tiles",
        // })

        // map.setPaintProperty( 'building', 'minzoom', 10);

        // Insert the layer beneath any symbol layer.
        var layers = map.getStyle().layers!;
        var labelLayerId;
        // for (var i = 0; i < layers.length; i++) {
        //     if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
        //         labelLayerId = layers[i].id;
        //         break;
        //     }
        // }

        // The 'building' layer in the Mapbox Streets
        // vector tileset contains building height data
        // from OpenStreetMap.
        map.addLayer(
            {
                'id': 'korsakov-osm-3d',
                'source': 'korsakov-osm',
                // 'source': 'composite',
                // 'source-layer': 'building',
                // 'filter': ['==', 'extrude', 'true'],
                'type': 'fill-extrusion',
                'minzoom': 10,
                'paint': {
                    // 'fill-extrusion-color': '#f0f',
                    'fill-extrusion-color': '#fffff0',
                    'fill-extrusion-height': ['*',
                        3,
                        ['get', 'building_height'],
                    ],

                    // Use an 'interpolate' expression to
                    // add a smooth transition effect to
                    // the buildings as the user zooms in.
                    // 'fill-extrusion-height': [
                    //     'interpolate',
                    //     ['linear'],
                    //     ['zoom'],
                    //     15,
                    //     0,
                    //     15.05,
                    //     ['get', 'building_height']
                    // ],
                    // 'fill-extrusion-base': 1,
                    // 'fill-extrusion-base': [
                    //     'interpolate',
                    //     ['linear'],
                    //     ['zoom'],
                    //     15,
                    //     0,
                    //     15.05,
                    //     ['get', 'min_height']
                    // ],
                    // 'fill-extrusion-opacity': 0.6
                }
            },

            labelLayerId
        )

        map.addLayer(
            {
                'id': 'korsakov-buildings-3d',
                'source': 'korsakov-buildings',
                'type': 'fill-extrusion',
                'minzoom': 10,
                'paint': {
                    'fill-extrusion-color': '#f0f',
                    'fill-extrusion-height': ['*',
                        0.75,
                        ['get', 'height'],
                    ],
                    'fill-extrusion-base': ['get', 'offset'],
                },
                filter: ['==', initPhase, true],
            },

            labelLayerId
        )

        map.addLayer(
            {
                'id': 'korsakov-zones',
                'source': 'korsakov-zones',
                'type': 'fill',
                'minzoom': 10,
                'paint': {
                    // 'fill-color': '#27831e',
                    'fill-color': ['match',
                        ['get', 'type'],
                        'shth_lab', '#0000ff',
                        'oez', '#00ffff',
                        'apart', '#ffff00',

                        '#27831e'
                    ],
                    'fill-opacity': 0.8,
                },
                filter: ['==', initPhase, true],
            },

            labelLayerId
        )
        // map.addLayer({
        //     'id': 'buildings-i1',
        //     'type': 'line',
        //     'source': 'korsakov-buildings',
        //     'layout': {
        //         'line-join': 'round',
        //         'line-cap': 'round'
        //     },
        //     'paint': {
        //         'line-color': '#ff69b4',
        //         'line-width': 1
        //     }
        // });
    })

    return map
}

export function switchPhase(map: mapboxgl.Map, phase: string) {
    if (!map.loaded()) {
        return
    }

    map.setFilter('korsakov-zones', ['==', phase, true])
    map.setFilter('korsakov-buildings-3d', ['==', phase, true])
}
