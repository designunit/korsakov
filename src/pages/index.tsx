import { GetStaticProps, NextPage } from "next"
import dynamic from 'next/dynamic'
import { AppProps } from "@/components/App"

const App = dynamic<AppProps>(() => import('@/components/App').then(m => m.App), {
    ssr: false,
})

const Page: NextPage = () => (
    <App />
)

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    return {
        props: {
            // You can get the messages from anywhere you like, but the recommended
            // pattern is to put them in JSON files separated by language and read
            // the desired one based on the `locale` received from Next.js.
            messages: require(`@/messages/${locale}.json`),
        }
    };
}

export default Page
