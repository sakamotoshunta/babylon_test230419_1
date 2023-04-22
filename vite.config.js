//viteの設定用ファイル
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
  base: "./", // ベースパスを現在のディレクトリに設定します
});
