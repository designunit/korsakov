import { MapboxEffect, useMapboxEffect } from "@/components/Mapbox/lib"
import { ThreeLayer } from "@/map"
import { useCallback } from "react"

export function useThreeLayer(id: string, url: string) {
    const effect = useCallback<MapboxEffect>(map => {
        const layer = new ThreeLayer(id, url)
        map.addLayer(layer)

        return () => {
            map.removeLayer(id)
        }
    }, [id, url])

    useMapboxEffect(effect)
}
