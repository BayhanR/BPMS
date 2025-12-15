"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const IMAGES = [
    "/dashboard.png",
    "/projects.png",
    "/calendarweek.png",
    "/teamsection.png",
    "/calendarmonth.png",
    "/projects2.png",
];

// Shuffle/Duplicate images to ensure we have enough height for the loop
// Shuffle/Duplicate images to ensure we have enough height for the loop
const COLUMN_1 = [...IMAGES, ...IMAGES, ...IMAGES];
const COLUMN_2 = [...IMAGES.reverse(), ...IMAGES, ...IMAGES.reverse()];
const COLUMN_3 = [...IMAGES.slice(2), ...IMAGES, ...IMAGES.slice(0, 2)];
const COLUMN_4 = [...IMAGES.slice(3), ...IMAGES, ...IMAGES.slice(0, 3)];
const COLUMN_5 = [...IMAGES.reverse().slice(1), ...IMAGES, ...IMAGES.reverse().slice(0, 1)];
const COLUMN_6 = [...IMAGES.slice(1), ...IMAGES, ...IMAGES.slice(0, 1)];

export function DiagonalScroll() {
    return (
        <div className="relative h-full w-full overflow-hidden bg-[#0f0f10] flex items-center justify-center">
            {/* Overlay Gradients to blend edges */}
            <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a] pointer-events-none" />
            <div className="absolute inset-0 z-20 bg-gradient-to-l from-[#0a0a0a] via-transparent to-transparent pointer-events-none" />

            {/* Rotated Container */}
            <div className="h-[150%] w-[150%] flex gap-8 -rotate-12 items-center justify-center select-none opacity-40 grayscale-[20%]">
                <Column images={COLUMN_1} duration={65} />
                <Column images={COLUMN_2} duration={85} yOffset={-100} />
                <Column images={COLUMN_3} duration={75} />
                <Column images={COLUMN_4} duration={60} yOffset={-50} />
                <Column images={COLUMN_5} duration={80} />
                <Column images={COLUMN_6} duration={70} yOffset={-150} />
            </div>
        </div>
    );
}

function Column({
    images,
    duration,
    yOffset = 0,
}: {
    images: string[];
    duration: number;
    yOffset?: number;
}) {
    return (
        <div className="relative h-full w-96 flex flex-col gap-8 overflow-hidden">
            {/* Infinite Scroll Wrapper */}
            <motion.div
                className="flex flex-col gap-8"
                initial={{ y: yOffset }}
                animate={{ y: `calc(-50% + ${yOffset}px)` }}
                transition={{
                    duration: duration,
                    ease: "linear",
                    repeat: Infinity,
                }}
            >
                {/* We repeat the array twice in the render to ensure seamless loop */}
                {[...images, ...images].map((src, i) => (
                    <div
                        key={i}
                        className="relative w-96 h-60 rounded-2xl overflow-hidden border border-white/10 bg-white/5 shadow-2xl flex-shrink-0"
                    >
                        <Image
                            src={src}
                            alt="App Screenshot"
                            fill
                            className="object-cover opacity-80 hover:opacity-100 transition-opacity duration-300"
                            sizes="(max-width: 768px) 100vw, 500px"
                        />
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
