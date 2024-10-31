/// <reference types="vite/client" />

/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SOCKET_URL: string;
    // add more variables as needed
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  
