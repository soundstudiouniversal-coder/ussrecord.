
import { cn } from "@/lib/utils";

interface HologramTextProps extends React.HTMLAttributes<HTMLElement> {
    text: string;
    as?: React.ElementType;
}

export function HologramText({ text, as: Comp = 'span', className, ...props }: HologramTextProps) {
    return (
        <Comp
            className={cn("hologram-flicker", className)}
            data-text={text}
            {...props}
        >
            {text}
        </Comp>
    );
}
