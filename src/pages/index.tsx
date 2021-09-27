import { GetStaticProps, InferGetStaticPropsType, NextPage } from "next"
import dynamic from 'next/dynamic'
import { AppProps } from "@/components/App"
import { Legend } from "@/components/Legend"
import { Layout } from "@/components/Layout"

const App = dynamic<AppProps>(() => import('@/components/App').then(m => m.App), {
    ssr: false,
})

type Props = InferGetStaticPropsType<typeof getStaticProps>

const Page: NextPage<Props> = props => (
    <Layout>
        <App
            legend={(
                <Legend
                    values={props.legend}
                />
            )}
        />
    </Layout>
)

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    return {
        props: {
            // You can get the messages from anywhere you like, but the recommended
            // pattern is to put them in JSON files separated by language and read
            // the desired one based on the `locale` received from Next.js.
            messages: require(`@/messages/${locale}.json`),

            legend: [
                {
                    label: 'legend_green',
                    color: '#00ff00',
                },
                {
                    label: 'legend_app family',
                    color: '#596EB5',
                },
                {
                    label: 'legend_artschool',
                    color: '#E43594',
                },
                {
                    label: 'legend_concerthall',
                    color: '#F8951D',
                },
                {
                    label: 'legend_dorm',
                    color: '#FEBF10',
                },
                {
                    label: 'legend_flats',
                    color: '#00B5DC',
                },
                {
                    label: 'legend_hotel',
                    color: '#FFD002',
                },
                {
                    label: 'legend_hub',
                    color: '#B6529F',
                },
                {
                    label: 'legend_kinders',
                    color: '#DA67A7',
                },
                {
                    label: 'legend_maison',
                    color: '#275069',
                },
                {
                    label: 'legend_mediatheque',
                    color: '#F37763',
                },
                {
                    label: 'legend_hospital',
                    color: '#00A997',
                },
                {
                    label: 'legend_lab',
                    color: '#B1BE73',
                },
                {
                    label: 'legend_office',
                    color: '#EEF2D8',
                },
                {
                    label: 'legend_prom',
                    color: '#6B946C',
                },
                {
                    label: 'legend_school',
                    color: '#BDD630',
                },
                {
                    label: 'legend_service',
                    color: '#C785B9',
                },
                {
                    label: 'legend_sport',
                    color: '#9AC639',
                },
                {
                    label: 'legend_townhouse',
                    color: '#00564D',
                },
                {
                    label: 'legend_univer',
                    color: '#B168AA',
                },
            ]
        }
    };
}

export default Page
