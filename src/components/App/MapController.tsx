import { queryFeatureInPoint, setLayerVisibility, switchPhase } from "@/map"
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
    useMapboxEvent("click", event => {
        const f = queryFeatureInPoint(event.target, event.point, ["korsakov-photos-icon"])
        if (f) {
            props.onClick(f)
        }
    })

    // HOVER ICONS
    useMapboxEvent("mousemove", event => {
        const map = event.target
        const f = queryFeatureInPoint(map, event.point, ["korsakov-photos-icon"])
        const cursor = f
            ? "pointer"
            : "default"

        map.getCanvas().style.cursor = cursor
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

MapController.displayName = "MapController"
