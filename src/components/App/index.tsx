import { Fragment, useCallback, useEffect, useRef, useState } from "react"
import { PhaseSelect } from "@/components/PhaseSelect"
import { initMap, switchPhase, setLayerVisibility } from "@/map"
import mapboxgl from "mapbox-gl"

import { Menu, Switch, Transition } from '@headlessui/react'
import { Layout } from "../Layout"
import { Sidebar } from "../Sidebar"
import { Collapse, CollapseItem, Radio } from "../Collapse"
import { useTranslations } from "use-intl"
import { LangButton } from "../LangButton"

type SwitchGroupProps = {
    values: Array<{
        label: string,
        checked: boolean,
    }>,
    onChange?: (value: any, index: number) => void
}

const SwitchGroup: React.FC<SwitchGroupProps> = props => {
    return (
        <Switch.Group>
            {props.values.map((item, i) => {
                return (
                    <div
                        key={i}
                        className="flex items-center px-4 py-2"
                    >
                        <Switch.Label className="mr-4 flex-1">{item.label}</Switch.Label>
                        <Switch checked={item.checked}
                            // onChange={(checked) => setEnabled(enableds.map((x, ii) => ii === i ? checked : x))}
                            onChange={(checked) => {
                                if (typeof props.onChange === 'function') {
                                    props.onChange(checked, i)
                                }
                            }}
                            className={`${item.checked ? 'bg-green-500' : 'bg-gray-500'
                                } relative inline-flex items-center w-8 h-5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                        >
                            <span
                                className={`${item.checked ? 'translate-x-4' : 'translate-x-1'
                                    } inline-block w-3 h-3 transform bg-white rounded-full transition-transform`}
                            />
                        </Switch>
                    </div>
                )
            })}
        </Switch.Group>
    )
}

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

function MyDropdown() {
    return (
        <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-black rounded-md bg-opacity-60 hover:bg-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                More
                {/* <ChevronDownIcon
                    className="w-5 h-5 ml-2 -mr-1 text-violet-200 hover:text-violet-100"
                    aria-hidden="true"
                /> */}
            </Menu.Button>
            <Transition
                as={Fragment}
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
            >
                <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                        {({ active }) => (
                            <a
                                className={`${active ? 'bg-blue-500 text-white' : 'bg-white text-black'
                                    }`}
                                href="/account-settings"
                            >
                                Account settings
                            </a>
                        )}
                    </Menu.Item>
                    <Menu.Item>
                        {({ active }) => (
                            <a
                                className={`${active && 'bg-blue-500'}`}
                                href="/account-settings"
                            >
                                Documentation
                            </a>
                        )}
                    </Menu.Item>
                    <Menu.Item disabled>
                        <span className="opacity-75">Invite a friend (coming soon!)</span>
                    </Menu.Item>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}

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

    const [currentPhase, setCurrentPhase] = useState(phases[0])
    const ref = useRef()
    const mapRef = useRef<mapboxgl.Map>()

    const [showLayers, setShowLayers] = useState([
        {
            label: 'Парки и озеленение',
            layers: [
                'korsakov-green',
                'korsakov-green-border',
            ],
            checked: true,
        },
        {
            label: 'Дома и строения',
            checked: true,
            layers: [
                'korsakov-buildings-3d',
                'korsakov-osm-3d',
            ],
        },
        {
            label: 'Функциональные зоны',
            checked: true,
            layers: [
                'korsakov-zones',
                'korsakov-zones-border',
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
                setLayerVisibility(mapRef.current, layer, item.checked)
            }
        }
    }, [showLayers])

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
        <Layout>
            <Sidebar>
                <div className="sticky top-0 w-full">
                    <div className="flex">
                        <h1 className="flex-1 font-bold text-xl px-8 py-4">
                            {t('title')}
                        </h1>
                        <LangButton />
                    </div>
                    <hr />
                </div>

                <Collapse>
                    <CollapseItem label={'Фазы возведения мечты'}>
                        <Radio
                            onChange={onChangePhase}
                            values={[
                                {
                                    id: 'p1',
                                    label: 'Накопление',
                                    value: 'phase1',
                                },
                                {
                                    id: 'p2',
                                    label: 'Возвеличивание',
                                    value: 'phase2',
                                },
                                {
                                    id: 'p3',
                                    label: 'Эндшпиль',
                                    value: 'phase3',
                                },
                                {
                                    id: 'p4',
                                    label: 'Насладиться будущим',
                                    value: 'phase4',
                                },
                            ]}
                        />
                    </CollapseItem>
                    {/* <CollapseItem label={'Предустановленное'}>
                        If you're unhappy with your purchase for any reason, email us
                        within 90 days and we'll refund you in full, no questions asked.
                    </CollapseItem> */}
                    <CollapseItem label={'Слои карты'}>
                        <SwitchGroup
                            values={showLayers}
                            onChange={onChangeShowLayer}
                        />
                    </CollapseItem>
                    <CollapseItem label={'Легенда'}>
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
                    <CollapseItem label={'Описание'}>
                        <p className="px-4">
                            If you are unhappy with your purchase for any reason, email us
                            within 90 days and we will refund you in full, no questions asked.
                        </p>
                    </CollapseItem>
                </Collapse>
            </Sidebar>

            <main role="main" className="w-full h-full">
                <div ref={ref as any} style={{
                    width: '100%',
                    height: '100%',
                }}></div>
            </main>
        </Layout>
    )
}
