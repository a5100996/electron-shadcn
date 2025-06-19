import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import translations from "./i18n.json"

const inDevelopment = process.env.NODE_ENV === "development"
let fallbackLng = "zh-Hant"
let resources = {
    "zh-Hans": {
        translation: translations["zh-Hans"]
    },
    "zh-Hant": {
        translation: translations["zh-Hant"]
    },
}
if (inDevelopment) {
    fallbackLng = "en"
    resources = {
        ...resources,
        [fallbackLng]: {
            translation: translations[fallbackLng]
        }
    }
}

i18n.use(initReactI18next).init({
    fallbackLng: fallbackLng,
    resources: resources
})
