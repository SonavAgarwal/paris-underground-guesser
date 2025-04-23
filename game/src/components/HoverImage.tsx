import { motion } from "motion/react";
import { useRef, useState } from "react";

interface HoverImageProps {
    src: string;
}

function HoverImage({ src }: HoverImageProps) {
    const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(
        null,
    );
    const [isHovering, setIsHovering] = useState(false);
    const [divDims, setDivDims] = useState<{
        width: number;
        height: number;
    } | null>(null);
    const parentRef = useRef<HTMLDivElement>(null);
    const maxDisp = -100;

    const dispX =
        hoverPos && divDims
            ? (hoverPos.x / divDims.width) * (2 * maxDisp) - maxDisp
            : 0;
    const dispY =
        hoverPos && divDims
            ? (hoverPos.y / divDims.height) * (2 * maxDisp) - maxDisp
            : 0;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (parentRef.current) {
            const rect = parentRef.current.getBoundingClientRect();
            setHoverPos({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
            if (
                !divDims ||
                divDims.width !== rect.width ||
                divDims.height !== rect.height
            ) {
                setDivDims({ width: rect.width, height: rect.height });
            }
        }
    };

    const handleMouseLeave = () => {
        setHoverPos(null);
        setIsHovering(false);
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
        if (parentRef.current) {
            const rect = parentRef.current.getBoundingClientRect();
            if (!divDims) {
                setDivDims({ width: rect.width, height: rect.height });
            }
            setIsHovering(true);
        }
    };

    return (
        <div
            ref={parentRef}
            className="relative h-full max-h-[calc(100vh-6rem)] flex-1 overflow-hidden rounded-lg border-2 border-zinc-800 bg-black"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
        >
            <motion.img
                src={src}
                alt="Hoverable Image"
                className="h-full w-full object-cover"
                animate={{
                    x: dispX,
                    y: dispY,
                    scale: isHovering ? 1.2 : 1,
                }}
                transition={{ type: "tween", duration: 0.1 }}
                whileHover={{
                    scale: 1.2,
                }}
            />
        </div>
    );
}

export default HoverImage;
