import mapboxgl, { Expression, LngLatLike } from "mapbox-gl"

const key = 'pk.eyJ1IjoidG1zaHYiLCJhIjoiZjYzYmViZjllN2MxNGU1OTAxZThkMWM5MTRlZGM4YTYifQ.uvMlwjz7hyyY7c54Hs47SQ'

const ZONE_FILTER = [
    'category',
    'regeneration',
]
const ZONE_BORDER_FILTER = [
    'category',
    'regeneration',
    'waiting',
    'blank',
]
const BUILDING_FILTER = [
    'category',
    'blank',
    'regeneration',
]
const GREEN_FILTER = [
    'grown',
]
const GREEN_LINE_FILTER = [
    'planted',
]

function createFill(phase: string): Expression {
    return ['match',
        ['case',
            ['==', ['get', phase], 'regeneration'], 'regeneration',
            ['==', ['get', phase], 'blank'], 'blank',
            ['get', 'category'],
        ],
        'shth', '#FF0090',
        'oez', '#6B003D',
        'school', '#00FFFF',
        'medpark', '#0C56FF',
        'apart_top', '#FF7400',
        'office', '#006E6E',
        'unique_buildings', '#005050',
        'railway', '#00257A',
        'app family', '#283AD9',
        'app non family', '#1C2DE2',
        'flats', '#0095CC',
        'sachtech lab', '#1A9272',
        'sachtech office', '#36C89F',
        'sahtech prom', '#21726E',
        'sahtech ungrnd', '#295637',
        'services', '#8000B7',
        'campus', '#FF4FB3',
        'media', '#FF4FB3',
        'city_square', '#ffffff',
        'apart', '#FF9F4F',
        'port', '#ffffff',
        'emb', '#ffffff',
        'blank', '#ffffff',
        'regeneration', '#FF7EC7',
        'green_nature', '#006A00',
        'green_urban', '#00FF00',

        '#000000'
    ]
}

function createFilter(phase: string, values: string[]) {
    return ['in',
        ['get', phase],
        ['literal', values],
    ]
}

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
        map.addSource('korsakov-green', {
            type: 'geojson',
            data: '/static/korsakov-green.geojson',
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
                    'fill-extrusion-color': createFill(initPhase),
                    'fill-extrusion-height': ['*',
                        2,
                        ['get', 'height'],
                    ],
                    'fill-extrusion-base': ['get', 'offset'],
                },
                filter: createFilter(initPhase, BUILDING_FILTER),
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
                    'fill-color': createFill(initPhase),
                    'fill-opacity': 0.4,
                },
                filter: createFilter(initPhase, ZONE_FILTER),
            },

            labelLayerId
        )

        map.addLayer(
            {
                'id': 'korsakov-zones-border',
                'source': 'korsakov-zones',
                'type': 'line',
                'minzoom': 10,
                'paint': {
                    'line-color': createFill(initPhase),
                    'line-width': 2,
                },
                filter: createFilter(initPhase, ZONE_BORDER_FILTER),
            },

            labelLayerId
        )

        map.addLayer(
            {
                'id': 'korsakov-green',
                'source': 'korsakov-green',
                'type': 'fill',
                'minzoom': 10,
                'paint': {
                    'fill-color': createFill(initPhase),
                    'fill-opacity': 0.6,
                },
                filter: createFilter(initPhase, GREEN_FILTER),
            },

            labelLayerId
        )

        map.addLayer(
            {
                'id': 'korsakov-green-border',
                'source': 'korsakov-green',
                'type': 'line',
                'minzoom': 10,
                'paint': {
                    'line-color': createFill(initPhase),
                    'line-width': 2,
                    'line-dasharray': [3, 2],
                },
                filter: createFilter(initPhase, GREEN_LINE_FILTER),
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

    map.setFilter('korsakov-zones', createFilter(phase, ZONE_FILTER))
    map.setFilter('korsakov-zones-border', createFilter(phase, ZONE_BORDER_FILTER))
    map.setFilter('korsakov-green', createFilter(phase, GREEN_FILTER))
    map.setFilter('korsakov-green-border', createFilter(phase, GREEN_LINE_FILTER))
    map.setFilter('korsakov-buildings-3d', createFilter(phase, BUILDING_FILTER))

    map.setPaintProperty('korsakov-buildings-3d', 'fill-extrusion-color', createFill(phase))
    map.setPaintProperty('korsakov-zones', 'fill-color', createFill(phase))
    map.setPaintProperty('korsakov-zones-border', 'line-color', createFill(phase))
}
