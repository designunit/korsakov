import mapboxgl, { CustomLayerInterface, Expression } from "mapbox-gl"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

export const ZONE_FILTER = [
    'category',
    'regeneration',
]
export const ZONE_BORDER_FILTER = [
    'category',
    'regeneration',
    'waiting',
    'blank',
]
export const BUILDING_FILTER = [
    'category',
    'blank',
    'regeneration',
]
export const GREEN_FILTER = [
    'grown',
]
export const GREEN_LINE_FILTER = [
    'planted',
]

export function createFill(phase: string): Expression {
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
        'medical', '#00A997',
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

export function createFilter(phase: string, values: string[]) {
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

export function createMuseumLayer(layerId: string) {
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

    return new ThreeLayer(layerId)
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
