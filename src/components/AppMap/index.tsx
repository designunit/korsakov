import { Mapbox } from "@/components/Mapbox"
import React, { memo } from "react"

export type AppMapProps = {
    children: React.ReactNode
}

export const AppMap: React.FC<AppMapProps> = memo(({ children }) => (
    <Mapbox>
        {children}
    </Mapbox>
))

AppMap.displayName = "AppMap"
