import { useTranslations } from "use-intl"

export type LegendProps = {
    values: { label: string, color: string }[]
}
export const Legend: React.FC<LegendProps> = props => {
    const t = useTranslations('app')

    return (
        <ul className="px-4">
            {props.values.map((x, i) => (
                <li key={i} className="flex">
                    <i className={`inline-block w-4 h-4 mr-2`} style={{
                        backgroundColor: x.color
                    }} />
                    {t(x.label)}
                </li>
            ))}
        </ul>
    )
}
