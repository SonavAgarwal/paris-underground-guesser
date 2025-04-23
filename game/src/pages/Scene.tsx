import { useNavigate, useParams } from "react-router";
import HoverImage from "../components/HoverImage";
import Map from "../components/Map";
import { useGameStore } from "../gameStore";
import { SCENES } from "../GAME_DATA";

export default function Scene() {
    const score = useGameStore((state) => state.score);

    const { sceneId } = useParams();
    const navigate = useNavigate();

    let CURRENT_SCENE = SCENES[sceneId];

    return (
        <div className="flex h-screen w-screen flex-col gap-4 bg-zinc-600 p-4">
            <div className="flex h-12 w-full flex-row items-center justify-between rounded-lg bg-zinc-800 p-2 px-4">
                <h1 className="font-limelight text-lg font-bold text-white">
                    Paris Underground Guesser
                </h1>
                <h1 className="font-limelight text-lg font-bold text-white">
                    Score: {score}
                </h1>
            </div>
            <div className="flex flex-1 flex-row gap-4">
                <HoverImage src="/scene-1.png" />
                <div className="flex h-full w-96 items-center justify-center overflow-hidden rounded-lg border-2 border-zinc-800">
                    <Map
                        currentScene={CURRENT_SCENE}
                        // onConfirmGuess={}
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
