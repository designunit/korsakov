import { MapboxEffect, useMapboxEffect } from "@/components/Mapbox/lib"
import { ThreeLayer } from "@/map"
import { LngLatLike } from "mapbox-gl"
import { useCallback } from "react"

export function useThreeLayer(id: string, url: string, coord: LngLatLike) {
    const effect = useCallback<MapboxEffect>(map => {
        const layer = new ThreeLayer(id, url, coord)
        map.addLayer(layer)

        return () => {
            map.removeLayer(id)
        }
    }, [id, url, coord])

    useMapboxEffect(effect)
}
