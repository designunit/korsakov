import { useMapboxEvent } from "../Mapbox/lib"

export type MapDebugProps = {
}

export const MapDebug: React.FC<MapDebugProps> = props => {
    useMapboxEvent("moveend", event => {
        const map = event.target

        // eslint-disable-next-line no-console
        console.log({
            center: map.getCenter(),
            zoom: map.getZoom(),
            pitch: map.getPitch(),
            bearing: map.getBearing(),
        })
    })

    return null
}
