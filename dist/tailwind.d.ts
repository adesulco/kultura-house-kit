declare const colourNames: readonly ["red-500", "red-700", "red-800", "ink", "paper", "surface", "line", "muted", "amber-text", "amber-tint", "amber-line", "green", "green-tint", "accent", "on-accent"];
declare const houseKitPreset: {
    theme: {
        extend: {
            colors: {
                k: Record<(typeof colourNames)[number], string>;
            };
            fontFamily: {
                k: string[];
                "k-mono": string[];
            };
            fontSize: {
                "k-display": [string, Record<string, string>];
                "k-display-sm": [string, Record<string, string>];
                "k-h1": [string, Record<string, string>];
                "k-h1-sm": [string, Record<string, string>];
                "k-h2": [string, Record<string, string>];
                "k-h2-sm": [string, Record<string, string>];
                "k-h3": [string, Record<string, string>];
                "k-h3-sm": [string, Record<string, string>];
                "k-body": [string, Record<string, string>];
                "k-body-sm": [string, Record<string, string>];
                "k-small": [string, Record<string, string>];
                "k-label": [string, Record<string, string>];
            };
            borderRadius: {
                "k-pill": string;
                "k-console": string;
                "k-card": string;
            };
            transitionDuration: {
                "k-fast": string;
                "k-base": string;
                "k-slow": string;
            };
            transitionTimingFunction: {
                k: string;
            };
            screens: {
                "k-desktop": string;
            };
        };
    };
};

export { houseKitPreset as default, houseKitPreset };
