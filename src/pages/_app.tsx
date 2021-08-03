import 'mapbox-gl/dist/mapbox-gl.css'
import '@/style.css'

import { AppProps } from 'next/app'
import Head from 'next/head'

export default function MyApp(props: AppProps) {
    const { Component, pageProps } = props

    return (
        <>
            <Head>
                <meta
                    name={'viewport'}
                    content={'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'}
                />
                <title>korsakov</title>
            </Head>

            <Component {...pageProps} />
        </>
    )
}
