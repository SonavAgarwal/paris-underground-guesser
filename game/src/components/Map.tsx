import React, { useState, useRef, useEffect } from "react";
import { Scene } from "../GAME_DATA"; // Assuming Scene structure now uses { x: number, y: number } where x and y are 0-100 percentages from bottom-left

// Helper function to calculate Euclidean distance between two points
// This function will now operate on the 0-100 percentage coordinates.
// The interpretation of this distance depends on the game logic,
// but the calculation itself is the same.
function calculateDistance(
    p1: { x: number; y: number },
    p2: { x: number; y: number },
): number {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    // The distance will be in "percentage units".
    return Math.sqrt(dx * dx + dy * dy);
}

// Define the props for the Map component
interface MapProps {
    currentScene: Scene; // currentScene.location is now { x: 0-100, y: 0-100 } from bottom-left
    onConfirmGuess: (distance: number) => void; // Called when guess is confirmed
    onContinue: () => void; // Called when continue button is clicked
}

const Map: React.FC<MapProps> = ({
    currentScene,
    onConfirmGuess,
    onContinue,
}) => {
    // guessedLocation and correctLocation are now stored as { x: 0-100, y: 0-100 } from bottom-left
    const [guessedLocation, setGuessedLocation] = useState<{
        x: number;
        y: number;
    } | null>(null);

    const { location: correctLocation } = currentScene; // Expecting correctLocation in 0-100 bottom-left format

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

                // Center the image within the container
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
        // This part seems redundant here as it's already in the first useEffect
        // and tied to window resize and image load, which should cover new rounds.
        // Keeping it for now but consider if it's truly necessary.
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

    // Helper to convert a location from the new bottom-left (0-100) system
    // to pixel coordinates relative to the top-left of the RENDERED image.
    const convertLocationToRenderedPixels = (location: {
        x: number;
        y: number;
    }) => {
        if (!renderedImageSizeAndPosition || !mapImageRef.current) {
            // Return values far off-screen or null/undefined if preferred
            return null;
        }

        const { width, height } = renderedImageSizeAndPosition;

        // X is percentage from left, same as before
        const xPixels = (location.x / 100) * width;

        // Y is percentage from BOTTOM. Need to convert to percentage from TOP.
        // If Y is 0 (bottom), it should be height (top-left origin).
        // If Y is 100 (top), it should be 0 (top-left origin).
        // So, 100 - location.y gives the percentage from the top.
        const yPixels = ((100 - location.y) / 100) * height;

        return { x: xPixels, y: yPixels };
    };

    // Helper to get CSS 'left' and 'top' for dot placement relative to the container.
    // Takes location in the new bottom-left (0-100) system.
    const getDotPositionRelativeToContainer = (location: {
        x: number;
        y: number;
    }) => {
        const pixelPos = convertLocationToRenderedPixels(location);

        if (!pixelPos || !renderedImageSizeAndPosition) {
            return { left: "-9999px", top: "-9999px" };
        }

        // Position relative to the container is the pixel position relative to the
        // rendered image plus the image's offset from the container's top-left.
        const xRelativeToContainer =
            pixelPos.x + renderedImageSizeAndPosition.xOffset;
        const yRelativeToContainer =
            pixelPos.y + renderedImageSizeAndPosition.yOffset;

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
            // Convert locations from the new bottom-left (0-100) system
            // to pixel coordinates relative to the canvas's top-left (which matches the image's top-left).
            const guessPosPixels =
                convertLocationToRenderedPixels(guessedLocation);
            const correctPosPixels =
                convertLocationToRenderedPixels(correctLocation);

            if (guessPosPixels && correctPosPixels) {
                context.beginPath();
                context.moveTo(guessPosPixels.x, guessPosPixels.y);
                context.lineTo(correctPosPixels.x, correctPosPixels.y);
                context.strokeStyle = "#30b0ff"; // Color of the line
                context.lineWidth = 2; // Width of the line
                context.stroke();
            }
        }
    }, [
        confirmed,
        guessedLocation,
        correctLocation,
        renderedImageSizeAndPosition,
    ]); // Redraw when these dependencies change

    // Handle click on the map container
    const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
        // Only allow clicking if not confirmed yet and necessary metrics are available
        if (
            confirmed ||
            !mapContainerRef.current ||
            !mapImageRef.current || // Need natural dimensions for conversion
            !renderedImageSizeAndPosition
        )
            return;

        const rect = mapContainerRef.current.getBoundingClientRect();
        // These are click coordinates relative to the container's top-left in pixels
        const clickXRelativeToContainer = event.clientX - rect.left;
        const clickYRelativeToContainer = event.clientY - rect.top;

        // Convert click coordinates to be relative to the top-left of the RENDERED image in pixels
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
            const { width: renderedWidth, height: renderedHeight } =
                renderedImageSizeAndPosition;

            // Convert pixel coordinates (top-left origin) on the rendered image
            // to the new percentage coordinates (bottom-left origin, 0-100).

            // X percentage is straightforward
            const guessedXPercent =
                (clickXRelativeToImage / renderedWidth) * 100;

            // Y pixel is from top-left. Need to convert to percentage from bottom-left.
            // If clickYRelativeToImage is 0 (top), the percentage from bottom should be 100.
            // If clickYRelativeToImage is renderedHeight (bottom), percentage from bottom should be 0.
            // So, renderedHeight - clickYRelativeToImage gives the pixel distance from the bottom.
            const distanceFromBottomPixels =
                renderedHeight - clickYRelativeToImage;
            const guessedYPercent =
                (distanceFromBottomPixels / renderedHeight) * 100;

            const newGuessedLocation = {
                x: guessedXPercent,
                y: guessedYPercent,
            };

            // Ensure percentages are within [0, 100] bounds
            newGuessedLocation.x = Math.max(
                0,
                Math.min(100, newGuessedLocation.x),
            );
            newGuessedLocation.y = Math.max(
                0,
                Math.min(100, newGuessedLocation.y),
            );

            setGuessedLocation(newGuessedLocation);
            console.log(newGuessedLocation);

            // Calculate distance using the new percentage coordinates
            const calculatedDistance = calculateDistance(
                newGuessedLocation,
                correctLocation,
            );
            setDistance(calculatedDistance);
        }
    };

    const handleConfirmGuess = () => {
        let score = 150 / Math.max(1, Math.abs(distance || 100));
        score = Math.min(score, 100);

        if (guessedLocation && distance !== null) {
            setConfirmed(true);
            setShowCorrectLocation(true); // Show correct location after confirming
            onConfirmGuess(score); // Call the parent function with the distance (in percentage units)
            setMetaphoricalMode(true);
        }
    };

    const handleContinue = () => {
        onContinue(); // Call the parent continue function
    };

    const [metaphoricalMode, setMetaphoricalMode] = useState(false);

    // Memoize dot positions to avoid recalculating on every render if locations don't change
    const guessedDotStyle = guessedLocation
        ? getDotPositionRelativeToContainer(guessedLocation)
        : { left: "-9999px", top: "-9999px" };

    const correctDotStyle =
        showCorrectLocation && correctLocation
            ? getDotPositionRelativeToContainer(correctLocation)
            : { left: "-9999px", top: "-9999px" };

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
                            width: renderedImageSizeAndPosition?.width || "0px", // Ensure units
                            height:
                                renderedImageSizeAndPosition?.height || "0px", // Ensure units
                            left:
                                renderedImageSizeAndPosition?.xOffset || "0px", // Ensure units
                            top: renderedImageSizeAndPosition?.yOffset || "0px", // Ensure units
                            pointerEvents: "none", // Allow clicks to pass through to the container
                        }}
                    ></canvas>

                    {/* Correct Location Dot - Only visible after confirmation */}
                    {showCorrectLocation &&
                        renderedImageSizeAndPosition &&
                        correctLocation && (
                            <div
                                className="absolute z-40 h-4 w-4 rounded-full border-2 border-white bg-green-500"
                                style={correctDotStyle} // Use memoized style
                                title="Correct Location"
                            ></div>
                        )}

                    {/* Guessed Location Dot - Visible after the first click */}
                    {guessedLocation && renderedImageSizeAndPosition && (
                        <div
                            className="absolute z-40 h-4 w-4 rounded-full border-2 border-white bg-red-500"
                            style={guessedDotStyle} // Use memoized style
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
