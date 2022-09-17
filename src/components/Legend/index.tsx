import { useTranslations } from "use-intl"

function getStyle(d: Display, color: string): React.CSSProperties {
    if (d === "dash") {
        return {
            border: `2px dashed ${color}`,
        }
    }

    if (d === "stroke") {
        return {
            border: `2px solid ${color}`,
        }
    }

    return {
        backgroundColor: color,
    }
}

type Display = "fill" | "dash" | "stroke"
export type LegendProps = {
    values: Array<{
        label: string,
        color: string,
        display?: Display
    }>
}
export const Legend: React.FC<LegendProps> = props => {
    const t = useTranslations("app")

    return (
        <ul className="px-4">
            {props.values.map((x, i) => (
                <li key={i} className="flex">
                    <i className={"inline-block w-4 h-4 mr-2"} style={getStyle(x.display ?? "fill", x.color)} />
                    {t(x.label)}
                </li>
            ))}
        </ul>
    )
}
