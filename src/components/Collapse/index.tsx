import { Disclosure } from "@headlessui/react"
import { ChevronUpIcon } from "@heroicons/react/solid"

type BtnProps = {
    open: boolean
    children?: React.ReactNode
}

const Btn: React.FC<BtnProps> = ({ open, children }) => (
    <Disclosure.Button className="flex items-center w-full px-2 py-2 text-sm font-medium text-left hover:bg-green-300 focus:outline-none focus-visible:ring focus-visible:ring-green-500 focus-visible:ring-opacity-75">
        <span className="flex-1 text-lg">
            {children}
        </span>
        <ChevronUpIcon
            className={`${open
                ? "transform rotate-180"
                : ""} w-5 h-5 text-black`}
        />
    </Disclosure.Button>
)

export type CollapseItemProps = {
    label: string
    defaultOpen?: boolean
    children?: React.ReactNode
}

export const CollapseItem: React.FC<CollapseItemProps> = ({ defaultOpen = true, label, children }) => (
    <Disclosure defaultOpen={defaultOpen}>
        {({ open }) => (
            <>
                <Btn open={open}>
                    {label}
                </Btn>
                <Disclosure.Panel className="py-4 text-sm">
                    {children}
                </Disclosure.Panel>
            </>
        )}
    </Disclosure>
)

export type CollapseProps = {
    children?: React.ReactNode
}

export const Collapse: React.FC<CollapseProps> = ({ children }) => {
    return (
        <div className="w-full max-w-md py-2 px-2 lg:px-8 mx-auto">
            {children}
        </div>
    )
}
