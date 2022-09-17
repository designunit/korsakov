import { useCallback, useState } from "react"
import { RadioGroup } from "@headlessui/react"
import { useRouter } from "next/dist/client/router"

type Lang = {
    value: string
    name: string
}

const langs = [
    {
        value: "ru",
        name: "ru",
    },
    {
        value: "en",
        name: "en",
    },
]

export const LangButton: React.FC = props => {
    const router = useRouter()
    const [selected, setSelected] = useState(langs.find(x => x.value === router.locale))

    const onClick = useCallback((value: Lang) => {
        setSelected(value)
        router.push("/", "/", { locale: value.name })
    }, [router])

    return (
        <div className="px-4 py-4 ml-auto">
            <RadioGroup<"div", Lang> value={selected} onChange={onClick}>
                <div className="flex">
                    {langs.map(lang => (
                        <RadioGroup.Option
                            key={lang.name}
                            value={lang}
                            className={({ active, checked }) =>
                                `${active
                                    ? "ring-2 ring-offset-2 ring-offset-sky-300 ring-white ring-opacity-60"
                                    : ""
                                }
                                ${checked
                            ? "bg-green-500 bg-opacity-75 text-white"
                            : "bg-white"}
                                relative px-4 py-1 cursor-pointer focus:outline-none`
                            }
                        >
                            {({ active, checked }) => (
                                <RadioGroup.Label
                                    as="span"
                                    className={`font-medium  ${checked
                                        ? "text-white"
                                        : "text-gray-900"}`}
                                >
                                    {lang.name}
                                </RadioGroup.Label>
                            )}
                        </RadioGroup.Option>
                    ))}
                </div>
            </RadioGroup>
        </div>
    )
}
