import s from "./sidebar.module.css"

import { ArrowRightIcon } from "@heroicons/react/solid"
import { useCallback } from "react"

export type SidebarProps = {
    head?: React.ReactElement
    open: boolean
    onChange: (open: boolean) => void
    children?: React.ReactNode
}

export const Sidebar: React.FC<SidebarProps> = props => {
    const onClick = useCallback(() => {
        props.onChange(!props.open)
    }, [props])

    return (
        <aside className={`fixed top-0 left-0 sm:w-1/3 max-w-xs sm:max-w-none md:w-1/3 p-3 ease-in-out transition-all duration-300 z-10 ${props.open
            ? ""
            : "transform -translate-x-full"}`}>
            <div className={`${s.container} overflow-auto bg-gray-200 dark:bg-gray-700 relative`}>
                {!props.head
                    ? null
                    : (
                        <div className="sticky top-0 w-full bg-inherit z-10">
                            {props.head}
                        </div>
                    )}
                {props.children}
            </div>

            <button
                onClick={onClick}
                className={`absolute top-3 ${props.open
                    ? "right-3"
                    : "-right-3"} transition-all duration-300 bg-gray-200 dark:bg-gray-700 px-2 py-6 transform translate-x-full`}
            >
                <ArrowRightIcon className={`w-4 h-4 transition-all duration-300 ${props.open
                    ? "transform rotate-180"
                    : ""}`}></ArrowRightIcon>
            </button>
        </aside>
    )
}
