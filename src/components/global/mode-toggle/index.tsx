"use client";

import { useEffect, useState } from "react";
import { Switch } from "./custom-switcher";
import { useTheme } from "@/provider/theme-provider";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, systemTheme } = useTheme();

  // Get the actual theme (resolving 'system' to the system preference)
  const resolvedTheme = theme === "system" ? systemTheme : theme;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div>
      <Switch
        checked={resolvedTheme === "light"}
        className="h-10 w-20 pl-1 data-[state=checked]:bg-primary-80"
        onCheckedChange={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        aria-label="Toggle dark mode"
      />
    </div>
  );
};

export default ThemeSwitcher;