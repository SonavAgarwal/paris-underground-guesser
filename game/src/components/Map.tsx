import React, { useState, useRef, useEffect } from "react";
import { Scene } from "../GAME_DATA";

// Helper function to calculate Euclidean distance between two points
function calculateDistance(
    p1: { x: number; y: number },
    p2: { x: number; y: number },
): number {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

// Define the props for the Map component
interface MapProps {
    currentScene: Scene;
    onConfirmGuess: (distance: number) => void; // Called when guess is confirmed
    onContinue: () => void; // Called when continue button is clicked
}

const Map: React.FC<MapProps> = ({
    currentScene,
    onConfirmGuess,
    onContinue,
}) => {
    const [guessedLocation, setGuessedLocation] = useState<{
        x: number;
        y: number;
    } | null>(null);

    const { location: correctLocation } = currentScene;

    const [distance, setDistance] = useState<number | null>(null);

    // State to track if the guess has been confirmed
    const [confirmed, setConfirmed] = useState(false);

    // State to control visibility of the correct location dot
    const [showCorrectLocation, setShowCorrectLocation] = useState(false);

    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapImageRef = useRef<HTMLImageElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null); // Ref for the canvas element

    const [renderedImageSizeAndPosition, setRenderedImageSizeAndPosition] =
        useState<{
            width: number;
            height: number;
            xOffset: number;
            yOffset: number;
        } | null>(null);

    // Effect to calculate image size and position on load and resize
    useEffect(() => {
        const calculateImageMetrics = () => {
            if (mapContainerRef.current && mapImageRef.current) {
                const containerRect =
                    mapContainerRef.current.getBoundingClientRect();
                const naturalWidth = mapImageRef.current.naturalWidth;
                const naturalHeight = mapImageRef.current.naturalHeight;

                const widthRatio = containerRect.width / naturalWidth;
                const heightRatio = containerRect.height / naturalHeight;
                const scale = Math.min(widthRatio, heightRatio);

                const renderedWidth = naturalWidth * scale;
                const renderedHeight = naturalHeight * scale;

                const xOffset = (containerRect.width - renderedWidth) / 2;
                const yOffset = (containerRect.height - renderedHeight) / 2;

                setRenderedImageSizeAndPosition({
                    width: renderedWidth,
                    height: renderedHeight,
                    xOffset,
                    yOffset,
                });
            }
        };

        // Calculate metrics initially and on window resize
        calculateImageMetrics();
        window.addEventListener("resize", calculateImageMetrics);

        // Recalculate metrics when the image loads (in case it wasn't cached)
        const imgElement = mapImageRef.current;
        if (imgElement) {
            imgElement.addEventListener("load", calculateImageMetrics);
        }

        // Cleanup event listeners
        return () => {
            window.removeEventListener("resize", calculateImageMetrics);
            if (imgElement) {
                imgElement.removeEventListener("load", calculateImageMetrics);
            }
        };
    }, []); // Empty dependency array means this runs once on mount

    // Effect to reset state when correctLocation changes (for a new round)
    useEffect(() => {
        setGuessedLocation(null);
        setDistance(null);
        setConfirmed(false);
        setShowCorrectLocation(false);

        // Recalculate image metrics for the new round if needed
        const calculateImageMetrics = () => {
            if (mapContainerRef.current && mapImageRef.current) {
                const containerRect =
                    mapContainerRef.current.getBoundingClientRect();
                const naturalWidth = mapImageRef.current.naturalWidth;
                const naturalHeight = mapImageRef.current.naturalHeight;

                const widthRatio = containerRect.width / naturalWidth;
                const heightRatio = containerRect.height / naturalHeight;
                const scale = Math.min(widthRatio, heightRatio);

                const renderedWidth = naturalWidth * scale;
                const renderedHeight = naturalHeight * scale;

                const xOffset = (containerRect.width - renderedWidth) / 2;
                const yOffset = (containerRect.height - renderedHeight) / 2;

                setRenderedImageSizeAndPosition({
                    width: renderedWidth,
                    height: renderedHeight,
                    xOffset,
                    yOffset,
                });
            }
        };
        calculateImageMetrics(); // Recalculate metrics for the new location
    }, [correctLocation]); // Rerun when correctLocation changes

    // Helper to get position relative to the top-left of the rendered image
    const getPositionRelativeToImage = (location: { x: number; y: number }) => {
        if (!renderedImageSizeAndPosition || !mapImageRef.current)
            return { x: -9999, y: -9999 };

        const naturalWidth = mapImageRef.current.naturalWidth;
        const naturalHeight = mapImageRef.current.naturalHeight;

        const scaleX = renderedImageSizeAndPosition.width / naturalWidth;
        const scaleY = renderedImageSizeAndPosition.height / naturalHeight;

        const xRelativeToImage = location.x * scaleX;
        const yRelativeToImage = location.y * scaleY;

        return { x: xRelativeToImage, y: yRelativeToImage };
    };

    // Helper to get position relative to the top-left of the container for dot placement
    const getDotPositionRelativeToContainer = (location: {
        x: number;
        y: number;
    }) => {
        if (!renderedImageSizeAndPosition || !mapImageRef.current)
            return { left: "-9999px", top: "-9999px" };

        const { x, y } = getPositionRelativeToImage(location);

        const xRelativeToContainer = x + renderedImageSizeAndPosition.xOffset;
        const yRelativeToContainer = y + renderedImageSizeAndPosition.yOffset;

        // Adjust by half the dot size (16px / 2 = 8px) to center the dot
        return {
            left: `${xRelativeToContainer - 8}px`,
            top: `${yRelativeToContainer - 8}px`,
        };
    };

    // Effect to draw the line on the canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");

        if (!canvas || !context || !renderedImageSizeAndPosition) return;

        // Set canvas dimensions to match the rendered image dimensions
        canvas.width = renderedImageSizeAndPosition.width;
        canvas.height = renderedImageSizeAndPosition.height;

        // Clear the canvas before drawing
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the line only if confirmed and both locations are available
        if (confirmed && guessedLocation && correctLocation) {
            const guessPos = getPositionRelativeToImage(guessedLocation);
            const correctPos = getPositionRelativeToImage(correctLocation);

            context.beginPath();
            context.moveTo(guessPos.x, guessPos.y);
            context.lineTo(correctPos.x, correctPos.y);
            context.strokeStyle = "#30b0ff"; // Color of the line
            context.lineWidth = 2; // Width of the line
            context.stroke();
        }
    }, [
        confirmed,
        guessedLocation,
        correctLocation,
        renderedImageSizeAndPosition,
    ]); // Redraw when these dependencies change

    const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
        // Only allow clicking if not confirmed yet
        if (
            confirmed ||
            !mapContainerRef.current ||
            !renderedImageSizeAndPosition
        )
            return;

        const rect = mapContainerRef.current.getBoundingClientRect();
        const naturalWidth = mapImageRef.current?.naturalWidth || 0;
        const naturalHeight = mapImageRef.current?.naturalHeight || 0;

        const clickXRelativeToContainer = event.clientX - rect.left;
        const clickYRelativeToContainer = event.clientY - rect.top;

        const clickXRelativeToImage =
            clickXRelativeToContainer - renderedImageSizeAndPosition.xOffset;
        const clickYRelativeToImage =
            clickYRelativeToContainer - renderedImageSizeAndPosition.yOffset;

        // Check if the click was within the bounds of the rendered image
        if (
            clickXRelativeToImage >= 0 &&
            clickXRelativeToImage <= renderedImageSizeAndPosition.width &&
            clickYRelativeToImage >= 0 &&
            clickYRelativeToImage <= renderedImageSizeAndPosition.height
        ) {
            const scaleX = naturalWidth / renderedImageSizeAndPosition.width;
            const scaleY = naturalHeight / renderedImageSizeAndPosition.height;

            const guessedXOnOriginal = clickXRelativeToImage * scaleX;
            const guessedYOnOriginal = clickYRelativeToImage * scaleY;

            const newGuessedLocation = {
                x: guessedXOnOriginal,
                y: guessedYOnOriginal,
            };
            setGuessedLocation(newGuessedLocation);

            // Calculate distance immediately on guess, but don't show it yet
            const calculatedDistance = calculateDistance(
                newGuessedLocation,
                correctLocation,
            );
            setDistance(calculatedDistance);
        }
    };

    const handleConfirmGuess = () => {
        if (guessedLocation && distance !== null) {
            setConfirmed(true);
            setShowCorrectLocation(true); // Show correct location after confirming
            onConfirmGuess(distance); // Call the parent function with the distance
        }
    };

    const handleContinue = () => {
        onContinue(); // Call the parent continue function
    };

    const [metaphoricalMode, setMetaphoricalMode] = useState(false);

    return (
        <div className="relative flex h-full w-full flex-1 flex-col rounded-lg shadow-lg">
            {/* Header */}
            <div className="flex flex-row items-center justify-center bg-zinc-800 p-2 pl-4">
                <h1 className="font-limelight text-lg font-bold text-white">
                    Map
                </h1>
            </div>

            {/* Map Image and Overlay Container */}
            <div
                ref={mapContainerRef}
                onClick={handleMapClick}
                className={`relative w-full cursor-crosshair ${confirmed ? "cursor-default" : ""}`} // Change cursor after confirmed
            >
                <div className="relative h-full w-full">
                    {/* Base Map Image */}
                    <img
                        ref={mapImageRef}
                        src={"/axes.webp"}
                        alt="Map Axes"
                        className="z-10 h-full w-full object-contain"
                        onDragStart={(e) => e.preventDefault()}
                    />
                    {/* Overlay Map Image (Physical/Metaphorical) */}
                    <img
                        src={"/physical.webp"} // Assuming physical.webp is the correct one
                        alt="Physical Map Overlay"
                        className="absolute top-0 left-0 z-20 h-full w-full object-contain transition-opacity"
                        style={{
                            opacity: metaphoricalMode ? 0 : 1, // Use 1 for full opacity
                        }}
                        onDragStart={(e) => e.preventDefault()}
                    />

                    {/* Canvas for drawing the line */}
                    <canvas
                        ref={canvasRef}
                        className="absolute top-0 left-0 z-30" // Position canvas over the image
                        style={{
                            width: renderedImageSizeAndPosition?.width || 0,
                            height: renderedImageSizeAndPosition?.height || 0,
                            left: renderedImageSizeAndPosition?.xOffset || 0,
                            top: renderedImageSizeAndPosition?.yOffset || 0,
                            pointerEvents: "none", // Allow clicks to pass through to the container
                        }}
                    ></canvas>

                    {/* Correct Location Dot - Only visible after confirmation */}
                    {showCorrectLocation && renderedImageSizeAndPosition && (
                        <div
                            className="absolute z-40 h-4 w-4 rounded-full border-2 border-white bg-green-500"
                            style={{
                                ...getDotPositionRelativeToContainer(
                                    correctLocation,
                                ),
                            }}
                            title="Correct Location"
                        ></div>
                    )}

                    {/* Guessed Location Dot - Visible after the first click */}
                    {guessedLocation && renderedImageSizeAndPosition && (
                        <div
                            className="absolute z-40 h-4 w-4 rounded-full border-2 border-white bg-red-500"
                            style={{
                                ...getDotPositionRelativeToContainer(
                                    guessedLocation,
                                ),
                            }}
                            title="Your Guess"
                        ></div>
                    )}
                </div>
            </div>

            {/* Controls Area */}
            <div className="flex flex-1 flex-col p-2">
                {/* Map Mode Toggle */}
                <div className="mb-2 flex flex-row overflow-hidden rounded-md border-2 border-zinc-400 bg-zinc-400">
                    <button
                        className={`flex-1 px-2 py-1 ${metaphoricalMode ? "bg-zinc-400" : "bg-zinc-700 text-white"} rounded-sm font-bold transition-colors outline-none`}
                        onClick={() => {
                            setMetaphoricalMode(false);
                        }}
                    >
                        Physical
                    </button>
                    <button
                        className={`flex-1 px-2 py-1 ${!metaphoricalMode ? "bg-zinc-400" : "bg-zinc-700 text-white"} rounded-sm font-bold transition-colors outline-none`}
                        onClick={() => {
                            setMetaphoricalMode(true);
                        }}
                    >
                        Metaphorical
                    </button>
                </div>

                {/* Action Button (Confirm or Continue) */}
                {!confirmed ? (
                    // Confirm button - visible before confirmation, enabled if a guess has been made
                    <button
                        className={`font-limelight flex-1 cursor-pointer rounded-md py-2 text-white transition-colors outline-none ${guessedLocation ? "bg-zinc-800 hover:bg-zinc-700" : "cursor-not-allowed bg-zinc-800 opacity-50"}`}
                        onClick={handleConfirmGuess}
                        disabled={!guessedLocation} // Disable if no guess has been made
                    >
                        Confirm Guess!
                    </button>
                ) : (
                    // Continue button - visible after confirmation
                    <button
                        className="font-limelight flex-1 cursor-pointer rounded-md bg-green-500 py-2 text-white transition-colors outline-none hover:bg-green-400"
                        onClick={handleContinue}
                    >
                        Continue
                    </button>
                )}
            </div>
        </div>
    );
};

export default Map;
