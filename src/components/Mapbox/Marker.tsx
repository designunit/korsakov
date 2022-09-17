import mapboxgl from "mapbox-gl"
import { memo, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { useMapbox } from "./lib"

export type OnMarkerDrag = (marker: mapboxgl.Marker) => void
export type MarkerProps = Omit<mapboxgl.MarkerOptions, "element"> & {
    center: mapboxgl.LngLatLike,
    onDrag?: OnMarkerDrag
    onDragStart?: OnMarkerDrag
    onDragEnd?: OnMarkerDrag
}

export const Marker: React.FC<MarkerProps> = memo(({ children, center, onDrag, onDragStart, onDragEnd, ...options }) => {
    const map = useMapbox()
    const ref = useRef<HTMLDivElement>(document.createElement("div"))
    const marker = useRef<mapboxgl.Marker>()

    useEffect(() => {
        const r = ref.current
        const m = new mapboxgl.Marker(r, options)
        m.setLngLat(center).addTo(map)
        // m.addTo(map)

        marker.current = m

        return () => {
            m.remove()
            r.remove()
        }
    }, [center, map, options])

    useEffect(() => {
        marker.current!.setLngLat(center)
    }, [center])

    useEffect(() => {
        if (!onDrag) {
            return
        }
        const fn = (event: any) => {
            onDrag(event.target)
        }
        marker.current!.on("drag", fn)

        return () => {
            marker.current!.off("drag", fn)
        }
    }, [onDrag])

    useEffect(() => {
        if (!onDragStart) {
            return
        }
        const fn = (event: any) => {
            onDragStart(event.target)
        }
        marker.current!.on("dragstart", fn)

        return () => {
            marker.current!.off("dragstart", fn)
        }
    }, [onDragStart])

    useEffect(() => {
        if (!onDragEnd) {
            return
        }
        const fn = (event: any) => {
            onDragEnd(event.target)
        }
        marker.current!.on("dragend", fn)

        return () => {
            marker.current!.off("dragend", fn)
        }
    }, [onDragEnd])

    return createPortal(children, ref.current)
})

Marker.displayName = "Marker"
