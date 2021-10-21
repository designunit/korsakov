import { useCallback, useContext, useState } from 'react'
import { RadioGroup } from '@headlessui/react'
import { useRouter } from 'next/dist/client/router'
import { LocaleContext } from '@/context/locale'

const langs = ['ru', 'en']

export const LangButton: React.FC = props => {
    const router = useRouter()
    const { locale, setLocale } = useContext(LocaleContext)

    const onClick = useCallback(value => {
        setLocale(value)
        router.push('/', '/', { locale: value })
    }, [router])

    return (
        <div className="px-4 py-4 ml-auto">
            <RadioGroup value={locale} onChange={onClick}>
                <div className="flex">
                    {langs.map(lang => (
                        <RadioGroup.Option
                            key={lang}
                            value={lang}
                            className={({ active, checked }) =>
                                `${active
                                    ? 'ring-2 ring-offset-2 ring-offset-sky-300 ring-white ring-opacity-60'
                                    : ''
                                }
                                ${checked ? 'bg-green-500 bg-opacity-75 text-white' : 'bg-white'}
                                relative px-4 py-1 cursor-pointer focus:outline-none`
                            }
                        >
                            {({ active, checked }) => (
                                <RadioGroup.Label
                                    as="span"
                                    className={`font-medium  ${checked ? 'text-white' : 'text-gray-900'}`}
                                >
                                    {lang}
                                </RadioGroup.Label>
                            )}
                        </RadioGroup.Option>
                    ))}
                </div>
            </RadioGroup>
        </div>
    )
}
