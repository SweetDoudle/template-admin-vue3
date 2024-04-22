import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

import createAutoImport from "./auto-import";
import createSvgIcon from "./svg-icon";
import createCompression from "./compression";
import createSetupExtend from "./setup-extend";
import vueSetupExtend from "unplugin-vue-setup-extend-plus/vite";
export default function createVitePlugins(viteEnv, isBuild = false) {
  const vitePlugins = [vue()];
  vitePlugins.push(createAutoImport());
  vitePlugins.push(
    vueJsx({
      include: /\.[jt]sx$|\.js$/,
    })
  );
  vitePlugins.push(createSetupExtend());
  vitePlugins.push(vueSetupExtend({}));
  vitePlugins.push(createSvgIcon(isBuild));
  isBuild && vitePlugins.push(...createCompression(viteEnv));
  return vitePlugins;
}
