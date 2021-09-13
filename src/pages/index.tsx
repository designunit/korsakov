import { NextPage } from "next"
import dynamic from 'next/dynamic'
import { AppProps } from "@/components/App"

const App = dynamic<AppProps>(() => import('@/components/App').then(m => m.App), {
    ssr: false,
})

const Page: NextPage = () => (
    <App />
)

export default Page
