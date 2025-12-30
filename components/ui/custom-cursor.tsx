"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const CustomCursor = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const updatePosition = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };

        const updateHoverState = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Check if target is clickable
            const isClickable =
                target.tagName === "BUTTON" ||
                target.tagName === "A" ||
                target.closest("button") ||
                target.closest("a") ||
                target.getAttribute("role") === "button" ||
                target.classList.contains("cursor-pointer");

            setIsHovering(!!isClickable);
        };

        window.addEventListener("mousemove", updatePosition);
        window.addEventListener("mouseover", updateHoverState);

        return () => {
            window.removeEventListener("mousemove", updatePosition);
            window.removeEventListener("mouseover", updateHoverState);
        };
    }, []);

    return (
        <>
            <motion.div
                className="fixed top-0 left-0 w-4 h-4 rounded-full bg-emerald-500 pointer-events-none z-[9999] mix-blend-difference hidden lg:block"
                animate={{
                    x: position.x - 8,
                    y: position.y - 8,
                    scale: isHovering ? 2.5 : 1,
                }}
                transition={{
                    type: "spring",
                    stiffness: 150,
                    damping: 15,
                    mass: 0.1,
                }}
            />
            <motion.div
                className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white pointer-events-none z-[9998] mix-blend-difference hidden lg:block"
                animate={{
                    x: position.x - 16,
                    y: position.y - 16,
                    scale: isHovering ? 1.5 : 1,
                    opacity: isHovering ? 0 : 0.5,
                }}
                transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    mass: 0.2, // laggy feel
                }}
            />
            <style jsx global>{`
        @media (min-width: 1024px) {
            body {
                cursor: none;
            }
            a, button, [role="button"] {
                cursor: none;
            }
        }
      `}</style>
        </>
    );
};
