import 'tailwindcss/tailwind.css'
import '@/style.css'

import { AppProps } from 'next/app'
import Head from 'next/head'
import { NextIntlProvider } from 'next-intl'
import { DefaultSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { universalLanguageDetect } from '@unly/universal-language-detector'
import messagesRu from '../../public/messages/ru.json'
import messagesEn from '../../public/messages/en.json'

export default function MyApp(props: AppProps) {
    const { Component, pageProps } = props
    // const router = useRouter()

    const locale = universalLanguageDetect({
        supportedLanguages: ['ru', 'en'],
        fallbackLanguage: 'en',
    })
    const messages = locale === 'ru' ? messagesRu : messagesEn

    return (
        <>
            <Head>
                <meta
                    name={'viewport'}
                    content={'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'}
                />
                <meta
                    name={'theme-color'}
                    content={'#10b981'}
                />
                <title>korsakov</title>
            </Head>

            <NextIntlProvider locale={locale} messages={messages}>
                <DefaultSeo
                    title={'Korsakov'}
                    description={'Korsakov web 3d'}
                    openGraph={{
                        type: 'website',
                        locale: locale,
                        url: 'https://korsakov.unit4.io/',
                        site_name: 'Korsakov',
                        images: [
                            {
                                url: 'https://korsakov.unit4.io/static/korsakov.jpg',
                                width: 1200,
                                height: 628,
                                alt: 'Korsakov',
                            }
                        ],
                    }}
                />
                <Component {...pageProps} />
            </NextIntlProvider>
        </>
    )
}
