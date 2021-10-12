import { useFeatrues } from "@/hooks/useFeatures"
import { useRouter } from "next/router"
import { Dispatch, memo, ReactNode, SetStateAction, useCallback } from "react"
import { Marker } from "../Mapbox/Marker"
import { Tag } from "./Tag"

export type MapMarkersProps = {
    url: string
    phase: string
    setContent: Dispatch<SetStateAction<ReactNode>>
}

export const MapMarkers: React.FC<MapMarkersProps> = memo(props => {
    const router = useRouter()
    const items = useFeatrues(props.url)
    const field = `name_${router.locale}`

    return (
        <>
            {items
                .filter((f: any) => f.properties[props.phase] === true)
                .map((f: any, i) => {
                    const description = f.properties[`description_${router.locale}`]
                    const dialogContent = <>
                        <h1 className="flex-1 font-bold text-xl pb-3">
                            {f.properties[field]}
                        </h1>
                        <span className="text-black">
                            {description}
                        </span>
                    </>
                    return (
                        <Marker
                            key={f.properties.id}
                            // key={i}
                            center={f.geometry.coordinates}
                        >
                            <Tag
                                setContent={description === '' ? null : () => props.setContent(dialogContent)}
                            >
                                {f.properties[field]}
                            </Tag>
                        </Marker>
                    )
                })}
        </>
    )
})
MapMarkers.displayName = 'MapMarkers'
