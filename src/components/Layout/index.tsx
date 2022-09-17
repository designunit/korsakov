export type LayoutProps = {
    children?: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="w-full h-full">
            {children}
        </div>
    )
}
