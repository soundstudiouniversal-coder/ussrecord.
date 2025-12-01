
"use client";

import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="border border-primary rounded-full w-8 h-8 transition duration-300 hover:opacity-70"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
            {theme === 'dark' ? '☀︎' : '☾'}
        </Button>
    );
}
