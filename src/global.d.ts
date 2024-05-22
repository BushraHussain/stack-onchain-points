// src/global.d.ts

interface Ethereum {
    isMetaMask?: boolean;
    request: (args: { method: string; params?: any[] }) => Promise<any>;
    on: (event: string, handler: (data: any) => void) => void;
  }
  
  interface Window {
    ethereum?: Ethereum;
  }
  