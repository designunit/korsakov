import { InformationCircleIcon } from "@heroicons/react/solid"

export type TagProps = {
    children: string
    onClick?: () => void
}

export const Tag: React.FC<TagProps> = ({ children, onClick }) => {

    return (
        <div style={{
            position: "absolute",
            transform: "translateY(-100%)",
            minHeight: "5em",
        }}>
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 1,
                    width: 1,
                    height: "100%",
                    backgroundColor: "white",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    width: 3,
                    height: 3,
                    bottom: -1.5,
                    borderRadius: 10,
                    backgroundColor: "white",
                }}
            />
            <div
                className="bg-white dark:bg-gray-800 dark:text-gray-300"
                style={{
                    left: 2,
                    position: "relative",
                    display: "flex",
                    flexFlow: "column",
                    height: 24,
                }}
            >
                <div
                    style={{
                        maxWidth: 250,
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        padding: "2px 6px",
                        marginBottom: 2,
                    }}
                >
                    {children}
                </div>

                {typeof onClick !== "function"
                    ? null
                    : (
                        <div
                            onClick={e => {
                                onClick()
                                e.stopPropagation()
                            }}
                            className="bg-green-300 w-6 h-6 cursor-pointer"
                            style={{
                                position: "absolute",
                                right: 0,
                                top: 0,
                                transform: "translateX(100%)",
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <InformationCircleIcon
                                className="w-4 dark:text-black"
                            />
                        </div>
                    )}
            </div>
        </div>
    )
}
