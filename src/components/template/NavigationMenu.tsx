import React from "react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import {
  NavigationMenu as NavigationMenuBase,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";

export default function NavigationMenu() {
  const { t } = useTranslation();

  return (
<NavigationMenuBase className="px-2 font-mono text-muted-foreground">
    <NavigationMenuList>

        <NavigationMenuItem>
            <Link to="/">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {t("titleHomePage")}
                </NavigationMenuLink>
            </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
            <Link to="/search-sample">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {t("sampleManagement")}
                </NavigationMenuLink>
            </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
            <Link to="/add-edit-sample">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                     {t("addEditSample")}
                </NavigationMenuLink>
            </Link>
        </NavigationMenuItem>

    </NavigationMenuList>
</NavigationMenuBase>
  );
}
