import { memo } from "react"
import useSWR from "swr"
import { ResponsiveSunburst } from "@nivo/sunburst"
import { useRouter } from "next/router"

const fetcher = async (url: string) => {
    const res = await fetch(url)
    if (!res.ok) {
        return undefined
    }

    return res.json() as object
}

export type InfographicsProps = {
    phase: string
}

const infographicsMap = new Map([
    ["phase1", "korsakov-infographics_01_"],
    ["phase2", "korsakov-infographics_02_"],
    ["phase3", "korsakov-infographics_03_"],
    ["phase4", "korsakov-infographics_04_"],
])

export const Infographics: React.FC<InfographicsProps> = memo(({ phase }) => {
    const router = useRouter()
    const phaseFilePiece = infographicsMap.get(phase)
    const localeFilePiece = ["ru","en"].includes(router.locale as string)
        ? router.locale
        : "ru"
    const url = `/static/${phaseFilePiece}${localeFilePiece}.json`

    const { data } = useSWR(url, fetcher)
    if (!data) {
        return null
    }

    return (
        <div className="relative w-full h-96">
            <ResponsiveSunburst
                data={data}
                margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
                id="name"
                value="loc"
                valueFormat={x => x.toFixed()}
                cornerRadius={4}
                borderColor={"rgb(229, 231, 235)"}
                borderWidth={1}
                colors={(node: any) => {
                    return node.data.color
                }}
                childColor={(parent: any, node: any) => {
                    return node.data.color
                }}
                enableArcLabels={true}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{ from: "color", modifiers: [["darker", 1.4]] }}
            />
        </div>
    )
})

Infographics.displayName = "Infographics"
