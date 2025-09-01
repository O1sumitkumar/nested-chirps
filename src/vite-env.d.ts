/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_DB_URL: string;
  readonly VITE_DB_TYPE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
