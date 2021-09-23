import { createContext, DependencyList, useCallback, useContext, useEffect } from "react"
import mapboxgl, { AnyLayer, AnySourceData, EventData, MapEventType } from "mapbox-gl"

export const MapboxContext = createContext<mapboxgl.Map>({} as mapboxgl.Map)

export function useMapbox() {
    return useContext(MapboxContext)
}

export type MapboxEffect = (map: mapboxgl.Map) => () => void
export function useMapboxEffect(effect: MapboxEffect) {
    const map = useContext(MapboxContext)

    useEffect(() => {
        return effect(map)
    }, [map, effect])
}

export type MapboxEvent<T extends keyof MapEventType> = (ev: MapEventType[T] & EventData) => void
export function useMapboxEvent<T extends keyof MapEventType>(event: T, callback: MapboxEvent<T>) {
    const map = useContext(MapboxContext)

    useEffect(() => {
        map.on(event, callback)
        return () => {
            map.off(event, callback)
        }
    }, [map, event, callback])
}

export function useMapboxSource(id: string, source: AnySourceData) {
    const effect = useCallback<MapboxEffect>(map => {
        map.addSource(id, source)

        return () => {
            setTimeout((map) => {
                const s = map.getSource(id)
                if (s) {
                    map.removeSource(id)
                }
            }, 0, map)
        }
    }, [id, source])

    useMapboxEffect(effect)
}

export type UseMapboxLayer = AnyLayer
export function useMapboxLayer(layer: AnyLayer) {
    const effect = useCallback<MapboxEffect>(map => {
        map.addLayer(layer)

        return () => {
            map.removeLayer(layer.id)
        }
    }, [layer])

    useMapboxEffect(effect)
}

export function useMapboxImage(id: string, src: string) {
    const effect = useCallback<MapboxEffect>(map => {
        map.loadImage(src, (error, image) => {
            if (error) {
                throw error
            }
            if (!image) {
                return
            }

            map.addImage(id, image)
        })

        return () => {
            if (map.hasImage(id)) {
                map.removeImage(id)
            }
        }
    }, [id, src])

    useMapboxEffect(effect)
}
