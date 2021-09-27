import { ArrowRightIcon } from '@heroicons/react/solid'

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
