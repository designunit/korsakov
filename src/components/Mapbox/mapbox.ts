import mapboxgl, { LngLatLike } from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

mapboxgl.accessToken = "pk.eyJ1IjoidG1zaHYiLCJhIjoiZjYzYmViZjllN2MxNGU1OTAxZThkMWM5MTRlZGM4YTYifQ.uvMlwjz7hyyY7c54Hs47SQ"

export type MapboxOptions = {
    center: LngLatLike
    style: string
    zoom: number
    pitch: number
    bearing: number
    container: HTMLElement
}

export function createMap(options: MapboxOptions) {
    let map = new mapboxgl.Map({
        ...options,
        antialias: true,
    })

    return map
}
