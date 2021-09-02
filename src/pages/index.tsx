import { NextPage } from "next"
import { useEffect, useRef } from "react"
import { PhaseSelect } from "@/components/PhaseSelect"
import { initMap } from "@/map"

const Page: NextPage = () => {
    const ref = useRef()

    useEffect(() => {
        initMap(ref.current)
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
                    <PhaseSelect></PhaseSelect>
                </main>
            </div>
        </>
    )
}

export default Page
