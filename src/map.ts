import mapboxgl, { CustomLayerInterface, Expression, LngLatLike } from "mapbox-gl"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

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
        'medpark', '#0C56FF',
        'apart_top', '#FF7400',
        'office', '#006E6E',
        'unique_buildings', '#005050',
        'railway', '#00257A',
        'mixeduse', '#ffc0cb',
        'sachtech', '#2E7D7A',
        'app', '#275069',
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
        'app family', '#596EB5',
        'app non family', '#596EB5',
        'artschool', '#E43594',
        'concerthall', '#F8951D',
        'dorm', '#FEBF10',
        'flats', '#00B5DC',
        'hotel', '#FFD002',
        'hub', '#B6529F',
        'kinders', '#DA67A7',
        'maison', '#275069',
        'mediateque', '#F37763',
        'med', '#00A997',
        'sachtech lab', '#B1BE73',
        'sachtech office', '#EEF2D8',
        'sachtech prom', '#6B946C',
        'sachtech ungrng', '#367036',
        'school', '#BDD630',
        'service', '#C785B9',
        'sport', '#9AC639',
        'townhouse', '#00564D',
        'univer', '#B168AA',

        '#000000'
    ]
}

function createFilter(phase: string, values: string[]) {
    return ['in',
        ['get', phase],
        ['literal', values],
    ]
}

class ThreeLayer implements CustomLayerInterface {
    public type: 'custom' = 'custom'

    private camera: THREE.Camera
    private scene: THREE.Scene
    private renderer: THREE.WebGLRenderer
    private map: mapboxgl.Map
    private modelTransform: any

    constructor(public id: string) {
        this.map = null as any
        this.renderer = null as any
        this.camera = new THREE.Camera();
        this.scene = new THREE.Scene();

        const modelOrigin = [142.790999165027614, 46.604746813273003] as any
        const modelAltitude = 10;
        const modelRotate = [Math.PI / 2, 0, 0];

        const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
            modelOrigin,
            modelAltitude
        );

        // transformation parameters to position, rotate and scale the 3D model onto the map
        this.modelTransform = {
            translateX: modelAsMercatorCoordinate.x,
            translateY: modelAsMercatorCoordinate.y,
            translateZ: modelAsMercatorCoordinate.z,
            rotateX: modelRotate[0],
            rotateY: modelRotate[1],
            rotateZ: modelRotate[2],
            /* Since the 3D model is in real world meters, a scale transform needs to be
            * applied since the CustomLayerInterface expects units in MercatorCoordinates.
            */
            scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits()
        };
    }

    // onAdd(map, gl) {
    onAdd(map: mapboxgl.Map, gl: WebGLRenderingContext) {
        // create two three.js lights to illuminate the model
        const directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(0, -70, 100).normalize();
        this.scene.add(directionalLight);

        const directionalLight2 = new THREE.DirectionalLight(0xffffff);
        directionalLight2.position.set(0, 70, 100).normalize();
        this.scene.add(directionalLight2);

        // use the three.js GLTF loader to add the 3D model to the three.js scene
        // const loader = new THREE.GLTFLoader();
        const loader = new GLTFLoader()
        loader.load('/static/museum.glb', (gltf) => {
            this.scene.add(gltf.scene);
        })
        this.map = map;

        // use the Mapbox GL JS map canvas for three.js
        this.renderer = new THREE.WebGLRenderer({
            canvas: map.getCanvas(),
            context: gl,
            antialias: true
        });

        this.renderer.autoClear = false;
    }

    render(gl: WebGLRenderingContext, matrix: number[]) {
        const rotationX = new THREE.Matrix4().makeRotationAxis(
            new THREE.Vector3(1, 0, 0),
            this.modelTransform.rotateX
        );
        const rotationY = new THREE.Matrix4().makeRotationAxis(
            new THREE.Vector3(0, 1, 0),
            this.modelTransform.rotateY
        );
        const rotationZ = new THREE.Matrix4().makeRotationAxis(
            new THREE.Vector3(0, 0, 1),
            this.modelTransform.rotateZ
        );

        const m = new THREE.Matrix4().fromArray(matrix);
        const l = new THREE.Matrix4()
            .makeTranslation(
                this.modelTransform.translateX,
                this.modelTransform.translateY,
                this.modelTransform.translateZ
            )
            .scale(
                new THREE.Vector3(
                    this.modelTransform.scale,
                    -this.modelTransform.scale,
                    this.modelTransform.scale
                )
            )
            .multiply(rotationX)
            .multiply(rotationY)
            .multiply(rotationZ);

        this.camera.projectionMatrix = m.multiply(l);
        this.renderer.resetState();
        this.renderer.render(this.scene, this.camera);
        this.map.triggerRepaint();
    }
}

function initMuseum(map: mapboxgl.Map) {
    // parameters to ensure the model is georeferenced correctly on the map
    // const modelOrigin = [148.9819, -35.39847] as any
    const modelOrigin = [142.790999165027614, 46.604746813273003] as any
    const modelAltitude = 10;
    const modelRotate = [Math.PI / 2, 0, 0];

    const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
        modelOrigin,
        modelAltitude
    );

    // transformation parameters to position, rotate and scale the 3D model onto the map
    const modelTransform = {
        translateX: modelAsMercatorCoordinate.x,
        translateY: modelAsMercatorCoordinate.y,
        translateZ: modelAsMercatorCoordinate.z,
        rotateX: modelRotate[0],
        rotateY: modelRotate[1],
        rotateZ: modelRotate[2],
        /* Since the 3D model is in real world meters, a scale transform needs to be
        * applied since the CustomLayerInterface expects units in MercatorCoordinates.
        */
        scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits()
    };

    map.addLayer(new ThreeLayer('museum-3d'))
}

export function initMap(container: any, initPhase: string, onClickMarker: (feature: any) => void) {
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
                        0.75,
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

        map.loadImage('/icons/attraction.png', (error, image) => {
            if (error) {
                throw error
            }
            if (!image) {
                return
            }

            // Add the image to the map style.
            map.addImage('photo', image)

            map.addSource('korsakov-photos', {
                type: 'geojson',
                data: '/static/korsakov-photos.geojson',
            })

            map.addLayer({
                'id': 'korsakov-photos-icon',
                'source': 'korsakov-photos',
                'type': 'symbol',
                'minzoom': 10,
                'layout': {
                    'icon-size': 0.5,
                    'icon-image': 'photo',
                },
            })

            map.on('click', (event) => {
                const size = 8
                const point = event.point
                const bbox: [mapboxgl.PointLike, mapboxgl.PointLike] = [
                    [point.x - size / 2, point.y - size / 2],
                    [point.x + size / 2, point.y + size / 2],
                ]
                const features = map.queryRenderedFeatures(bbox, {
                    layers: ['korsakov-photos-icon'],
                })
                if (features.length === 0) {
                    return
                }

                const selected = features[0]
                onClickMarker(selected)
            })
        })

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

    map.on('style.load', () => {
        initMuseum(map)
    });

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

export function setLayerVisibility(map: mapboxgl.Map, layer: string, visible: boolean) {
    const value = visible ? 'visible' : 'none'

    map.setLayoutProperty(layer, 'visibility', value)
}
