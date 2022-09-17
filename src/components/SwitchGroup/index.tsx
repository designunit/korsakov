import { Switch } from "@headlessui/react"

export type SwitchGroupProps = {
    values: Array<{
        label: string,
        checked: boolean,
    }>,
    onChange?: (value: any, index: number) => void
}

export const SwitchGroup: React.FC<SwitchGroupProps> = props => {
    return (
        <Switch.Group>
            {props.values.map((item, i) => {
                return (
                    <div
                        key={i}
                        className="flex items-center px-4 py-2"
                    >
                        <Switch.Label className="mr-4 flex-1">{item.label}</Switch.Label>
                        <Switch checked={item.checked}
                            // onChange={(checked) => setEnabled(enableds.map((x, ii) => ii === i ? checked : x))}
                            onChange={(checked) => {
                                if (typeof props.onChange === "function") {
                                    props.onChange(checked, i)
                                }
                            }}
                            className={`${item.checked
                                ? "bg-green-500"
                                : "bg-gray-500"
                            } relative inline-flex items-center w-8 h-5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                        >
                            <span
                                className={`${item.checked
                                    ? "translate-x-4"
                                    : "translate-x-1"
                                } inline-block w-3 h-3 transform bg-white rounded-full transition-transform`}
                            />
                        </Switch>
                    </div>
                )
            })}
        </Switch.Group>
    )
}
