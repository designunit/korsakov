import { ArrowRightIcon } from "@heroicons/react/solid"
import { useCallback } from "react"

export type SidebarProps = {
    open: boolean
    onChange: (open: boolean) => void
}

export const Sidebar: React.FC<SidebarProps> = props => {
    const onClick = useCallback(() => {
        props.onChange(!props.open)
    }, [props])

    return (
        <aside className={`absolute top-0 left-0 m-3 sm:w-1/3 md:w-1/4 bg-gray-100 ease-in-out transition-all duration-300 z-10 ${props.open ? '' : 'transform -translate-x-full'}`}>
            {props.children}

            <button onClick={onClick} className="absolute top-0 -right-0 bg-gray-100 px-2 py-2 transform translate-x-full">
                <ArrowRightIcon className={`w-4 h-4 transition-all duration-300 ${props.open ? 'transform rotate-180' : ''}`}></ArrowRightIcon>
            </button>
        </aside>
    )
}
