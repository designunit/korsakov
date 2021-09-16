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
        <aside className={`absolute top-0 left-0 sm:w-1/3 md:w-1/4 ease-in-out transition-all duration-300 z-10 ${props.open ? '' : 'transform -translate-x-full'}`}>
            <div className="max-h-screen overflow-auto m-3 bg-gray-200 dark:bg-gray-800">
                {props.children}
            </div>

            <button
                onClick={onClick}
                className={`absolute top-3 ${props.open ? 'right-3' : '-right-3'} transition-all duration-300 bg-gray-200 px-2 py-6 transform translate-x-full`}
            >
                <ArrowRightIcon className={`w-4 h-4 transition-all duration-300 ${props.open ? 'transform rotate-180' : ''}`}></ArrowRightIcon>
            </button>
        </aside>
    )
}
