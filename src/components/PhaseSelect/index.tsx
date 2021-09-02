import { useCallback } from "react"

export type OnChangePhase = (newPhase: string) => void

export type PhaseSelectProps = {
    phases: string[]
    current: string
    onChange: OnChangePhase
}

export const PhaseSelect: React.FC<PhaseSelectProps> = ({onChange, ...props}) => {
    const onClick = useCallback((e) => {
        onChange(e.target.name)
    }, [onChange])

    return (
        <>
            {props.phases.map(x => {
                let className = "bg-gray-400 hover:bg-blue-700 text-white font-bold py-2 px-4"
                if (x === props.current) {
                    className = "bg-yellow-400 hover:bg-yellow-700 text-white font-bold py-2 px-4"
                }

                return (
                    <button
                        key={x}
                        className={className}
                        onClick={onClick}
                        name={x}
                    >
                        {x}
                    </button>
                )
            })}
        </>
    )
}
