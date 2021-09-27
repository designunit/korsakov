import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from 'next/router'

import { Sidebar } from "../Sidebar"
import { Collapse, CollapseItem } from "../Collapse"
import { useTranslations } from "use-intl"
import { LangButton } from "../LangButton"
import { ImageDialog } from "../ImageDialog"
import { SwitchGroup } from "../SwitchGroup"
import { AppMap } from "../AppMap"
import { Map } from "./Map"
import { MapboxTerrain } from "../AppMap/MapboxTerrain"
import { MapController, OnFeatureClick } from "./MapController"
import { MapDebug } from "./MapDebug"
import { MapboxSky } from "../AppMap/MapboxSky"
import { MapboxFog } from "../AppMap/MapboxFog"
import { MapMarkers } from "./MapMarkers"
import { Radio } from "../Radio"

const phases = [
    'phase1',
    'phase2',
    'phase3',
    'phase4',
]

export type AppProps = {
    initialPhase?: string

    legend: React.ReactNode
}

export const App: React.FC<AppProps> = ({ initialPhase = phases[0], ...props }) => {
    const t = useTranslations('app')
    const router = useRouter()

    const [currentPhase, setCurrentPhase] = useState(initialPhase)

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
            label: t('layer_tags'),
            value: 'layer_tags',
            checked: true,
            layers: [],
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
    const layerVisibility = useMemo(() => {
        return showLayers.flatMap(item => item.layers.map(layer => ({
            layer,
            visible: item.checked,
        })))
    }, [showLayers])
    const showTags = useMemo(() => {
        const x = showLayers.find(item => item.value === 'layer_tags')
        return x?.checked ?? true
    }, [showLayers])
    const onChangeShowLayer = useCallback((checked, i) => {
        setShowLayers(xs => xs.map((x, ii) => i !== ii ? x : {
            ...x,
            checked,
        }))
    }, [])
    useEffect(() => {
        setShowLayers(xs => xs.map(x => ({
            ...x,
            label: t(x.value),
        })))
    }, [t, router.locale])

    const onChangePhase = useCallback(newPhase => {
        setCurrentPhase(newPhase)
    }, [])

    let [isDialogOpen, setDialogIsOpen] = useState(false)
    const onCloseDialog = useCallback(() => {
        setDialogIsOpen(false)
    }, [])

    const onFeatureClick = useCallback<OnFeatureClick>(f => {
        const props = f.properties as any
        const src = props.src

        console.log('click on ', src)

        setImgSrc(src)
        setDialogIsOpen(true)
    }, [])

    return (
        <>
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
                    <CollapseItem label={t('legend')}>
                        {props.legend}
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
                <AppMap>
                    <MapboxTerrain
                        exaggeration={1.5}
                    />
                    <MapboxSky />
                    <MapboxFog
                        rangeMin={0}
                        rangeMax={20}
                        color={'white'}
                        horizonBlend={0.1}
                    />
                    <Map
                        phase={initialPhase}
                    />
                    {!showTags ? null : (
                        <MapMarkers
                            url={'/static/korsakov-tags.geojson'}
                            phase={currentPhase}
                        />
                    )}
                    <MapController
                        phase={currentPhase}
                        onClick={onFeatureClick}
                        visibility={layerVisibility}
                    />
                    <MapDebug />
                </AppMap>
            </main>

            <ImageDialog
                open={isDialogOpen}
                onClose={onCloseDialog}
                src={imgSrc}
                width={100}
                height={60}
            />
        </>
    )
}
