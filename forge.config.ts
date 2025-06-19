import type { ForgeConfig } from "@electron-forge/shared-types";
import { MakerSquirrel } from "@electron-forge/maker-squirrel";
import { MakerZIP } from "@electron-forge/maker-zip";
import { MakerDeb } from "@electron-forge/maker-deb";
import { MakerRpm } from "@electron-forge/maker-rpm";
import { VitePlugin } from "@electron-forge/plugin-vite";
import { FusesPlugin } from "@electron-forge/plugin-fuses";
import { FuseV1Options, FuseVersion } from "@electron/fuses";
import { AutoUnpackNativesPlugin } from "@electron-forge/plugin-auto-unpack-natives";

console.log('==> ==> ==> ==>');
console.log('process.env.VITE_WRITABLE = ', process.env.VITE_WRITABLE)
console.log('import.meta.env.VITE_WRITABLE = ', import.meta.env.VITE_WRITABLE)
console.log('==> ==> ==> ==>');

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    ignore: [
        /node_modules\/(?!(better-sqlite3|bindings|file-uri-to-path)\/)/,
		/dist-readonly/,
		/dist-writable/,
    ],
    extraResource: "resources/data"
  },
  rebuildConfig: {},
  makers: [
    // new MakerSquirrel({}),
    new MakerZIP({}, ["darwin"]),
    new MakerRpm({}),
    new MakerDeb({}),
      {
          "name": "@rabbitholesyndrome/electron-forge-maker-portable",
          "config": {
              "portable": {
                  "artifactName": "${productName}-portable-${version}.exe",
				  // "extraFiles": [ "industry.db" ]
              }
          }
      }
  ],
  plugins: [
    new VitePlugin({
      build: [
        {
          entry: "src/main.ts",
          config: "vite.main.config.ts",
          target: "main",
        },
        {
          entry: "src/preload.ts",
          config: "vite.preload.config.ts",
          target: "preload",
        },
      ],
      renderer: [
          {
              name: "main_window",
              config: "vite.renderer.config.mts",
          },
          {
              name: "view_window",
              config: "vite.renderer.view.config.mts",
          },
          {
              name: "add_edit_window",
              config: "vite.renderer.add_edit.config.mts",
          },
      ],
    }),

    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),

    new AutoUnpackNativesPlugin({}),
  ],
  outDir: process.env.VITE_WRITABLE == 1 ? 'dist-writable' : 'dist-readonly',
};

export default config;
