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
        location: { x: 25, y: 70 },
        explanation:
            'For Valjean, the sewers were metaphorical for his path to freedom, representing the arduous journey one takes to freedom. \n"Jean Valjean had escaped from the city". However, as Valjean navigates the sewers there\'s little indication as to whether he\'s making progress, other than the slope. Hugo writes that it is a "black labyrinth", metaphorically implying the sewers don\'t lend themselves to progress.',
        image: "miserables-sewer.jpg",
    },
    {
        name: "Limestone Quarries",
        location: { x: 66, y: 28 },
        explanation:
            'The limestone mines afforded the city of Paris great progress in construction and architecture. However, for Charles-Axel Guillaumot, they represent an inescapable obsession turned into a tomb, where he continues to rest. For "ten years, ... Guillaumot [walked] the silent streets of his subterranean realm" and now his bones rest there. The restrained freedom is also true for the city of Paris, which for centuries continued to have to contend with the sinkholes caused by the legacy of its underground origins.',
        image: "limestone.jpg",
    },
    {
        name: "Parc Buttes Chaumont",
        location: { x: 72, y: 78 },
        explanation:
            "The park is emblematic of the progress Parisians have made from a labor and export based economy and lifestyle, from when it was a gypsum quarry, then later to a wasteland, and finally to a more serene and service based lifestyle, affording them the freedom to enjoy their time on the grass.",
        image: "chaumont.jpg",
    },
    {
        name: "Ichthyosaurus Fossil",
        location: { x: 72, y: 13 },
        explanation:
            'The discovery of fossils and field of paleontology represented by this fossil marked major leaps forward in the understanding of history. However, in Journey to the Center of the Earth, the ichthyosaurus was confined to the underground cavern. It\'s confinement mirrored the main character\'s own; he felt "uneasy" with no "land being in sight," suggesting that the fantastical underground, and more broadly exploration, while initially captivating are not paths to freedom.',
        image: "ichthyosaurus.webp",
    },
    {
        name: "Arcades",
        location: { x: 22, y: 84 },
        explanation:
            "The creation of the arcades symbolizes the culture of leisure and consumerism that developed throughout the 19th century in Paris. The protection and lighting in the arcades enabled all-day socialization and shopping, and their beauty and the congregations of people gave rise to the flâneur of Paris, free to roam as they pleased. As for progress, while the arcades were a new development, they marked a more lateral than forward growth, just one part of the growth of the bourgeoisie. The remaining arcades are now also a symbol of the some of the progress undone during Haussmannization.",
        image: "arcades.jpg",
    },
    {
        name: "Catacombs",
        location: { x: 77, y: 27 },
        explanation:
            'The catacombs speak to Parisian progress throughout the centuries towards more egalitarian views. While graves would have been decorated and only some celebrated, everyone in the catacombs was "confounded like a shuffled pack of cards", marking progress towards equality (The Empire of The Dead). The ossuary also reminds of the fact that no one is free from death: visitors quoted the poem that read "Death has his rigorous laws" (The Empire of The Dead).',
        image: "catacombs.jpg",
    },
    {
        name: "Metro",
        location: { x: 72, y: 54 },
        explanation:
            'The metro was self-evidently a great work of progress for Parisian society, but it also speaks to the change to the modern pace of life, being intertwined with modern expressions like "Métro, boulot, dodo." Robb also highlights the progress the metro brought by contrasting it with Proust, who never took the metro; the metro is an allegory for the change that people like Proust evaded. \n\nIt was also very freeing for the people of Paris, able to take them from one side "to the other side of Paris in twenty-seven minutes" as people were no longer limited to above-ground transportation. However, over time the metro became a metaphorical anchor for many, becoming nearly inescapable, with people falling into routines and tying memories to subway names. Marc Augé wrote that the Gare d\'Orleans-Austerlitz-Auteuil "would always play in [his] life."',
        image: "metro.jpg",
    },
    {
        name: "Mines from Germinal",
        location: { x: 16, y: 14 },
        explanation:
            "The mines in Germinal are a clear metaphor for the oppression of the working class; Zola for example emphasizes the \"cages\" through which miners descended, both physical and a metaphor for the miner's capitivty and lack of freedom. The mines are also the antithesis of progress. They outlast efforts in real life and in Zola's novel for better compensation and working conditions by the miners, staunchly refusing to progress for the betterment of the people.",
        image: "mines.jpg",
    },
    {
        name: "Seeds from Germinal",
        location: { x: 80, y: 80 },
        explanation:
            'The seeds mentioned at the end of Germinal are a metaphor for the slow but steady progress towards change and freedom that would "soon overturn the earth" and allow men to "spring...forth" from the underground that symbolized their captivity.',
        image: "seeds.jpg",
    },
    {
        name: "Andre Breton",
        location: { x: 35, y: 85 },
        explanation:
            "Andre Breton, a leader of the surrealist movement, was often found around the Passage de l’Opéra in a cafe. Their movement symbolized the desire for freedom of expression and the quest to unpack and reveal one's mind. While surrealists claimed they believed in progress and aspired to create it, the movement actively made an enemy of rational thought, marking a step backwards from enlightenment ideas and positioning itself against one of the core drivers of societal progress. Ultimately, the movement only had a moderate impact on society and new forms of expression, like embracing cinema.",
        image: "breton.jpg",
    },
    {
        name: "Les Halles",
        location: { x: 90, y: 75 },
        explanation:
            'Les Halles is the perfect example of progress over time. Wakeman writes that the site is a "palimpest" given how it has continuously evolved throughout the centuries reflecting the needs and perspectives of Parisians, evolving from a market eventually to a mall. The location\'s continued resistance to government control also represents the freedom of the people of Paris. Throughout history the area was an area for illicit trade and sex work, according to Wakeman, and continues to be a meeting place for drug dealers at night, despite all the efforts throughout history to "clean out" the area.',
        image: "halles.webp",
    },
];
