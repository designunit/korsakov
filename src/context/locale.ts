import universalLanguageDetect from '@unly/universal-language-detector'
import { createContext, Dispatch, SetStateAction, useContext } from 'react'

export const LocaleContext = createContext({ locale: 'ru', setLocale: (() => 'ru') as Dispatch<SetStateAction<string>> })

export function useLocaleContext() {
    return useContext(LocaleContext)
}