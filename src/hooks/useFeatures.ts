import { useEffect, useState } from "react"

export function useFeatrues(url: string) {
    const [data, setData] = useState([])

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
