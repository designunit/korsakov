import "tailwindcss/tailwind.css"
import "@/style.css"

import { AppProps } from "next/app"
import Head from "next/head"
import { NextIntlProvider } from "next-intl"
import { DefaultSeo } from "next-seo"
import { useRouter } from "next/router"

type TranslationDict = {
    [key: string]: Record<string, string>
}

type ExtraProps = {
    messages: TranslationDict
}

export default function MyApp(props: AppProps<ExtraProps>) {
    const { Component, pageProps } = props
    const router = useRouter()

    return (
        <>
            <Head>
                <meta
                    name={"viewport"}
                    content={"width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"}
                />
                <meta
                    name={"theme-color"}
                    content={"#10b981"}
                />
                <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />

                <title>korsakov</title>
            </Head>

            <NextIntlProvider messages={pageProps.messages}>
                <DefaultSeo
                    title={"Korsakov"}
                    description={"Korsakov web 3d"}
                    openGraph={{
                        type: "website",
                        locale: router.locale,
                        url: "https://korsakov.unit4.io/",
                        site_name: "Korsakov",
                        images: [
                            {
                                url: "https://korsakov.unit4.io/static/korsakov.jpg",
                                width: 1200,
                                height: 628,
                                alt: "Korsakov",
                            },
                        ],
                    }}
                />
                <Component {...pageProps} />
            </NextIntlProvider>
        </>
    )
}
