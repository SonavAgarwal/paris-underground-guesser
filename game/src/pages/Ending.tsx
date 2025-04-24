import { useNavigate } from "react-router";
import { useGameStore } from "../gameStore";

const Ending = () => {
    const navigate = useNavigate();
    const score = useGameStore((state) => state.score);
    const zero = useGameStore((state) => state.zero);

    return (
        <div className="flex h-svh w-svw flex-col items-center justify-center gap-4 bg-zinc-800">
            <h1 className="font-limelight max-w-96 text-center text-2xl font-bold text-white">
                You scored {score.toPrecision(4)} points!
            </h1>
            <p className="w-full max-w-[30rem] text-white">
                {" "}
                Thanks for playing! I hope you learned about how many locations
                relating to the underground are metaphors about freedom or
                progess.
            </p>
            <button
                className="font-limelight cursor-pointer rounded-lg bg-zinc-900 px-8 py-2 text-lg font-bold text-white outline-none hover:bg-zinc-700"
                onClick={() => {
                    zero();
                    navigate("/");
                }}
            >
                Play again?
            </button>
        </div>
    );
};

export default Ending;
