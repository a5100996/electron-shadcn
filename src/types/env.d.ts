interface ImportMetaEnv {
    readonly VITE_WRITABLE: boolean;
    //readonly VITE_APP_TITLE: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}