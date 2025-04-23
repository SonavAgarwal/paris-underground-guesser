export interface Point {
    x: number;
    y: number;
}

export interface Scene {
    name: string;
    location: Point;
    explanation: string;
    image: string;
}

export const SCENES: Scene[] = [
    {
        name: "Les Misérables Sewers",
        location: { x: 60, y: 40 }, // moderately controlled, some decay
        explanation:
            "A grim yet redemptive escape route for Valjean, the sewers symbolize both the filth of society and the path toward moral rebirth.",
        image: "scene-1.png",
    },
    {
        name: "Germinal Mines",
        location: { x: 90, y: 80 }, // high control and heavy decay
        explanation:
            "The mines represent industrial exploitation, suffocating authority, and the slow breakdown of both the human body and spirit.",
        image: "scene-2.png",
    },
    {
        name: "Jules Verne's Underground Cavern",
        location: { x: 10, y: 20 }, // very free, minimal decay
        explanation:
            "A space of scientific wonder and boundless exploration, filled with potential rather than ruin.",
        image: "scene-3.png",
    },
];
