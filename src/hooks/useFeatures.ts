import { useEffect, useState } from "react"

export function useFeatrues<F>(url: string) {
    const [data, setData] = useState<F[]>([])

    useEffect(() => {
        let mounted = true

        const load = async () => {
            const res = await fetch(url)
            if (!res.ok) {
                return
            }
            const data = await res.json()

            if (!mounted) {
                return
            }

            setData(data.features)
        }
        load()

        return () => {
            mounted = false
        }
    }, [url])

    return data
}
