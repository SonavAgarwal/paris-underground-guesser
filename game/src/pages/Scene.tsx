import { useNavigate, useParams } from "react-router";
import HoverImage from "../components/HoverImage";
import Map from "../components/Map";
import { useGameStore } from "../gameStore";
import { Scene, SCENES } from "../GAME_DATA";
import { useEffect, useState } from "react";

export default function ScenePage() {
    const score = useGameStore((state) => state.score);
    const incrementScore = useGameStore((state) => state.increase);

    const { sceneId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        setComplete(false);
    }, [sceneId]);

    let CURRENT_SCENE: Scene = SCENES[(sceneId || 0) as number];

    const [pointsScored, setPointsScored] = useState(0);
    const [complete, setComplete] = useState(false);

    return (
        <div className="flex h-screen w-screen flex-col gap-4 bg-zinc-600 p-4">
            <div className="flex h-12 w-full flex-row items-center justify-between rounded-lg bg-zinc-800 p-2 px-4">
                <h1 className="font-limelight text-lg font-bold text-white">
                    Paris Underground Guesser
                </h1>
                <h1 className="font-limelight text-lg font-bold text-white">
                    Score: {score.toPrecision(4)}
                </h1>
            </div>
            <div className="flex flex-1 flex-row gap-4">
                {complete ? (
                    <div className="relative flex h-full max-h-[calc(100vh-6rem)] flex-1 flex-col items-center justify-center gap-4 overflow-scroll rounded-lg border-2 border-zinc-800 bg-zinc-800 p-4">
                        <h1 className="font-limelight text-lg font-bold text-white">
                            {CURRENT_SCENE.name}
                        </h1>
                        <img
                            className="aspect-auto w-96 border-zinc-800"
                            src={"/" + CURRENT_SCENE.image}
                        ></img>
                        <p className="text-white">
                            {CURRENT_SCENE.explanation}
                        </p>
                        <p className="text-white">
                            You scored {pointsScored.toPrecision(4)} points!
                        </p>
                    </div>
                ) : (
                    <HoverImage src={"/" + CURRENT_SCENE.image} />
                )}
                <div className="flex h-full w-96 items-center justify-center overflow-hidden rounded-lg border-2 border-zinc-800">
                    <Map
                        currentScene={CURRENT_SCENE}
                        onConfirmGuess={(ns: number) => {
                            incrementScore(ns);
                            setComplete(true);
                            setPointsScored(ns);
                        }}
                        onContinue={() => {
                            if (
                                (parseInt(sceneId || "0") || 0) + 1 >=
                                SCENES.length
                            ) {
                                navigate("/ending");
                            } else {
                                navigate(
                                    "/scene/" +
                                        ((parseInt(sceneId || "0") || 0) + 1),
                                );
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
