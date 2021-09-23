import { setLayerVisibility, switchPhase } from "@/map"
import { MapboxGeoJSONFeature } from "mapbox-gl"
import { memo, useCallback } from "react"
import { MapboxEffect, useMapboxEffect, useMapboxEvent } from "../Mapbox/lib"

export type OnFeatureClick = (feature: MapboxGeoJSONFeature) => void

export type MapControllerProps = {
    phase: string
    onClick: OnFeatureClick
    visibility: Array<{
        layer: string,
        visible: boolean,
    }>
}

export const MapController: React.FC<MapControllerProps> = memo(({ phase, visibility, ...props }) => {
    // SWITCH PHASE
    const swithPhaseEffect = useCallback<MapboxEffect>(map => {
        switchPhase(map, phase)
        return () => { }
    }, [phase])
    useMapboxEffect(swithPhaseEffect)

    // SHOW IMAGE ON ICON CLICK
    useMapboxEvent('click', event => {
        const map = event.target
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
        props.onClick(selected)
    })

    // SHOW/HIDE LAYERS
    const showHideLayersEffect = useCallback<MapboxEffect>(map => {
        for (let { layer, visible } of visibility) {
            try {
                setLayerVisibility(map, layer, visible)
            } catch { }
        }
        return () => { }
    }, [visibility])
    useMapboxEffect(showHideLayersEffect)

    return null
})

MapController.displayName = 'MapController'
