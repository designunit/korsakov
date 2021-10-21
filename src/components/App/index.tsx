import React, { ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
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
import { InfographicsProps } from "./Infographics"
import { TextDialog } from '../TextDialog'
import { LocaleContext } from '@/context/locale'

const Infographics = dynamic<InfographicsProps>(import("./Infographics").then(m => m.Infographics), {
    ssr: false,
})

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
    const { locale } = useContext(LocaleContext)

    const [currentPhase, setCurrentPhase] = useState(initialPhase)

    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [imgSrc, setImgSrc] = useState('')

    const [textDialogOpen, setTextDialogOpen] = useState(false)
    const [textDialogContent, setTextDialogContent] = useState<ReactNode>(null)

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
    }, [t, locale])

    const onChangePhase = useCallback(newPhase => {
        setCurrentPhase(newPhase)
    }, [])

    let [isDialogOpen, setDialogIsOpen] = useState(false)
    const onCloseDialog = useCallback(() => {
        setDialogIsOpen(false)
    }, [])

    const onCloseTextDialog = useCallback(() => setTextDialogOpen(false), [])

    const onFeatureClick = useCallback<OnFeatureClick>(f => {
        const props = f.properties as any
        const src = process.env.NEXT_PUBLIC_BASE_PATH + props.src

        console.log('click on ', src)

        setImgSrc(src)
        setDialogIsOpen(true)
    }, [])

    const markerSetContent = useCallback((content) => {
        setTextDialogContent(content)
        setTextDialogOpen(true)
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

                    <CollapseItem label={t('description')}>
                        <p className="px-4">
                            {t(`description_${currentPhase}`)}
                        </p>
                        <Infographics
                            phase={currentPhase}
                        />
                        <p className="px-4 text-center">
                            {t('info_name')}
                        </p>
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
                    <CollapseItem label={t('about_project_title')}>
                        <p className="px-4">
                            {t(`about_project`)}
                        </p>
                    </CollapseItem>
                </Collapse>
                <div
                    className="flex gap-8 px-4 pt-8 pb-8 sticky bottom-0 bg-gray-200"
                >
                    <a
                        className="flex-1 h-8 flex"
                        href='https://sakhalinecopolis.ru/'
                    >
                        <img
                            style={{ display: 'block', width: '100%' }}
                            src={`${process.env.NEXT_PUBLIC_BASE_PATH}/logos/ecopolis.svg`}
                            className="text-black"
                        />
                    </a>
                    <a
                        className="flex-1 h-8 flex"
                        href='https://www.nzemlya.com/'
                    >
                        <img
                            style={{ display: 'block', width: '100%' }}
                            src={`${process.env.NEXT_PUBLIC_BASE_PATH}/logos/newzemla.svg`}
                        />
                    </a>
                    <a
                        className="flex-1 h-8 flex"
                        href='https://unit4.io/'
                    >
                        <img
                            style={{ display: 'block', width: '100%' }}
                            src={`${process.env.NEXT_PUBLIC_BASE_PATH}/logos/unit.svg`}
                        />
                    </a>
                </div>
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
                            url={`${process.env.NEXT_PUBLIC_BASE_PATH}/static/korsakov-tags.geojson`}
                            phase={currentPhase}
                            setContent={markerSetContent}
                        />
                    )}
                    <MapController
                        phase={currentPhase}
                        onClick={onFeatureClick}
                        visibility={layerVisibility}
                    />

                    <a
                        style={{
                            position: 'absolute',
                            zIndex: 2,
                            bottom: 38,
                            left: 10,
                            opacity: .75,
                            height: 19,
                            width: 82,
                        }}
                        href='https://unit4.io/'
                    >
                        <img
                            src={`${process.env.NEXT_PUBLIC_BASE_PATH}/logos/unitBlack.svg`}
                        />
                    </a>
                    <MapDebug />
                </AppMap>

                {/* <ArrowsExpandIcon
                    id='whiteStroke'
                    onClick={handle.active ? handle.exit : handle.enter}
                    className={`absolute top-0 right-0 z-1 w-6 m-3 cursor-pointer hidden md:block text-white`}
                /> */}
            </main>

            <ImageDialog
                open={isDialogOpen}
                onClose={onCloseDialog}
                src={imgSrc}
                width={100}
                height={60}
            />

            <TextDialog
                open={textDialogOpen}
                onClose={onCloseTextDialog}
            >
                {textDialogContent}
            </TextDialog>
        </>
    )
}
