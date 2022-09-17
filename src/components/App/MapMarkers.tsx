import { useFeatrues } from "@/hooks/useFeatures"
import { memo } from "react"
import { Marker } from "../Mapbox/Marker"
import { Tag } from "./Tag"

type MarkerFeature = GeoJSON.Feature<GeoJSON.Point, Record<string, any>>
export type MarkerOnClick = (feature: GeoJSON.Feature) => void

export type MapMarkersProps = {
    url: string
    phaseField: string
    nameField: string
    descriptionField: string
    onClick: MarkerOnClick
}

export const MapMarkers: React.FC<MapMarkersProps> = memo(({ nameField, descriptionField, url, phaseField, onClick }) => {
    const items = useFeatrues<MarkerFeature>(url)

    return (
        <>
            {items
                .filter((f) => f.properties[phaseField] === true)
                .map((f, i) => {
                    const p = f.properties
                    const description = p[descriptionField]
                    return (
                        <Marker
                            key={p.id}
                            center={f.geometry.coordinates as [number, number]}
                        >
                            <Tag
                                onClick={description === ""
                                    ? undefined
                                    : () => onClick(f)}
                            >
                                {f.properties[nameField]}
                            </Tag>
                        </Marker>
                    )
                })}
        </>
    )
})

MapMarkers.displayName = "MapMarkers"
