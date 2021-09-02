import { NextPage } from "next"
import { useCallback, useEffect, useRef, useState } from "react"
import { PhaseSelect } from "@/components/PhaseSelect"
import { initMap } from "@/map"

const phases = [
    'phase1',
    'phase2',
    'phase3',
    'phase4',
]

const Page: NextPage = () => {
    const [currentPhase, setCurrentPhase] = useState(phases[0])
    const ref = useRef()

    useEffect(() => {
        initMap(ref.current)
    }, [])

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
                <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center bg-white">
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

export default Page
