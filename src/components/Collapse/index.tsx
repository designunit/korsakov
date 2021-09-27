import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/solid'

type BtnProps = {
    open: boolean
}

const Btn: React.FC<BtnProps> = props => (
    <Disclosure.Button className="flex items-center w-full px-2 py-2 text-sm font-medium text-left hover:bg-green-300 focus:outline-none focus-visible:ring focus-visible:ring-green-500 focus-visible:ring-opacity-75">
        <span className="flex-1 text-lg">
            {props.children}
        </span>
        <ChevronUpIcon
            className={`${props.open ? 'transform rotate-180' : ''} w-5 h-5 text-black`}
        />
    </Disclosure.Button>
)

export type CollapseItemProps = {
    label: string
    defaultOpen?: boolean
}

export const CollapseItem: React.FC<CollapseItemProps> = ({ defaultOpen = true, ...props }) => (
    <Disclosure defaultOpen={defaultOpen}>
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
        <div className="w-full max-w-md py-2 px-2 lg:px-8 mx-auto">
            {props.children}
        </div>
    )
}
