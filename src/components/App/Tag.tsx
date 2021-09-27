export type TagProps = {
    children: string
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
            </div>
        </div>
    )
}