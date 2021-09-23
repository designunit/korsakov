import { Mapbox } from "@/components/Mapbox"
import React, { memo } from "react"

export type AppMapProps = {

}

export const AppMap: React.FC<AppMapProps> = memo(props => (
        <Mapbox>
            {props.children}
        </Mapbox>
    )
)

AppMap.displayName = 'AppMap'
