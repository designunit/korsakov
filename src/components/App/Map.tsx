import { BUILDING_FILTER, createFill, createFilter, GREEN_FILTER, GREEN_LINE_FILTER, createMuseumLayer, ZONE_BORDER_FILTER, ZONE_FILTER } from "@/map"
import { memo, useCallback } from "react"
import { MapboxEffect, useMapboxEffect, useMapboxImage, useMapboxLayer, useMapboxSource } from "../Mapbox/lib"

export type MapProps = {
    phase: string
}

export const Map: React.FC<MapProps> = memo(({ phase }) => {
    useMapboxImage('photo', '/icons/attraction.png')

    useMapboxSource('korsakov-green', {
        type: 'geojson',
        data: '/static/korsakov-green.geojson',
    })
    useMapboxLayer({
        'id': 'korsakov-green',
        'source': 'korsakov-green',
        'type': 'fill',
        'minzoom': 10,
        'paint': {
            'fill-color': createFill(phase),
            'fill-opacity': 0.3,
        },
        filter: createFilter(phase, GREEN_FILTER),
    })
    useMapboxLayer({
        'id': 'korsakov-green-border',
        'source': 'korsakov-green',
        'type': 'line',
        'minzoom': 10,
        'paint': {
            'line-color': createFill(phase),
            'line-width': 2,
            'line-dasharray': [3, 2],
        },
        filter: createFilter(phase, GREEN_LINE_FILTER),
    })

    useMapboxSource('korsakov-water', {
        type: 'geojson',
        data: '/static/korsakov-water.geojson',
    })
    useMapboxLayer({
        'id': 'korsakov-water',
        'source': 'korsakov-water',
        'type': 'fill',
        'minzoom': 10,
        'paint': {
            'fill-color': '#256cb5',
            'fill-opacity': 0.9,
        },
    })

    useMapboxSource('korsakov-zones', {
        type: 'geojson',
        data: '/static/korsakov-zones.geojson',
    })
    useMapboxLayer({
        'id': 'korsakov-zones',
        'source': 'korsakov-zones',
        'type': 'fill',
        'minzoom': 10,
        'paint': {
            'fill-color': createFill(phase),
            'fill-opacity': 0.4,
        },
        filter: createFilter(phase, ZONE_FILTER),
    })
    useMapboxLayer({
        'id': 'korsakov-zones-border',
        'source': 'korsakov-zones',
        'type': 'line',
        'minzoom': 10,
        'paint': {
            'line-color': createFill(phase),
            'line-width': 2,
        },
        filter: createFilter(phase, ZONE_BORDER_FILTER),
    })

    useMapboxSource('korsakov-port-zones', {
        type: 'geojson',
        data: '/static/korsakov-port_zones.geojson',
    })
    useMapboxLayer({
        'id': 'korsakov-port-zones',
        'source': 'korsakov-port-zones',
        'type': 'fill',
        'minzoom': 10,
        'paint': {
            // 'fill-color': createFill(initPhase),
            'fill-color': '#fffff0',
            'fill-opacity': 1,
        },
    })

    useMapboxSource('korsakov-roads', {
        type: 'geojson',
        data: '/static/korsakov-roads.geojson',
    })
    useMapboxLayer({
        'id': 'korsakov-roads',
        'source': 'korsakov-roads',
        'type': 'fill',
        'minzoom': 10,
        'paint': {
            'fill-color': '#86837E',
            'fill-opacity': 1,
        },
    })

    useMapboxSource('korsakov-osm', {
        type: 'geojson',
        data: '/static/korsakov-osm.geojson'
    })
    useMapboxLayer({
        'id': 'korsakov-osm-3d',
        'source': 'korsakov-osm',
        'type': 'fill-extrusion',
        'minzoom': 10,
        'paint': {
            'fill-extrusion-color': '#fffff0',
            'fill-extrusion-height': ['*',
                0.75,
                ['get', 'height'],
            ],
        }
    })

    useMapboxSource('korsakov-buildings', {
        type: 'geojson',
        data: '/static/korsakov-buildings.geojson',
    })
    useMapboxLayer({
        'id': 'korsakov-buildings-3d',
        'source': 'korsakov-buildings',
        'type': 'fill-extrusion',
        'minzoom': 10,
        'paint': {
            'fill-extrusion-color': createFill(phase),
            'fill-extrusion-height': ['*',
                0.75,
                ['get', 'height'],
            ],
            'fill-extrusion-base': ['get', 'offset'],
        },
        filter: createFilter(phase, BUILDING_FILTER),
    })

    useMapboxSource('korsakov-port-buildings', {
        type: 'geojson',
        data: '/static/korsakov-port_buildings.geojson',
    })
    useMapboxLayer({
        'id': 'korsakov-port-3d',
        'source': 'korsakov-port-buildings',
        'type': 'fill-extrusion',
        'minzoom': 10,
        'paint': {
            'fill-extrusion-color': createFill(phase),
            'fill-extrusion-height': ['*',
                0.75,
                ['get', 'height'],
            ],
            'fill-extrusion-base': ['get', 'offset'],
        },
    })

    const effect = useCallback<MapboxEffect>(map => {
        const layer = createMuseumLayer('museum-3d')
        map.addLayer(layer)

        return () => {
            map.removeLayer('museum-3d')
        }
    }, [])
    useMapboxEffect(effect)

    useMapboxSource('korsakov-photos', {
        type: 'geojson',
        data: '/static/korsakov-photos.geojson',
    })
    useMapboxLayer({
        'id': 'korsakov-photos-icon',
        'source': 'korsakov-photos',
        'type': 'symbol',
        'minzoom': 10,
        'layout': {
            'icon-size': 0.5,
            'icon-image': 'photo',
        },
    })

    return null
})
Map.displayName = 'Map'
