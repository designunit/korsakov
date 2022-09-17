import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import { createMap } from "./mapbox"
import { MapboxContext } from "./lib"

export type MapboxProps = {
}

export const Mapbox: React.FC<MapboxProps> = props => {
    const ref = useRef<HTMLDivElement>(null)
    const [map, setMap] = useState<mapboxgl.Map>()

    useEffect(() => {
        // skip on server side rendering
        if (!ref.current || typeof window === "undefined") {
            return
        }

        const container = ref.current
        const map = createMap({
            container,
            center: [
                142.79405865469897,
                46.6188040383542,
            ],
            style: "mapbox://styles/mapbox/satellite-v9", // style URL
            zoom: 14.11258863317506,
            pitch: 57.99999999999994,
            bearing: -8.799999999999962,
        })

        const onLoad = () => {
            setMap(map)
        }

        map.once("load", onLoad)

        return () => {
            map.off("load", onLoad)

            setTimeout(() => {
                map.remove()
            }, 0)
        }
    }, [])

    return (
        <div
            ref={ref}
            style={{
                width: "100%",
                height: "100%",
            }}
        >
            {!map
                ? null
                : (
                    <MapboxContext.Provider value={map}>
                        {props.children}
                    </MapboxContext.Provider>
                )}
        </div>
    )
}
