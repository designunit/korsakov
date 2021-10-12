import { InformationCircleIcon } from '@heroicons/react/solid'
import { Dispatch, ReactNode, SetStateAction } from 'react'

export type TagProps = {
    children: string
    setContent: null | (() => void)
}

export const Tag: React.FC<TagProps> = props => {

    return (
        <div style={{
            position: 'absolute',
            transform: 'translateY(-100%)',
            minHeight: `5em`,
        }}>
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 1,
                    width: 1,
                    height: '100%',
                    backgroundColor: 'white',
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    width: 3,
                    height: 3,
                    bottom: -1.5,
                    borderRadius: 10,
                    backgroundColor: 'white',
                }}
            />
            <div style={{
                left: 2,
                position: 'relative',
                display: 'flex',
                flexFlow: 'column',
            }}>
                <div
                    style={{
                        maxWidth: 250,
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        // borderRadius: '2px',
                        padding: '2px 6px',
                        marginBottom: 2,
                        backgroundColor: 'white',
                        boxShadow: '0px 0px 8px rgba(0,0,48, .25)',
                    }}
                >
                    {props.children}
                </div>
                {props.setContent !== null && (
                    <div
                        onClick={e => {
                            // @ts-ignore // already checked on line 58
                            props.setContent()
                            e.stopPropagation()
                        }}
                        className="bg-green-300 w-6 h-6 cursor-pointer"
                        style={{
                            position: 'absolute',
                            right: 0,
                            top: 0,
                            transform: 'translateX(100%)',
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <InformationCircleIcon
                            className="w-4"
                        />
                    </div>
                )}
            </div>
        </div>
    )
}