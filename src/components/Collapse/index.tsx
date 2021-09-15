import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon, TemplateIcon, CheckIcon, ArrowRightIcon } from '@heroicons/react/solid'

import { useCallback, useState } from 'react'
import { RadioGroup } from '@headlessui/react'

export type RadioOnChange<T> = (value: T) => void
export type RadioValue<T> = {
    id: string
    label: string
    value: T
}
export type RadioProps<T> = {
    values: RadioValue<T>[]
    onChange?: RadioOnChange<T>
}

export const Radio: React.FC<RadioProps<any>> = props => {
    const [selected, setSelected] = useState(props.values[0].value)

    const onChange = useCallback(item => {
        setSelected(item)

        if (typeof props.onChange === 'function') {
            props.onChange(item)
        }
    }, [props])

    return (
        <div className="w-full max-w-md">
            <RadioGroup value={selected} onChange={onChange}>
                {/* <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label> */}
                <div className="space-y-2">
                    {props.values.map(x => (
                        <RadioGroup.Option
                            key={x.id}
                            value={x.value}
                            className={({ active, checked }) =>
                                `${active
                                    // ? 'ring-2 ring-offset-2 ring-offset-sky-300 ring-white ring-opacity-60'
                                    ? ''
                                    : ''
                                }
                                ${checked ? 'bg-green-300' : ''}
                                ${checked ? 'text-black' : 'text-gray-400'}
                                flex relative px-4 py-2 cursor-pointer focus:outline-none hover:bg-green-300 hover:text-black`
                            }
                        >
                            {({ active, checked }) => (
                                <div className={`w-full flex`}>
                                    <span className={`flex-1`}>
                                        {x.label}
                                    </span>
                                    {/* <CheckIcon className={`w-5 h-5 ${checked ? 'text-black' : 'text-gray-300'}`} /> */}
                                    {!checked ? null : (
                                        <ArrowRightIcon className={`w-4 h-4`} />
                                    )}
                                </div>
                            )}
                        </RadioGroup.Option>
                    ))}
                </div>
            </RadioGroup>
        </div>
    )
}

type BtnProps = {
    open: boolean
}

const Btn: React.FC<BtnProps> = props => (
    <Disclosure.Button className="flex w-full px-2 py-2 text-sm font-medium text-left hover:bg-green-300 focus:outline-none focus-visible:ring focus-visible:ring-green-500 focus-visible:ring-opacity-75">
        {/* <TemplateIcon className="w-5 h-5" /> */}
        {/* <span className="flex-1 pl-2"> */}
        <span className="flex-1 text-lg">
            {props.children}
        </span>
        <ChevronUpIcon
            className={`${props.open ? 'transform rotate-180' : ''
                } w-5 h-5 text-black`}
        />
    </Disclosure.Button>
)

export type CollapseItemProps = {
    label: string
}

export const CollapseItem: React.FC<CollapseItemProps> = props => (
    <Disclosure defaultOpen>
        {({ open }) => (
            <>
                <Btn open={open}>
                    {props.label}
                </Btn>
                <Disclosure.Panel className="py-4 text-sm">
                    {props.children}
                </Disclosure.Panel>
            </>
        )}
    </Disclosure>
)

export type CollapseProps = {

}

export const Collapse: React.FC<CollapseProps> = props => {
    return (
        <div className="w-full max-w-md p-2 px-8 mx-auto">
            {props.children}
        </div>
    )
}
