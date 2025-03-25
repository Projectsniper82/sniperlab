import type { Cluster } from "@solana/web3.js";
export declare enum ExplorerType {
    SOLANA_EXPLORER = "solana-explorer",
    SOLSCAN = "solscan"
}
export declare function generateTXLink(signature: string, cluster?: Cluster, explorerType?: string): string;
//# sourceMappingURL=txLink.d.ts.map