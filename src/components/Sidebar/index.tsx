export type SidebarProps = {

}

export const Sidebar: React.FC<SidebarProps> = props => {
    return (
        <aside className="absolute top-0 left-0 m-3 sm:w-1/3 md:w-1/4 bg-gray-100 z-10">
            {props.children}
        </aside>
    )
}
