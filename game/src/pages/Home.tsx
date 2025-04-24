import { useNavigate } from "react-router";

const Home = () => {
    const navigate = useNavigate();
    return (
        <div className="flex h-svh w-svw flex-col items-center justify-center gap-4 bg-zinc-800">
            <h1 className="font-limelight max-w-96 text-2xl font-bold text-white">
                Paris Underground Guesser
            </h1>
            <p className="w-full max-w-[30rem] text-white">
                Welcome to Paris Underground Guesser, a game inspired by the
                Parisian underground and Geoguesser! Each round, you will see an
                image or scene relating to the underground, and you'll have to
                guess where on the map it belongs!
                <br />
                <br /> The map has two modes, physical and metaphorical. The
                physical map depicts the layers of the Earth, and the
                metaphorical map depicts a scale where things can be metaphors
                for freedom or a lack thereof, or progress or a lack thereof, or
                both! You will need to reference both maps to pinpoint where to
                place your guess.
                <br />
                <br /> This game aims to demonstrate that many locations and
                things related to the Parisian underground are physical
                locations that often inspire or become metaphors for freedom and
                progress throughout Paris' history.
            </p>
            <button
                className="font-limelight cursor-pointer rounded-lg bg-zinc-900 px-8 py-2 text-lg font-bold text-white outline-none hover:bg-zinc-700"
                onClick={() => {
                    navigate("/scene/0");
                }}
            >
                Start!
            </button>
        </div>
    );
};

export default Home;
