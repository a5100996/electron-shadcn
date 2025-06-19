import React from "react";
import DragWindowRegion from "@/components/DragWindowRegion";
//import NavigationMenu from "@/components/template/NavigationMenu";
import { useTranslation } from "react-i18next";

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {

    const { t } = useTranslation();
    return (
<>
    {/* // // Client does not want the title
    <DragWindowRegion title={t("appName")} /> */}
    <DragWindowRegion />
    {/* <NavigationMenu /> */}
    <main className="h-screen overflow-y-scroll pb-20 p-2">{children}</main>
</>
    );
}
