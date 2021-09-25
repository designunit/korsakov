import 'tailwindcss/tailwind.css'
import '@/style.css'

import { AppProps } from 'next/app'
import Head from 'next/head'
import { NextIntlProvider } from 'next-intl'

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

            <NextIntlProvider messages={pageProps.messages}>
                <Component {...pageProps} />
            </NextIntlProvider>
        </>
    )
}
