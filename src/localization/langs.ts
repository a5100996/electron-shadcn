import { Language } from "./language";

const inDevelopment = process.env.NODE_ENV === "development"
let available_languages = [
    {
        key: "zh-Hans",
        nativeName: "Chinese (Simplified)",
        prefix: "HANS",
    },
    {
        key: "zh-Hant",
        nativeName: "Chinese (Traditional)",
        prefix: "HANT",
    },
]
if (inDevelopment) {
    available_languages = [
        ...available_languages,
        {
            key: "en",
            nativeName: "English",
            prefix: "🇺🇸",
        },
    ]
}

export default available_languages satisfies Language[]
