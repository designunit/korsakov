import { useFeatrues } from "@/hooks/useFeatures"
import { useRouter } from "next/router"
import { memo } from "react"
import { Marker } from "../Mapbox/Marker"
import { Tag } from "./Tag"

export type MapMarkersProps = {
    url: string
}

export const MapMarkers: React.FC<MapMarkersProps> = memo(props => {
    const router = useRouter()
    const items = useFeatrues(props.url)
    const field = `name_${router.locale}`

    return (
        <>
            {items.map((f: any, i) => (
                <Marker
                    key={f.properties.id}
                    // key={i}
                    center={f.geometry.coordinates}
                >
                    <Tag>
                        {f.properties[field]}
                    </Tag>
                </Marker>
            ))}
        </>
    )
})
MapMarkers.displayName = 'MapMarkers'
