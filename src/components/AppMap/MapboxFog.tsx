import { memo, useCallback } from "react"
import { MapboxEffect, useMapboxEffect } from "../Mapbox/lib"

export type MapboxFogProps = {
    rangeMin: number
    rangeMax: number
    horizonBlend: number
    color: string
}

export const MapboxFog: React.FC<MapboxFogProps> = memo(({ color, horizonBlend, rangeMin, rangeMax }) => {
    const effect = useCallback<MapboxEffect>(map => {
        map.setFog({
            "range": [rangeMin, rangeMax],
            "color": color,
            "horizon-blend": horizonBlend,
        })

        return () => {
            map.setFog(null as any)
        }
    }, [horizonBlend, color, rangeMin, rangeMax])
    useMapboxEffect(effect)

    return null
})

MapboxFog.displayName = "MapboxFog"
