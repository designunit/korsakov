import { useCallback, useEffect, useRef, useState } from "react"
import { PhaseSelect } from "@/components/PhaseSelect"
import { initMap, switchPhase, setLayerVisibility } from "@/map"
import mapboxgl from "mapbox-gl"
import { useRouter } from 'next/router'

import { Layout } from "../Layout"
import { Sidebar } from "../Sidebar"
import { Collapse, CollapseItem, Radio } from "../Collapse"
import { useTranslations } from "use-intl"
import { LangButton } from "../LangButton"
import { ImageDialog } from "../ImageDialog"
import { SwitchGroup } from "../SwitchGroup"

type LegendProps = {
    values: { label: string, color: string }[]
}
const Legend: React.FC<LegendProps> = props => (
    <ul className="px-4">
        {props.values.map((x, i) => (
            <li key={i} className="flex">
                <i className={`inline-block w-4 h-4 mr-2 ${x.color}`} />
                {x.label}
            </li>
        ))}
    </ul>
)

const phases = [
    'phase1',
    'phase2',
    'phase3',
    'phase4',
]

export type AppProps = {

}

export const App: React.FC<AppProps> = () => {
    const t = useTranslations('app')
    const router = useRouter()

    const [currentPhase, setCurrentPhase] = useState(phases[0])
    const ref = useRef()
    const mapRef = useRef<mapboxgl.Map>()

    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [imgSrc, setImgSrc] = useState('')

    const [showLayers, setShowLayers] = useState([
        {
            label: t('layer_green'),
            value: 'layer_green',
            layers: [
                'korsakov-green',
                'korsakov-green-border',
            ],
            checked: true,
        },
        {
            label: t('layer_buildings'),
            value: 'layer_buildings',
            checked: true,
            layers: [
                'korsakov-buildings-3d',
                'museum-3d',
            ],
        },
        {
            label: t('layer_buildings_osm'),
            value: 'layer_buildings_osm',
            checked: true,
            layers: [
                'korsakov-osm-3d',
            ],
        },
        {
            label: t('layer_zones'),
            value: 'layer_zones',
            checked: true,
            layers: [
                'korsakov-zones',
                'korsakov-zones-border',
            ],
        },
        {
            label: t('layer_port'),
            value: 'layer_port',
            checked: true,
            layers: [
                'korsakov-port-3d',
                'korsakov-port-zones',
            ],
        },
        {
            label: t('layer_roads'),
            value: 'layer_roads',
            checked: true,
            layers: [
                'korsakov-roads',
            ],
        },
        {
            label: t('layer_water'),
            value: 'layer_water',
            checked: true,
            layers: [
                'korsakov-water',
            ],
        },
        {
            label: t('layer_photos'),
            value: 'layer_photos',
            checked: true,
            layers: [
                'korsakov-photos-icon',
            ],
        },
    ])
    const onChangeShowLayer = useCallback((checked, i) => {
        setShowLayers(xs => xs.map((x, ii) => i !== ii ? x : {
            ...x,
            checked,
        }))
    }, [])
    useEffect(() => {
        if (!mapRef.current) {
            return
        }
        for (let item of showLayers) {
            for (let layer of item.layers) {
                try {
                    setLayerVisibility(mapRef.current, layer, item.checked)
                } catch {

                }
            }
        }
    }, [showLayers])
    useEffect(() => {
        setShowLayers(xs => xs.map(x => ({
            ...x,
            label: t(x.value),
        })))
    }, [t, router.locale])

    useEffect(() => {
        mapRef.current = initMap(ref.current, phases[0], f => {
            const props = f.properties as any
            const src = props.src

            console.log('click on ', src)

            setImgSrc(src)
            setDialogIsOpen(true)
        })
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

    let [isDialogOpen, setDialogIsOpen] = useState(false)
    const onCloseDialog = useCallback(() => {
        setDialogIsOpen(false)
    }, [])

    return (
        <Layout>
            <Sidebar
                open={sidebarOpen}
                onChange={setSidebarOpen}
                head={(
                    <div className="flex">
                        <h1 className="flex-1 font-bold text-xl px-2 lg:px-8 py-4">
                            {t('title')}
                        </h1>
                        <LangButton />
                    </div>
                )}
            >
                <Collapse>
                    <CollapseItem label={t('phases')}>
                        <Radio
                            onChange={onChangePhase}
                            values={[
                                {
                                    id: 'p1',
                                    label: t('phase1'),
                                    value: 'phase1',
                                },
                                {
                                    id: 'p2',
                                    label: t('phase2'),
                                    value: 'phase2',
                                },
                                {
                                    id: 'p3',
                                    label: t('phase3'),
                                    value: 'phase3',
                                },
                                {
                                    id: 'p4',
                                    label: t('phase4'),
                                    value: 'phase4',
                                },
                            ]}
                        />
                    </CollapseItem>
                    {/* <CollapseItem label={'Предустановленное'}>
                        If you're unhappy with your purchase for any reason, email us
                        within 90 days and we'll refund you in full, no questions asked.
                    </CollapseItem> */}
                    <CollapseItem label={t('legend')}>
                        <Legend
                            values={[
                                {
                                    label: 'Административные здания',
                                    color: 'bg-red-100',
                                },
                                {
                                    label: 'Зеленка',
                                    color: 'bg-green-700',
                                },
                            ]}
                        />
                    </CollapseItem>
                    <CollapseItem label={t('layers')} defaultOpen={false}>
                        <SwitchGroup
                            values={showLayers}
                            onChange={onChangeShowLayer}
                        />
                    </CollapseItem>
                    {/* <CollapseItem label={'Описание'}>
                        <p className="px-4">
                            If you are unhappy with your purchase for any reason, email us
                            within 90 days and we will refund you in full, no questions asked.
                        </p>
                    </CollapseItem> */}
                </Collapse>
            </Sidebar>

            <main role="main" className="w-full h-full">
                <div ref={ref as any} style={{
                    width: '100%',
                    height: '100%',
                }}></div>
            </main>

            <ImageDialog
                open={isDialogOpen}
                onClose={onCloseDialog}
                src={imgSrc}
                width={100}
                height={60}
            />
        </Layout>
    )
}
