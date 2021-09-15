export type LayoutProps = {

}

export const Layout: React.FC<LayoutProps> = props => {
    return (
        <div className="w-full h-full">
            {props.children}
        </div>
    )
}
