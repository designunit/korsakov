import { useCallback, useEffect, useRef, useState } from "react"
import { PhaseSelect } from "@/components/PhaseSelect"
import { initMap, switchPhase } from "@/map"
import mapboxgl from "mapbox-gl"

const phases = [
    'phase1',
    'phase2',
    'phase3',
    'phase4',
]

export type AppProps = {

}

export const App: React.FC<AppProps>  = () => {
    const [currentPhase, setCurrentPhase] = useState(phases[0])
    const ref = useRef()
    const mapRef = useRef<mapboxgl.Map>()

    useEffect(() => {
        mapRef.current = initMap(ref.current, phases[0])
    }, [])

    useEffect(() => {
        if (!mapRef.current) {
            return
        }
        switchPhase(mapRef.current, currentPhase)
    }, [currentPhase])

    const onChangePhase = useCallback(newPhase => {
        setCurrentPhase(newPhase)
    }, [])

    return (
        <>
            <div ref={ref as any} style={{
                width: '100%',
                height: '100%',
            }}></div>

            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
            }}>
                <main className="flex flex-col flex-1 text-center bg-white">
                    <PhaseSelect
                        phases={phases}
                        current={currentPhase}
                        onChange={onChangePhase}
                    />
                </main>
            </div>
        </>
    )
}
