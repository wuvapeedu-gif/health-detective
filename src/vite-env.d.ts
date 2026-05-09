/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LIFF_ID: string;
  readonly VITE_SYNC_URL: string;
  readonly VITE_MOCK_LIFF: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
