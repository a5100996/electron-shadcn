import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { syncThemeWithLocal } from "./helpers/theme_helpers";
import { useTranslation } from "react-i18next";
import "./localization/i18n";
import { updateAppLanguage } from "./helpers/language_helpers";
import { routerView } from "./routes/router";
import { RouterProvider } from "@tanstack/react-router";

export default function AppView() {
  const { i18n } = useTranslation();

  useEffect(() => {
    syncThemeWithLocal();
    updateAppLanguage(i18n);
  }, [i18n]);

    return <RouterProvider router={routerView} />;
}

const root = createRoot(document.getElementById("app")!);
root.render(
  <React.StrictMode>
    <AppView />
  </React.StrictMode>,
);
