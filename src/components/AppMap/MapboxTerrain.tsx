import { memo, useCallback } from "react"
import { MapboxEffect, useMapboxEffect, useMapboxSource } from "../Mapbox/lib"

export type MapboxTerrainProps = {
    exaggeration: number
}

export const MapboxTerrain: React.FC<MapboxTerrainProps> = memo(({ exaggeration }) => {
    const effect = useCallback<MapboxEffect>(map => {
        map.setTerrain({
            source: 'mapbox-dem',
            exaggeration: exaggeration
        })

        return () => {
            map.setTerrain(null)
        }
    }, [exaggeration])

    useMapboxSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.terrain-rgb',
        tileSize: 512,
        maxzoom: 14,
    })

    useMapboxEffect(effect)

    return null
})

MapboxTerrain.displayName = 'MapboxTerrain'
