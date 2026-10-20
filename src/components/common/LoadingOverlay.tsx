"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import Image from "next/image";
import Logo from "@/public/logo/logo.png";

export default function LoadingOverlay({ show }: { show: boolean }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!show || !mounted) return null;

    return createPortal(
        <div className="js-overlay" role="status" aria-live="polite" aria-label="Loading">
            <div className="js-core">
                <div className="js-glow" />

                <div className="js-logo-wrap">
                    <Image
                        src={Logo}
                        alt="JobSpring"
                        width={280}
                        height={280}
                        priority
                        className="js-logo"
                    />
                </div>

                {/* <div className="js-ring">
                    <span className="js-ring-dot" />
                </div> */}
            </div>

            <div className="js-dots">
                <span className="js-dot d1" />
                <span className="js-dot d2" />
                <span className="js-dot d3" />
            </div>

            <p className="js-text">Loading...</p>

            <style jsx>{`
                .js-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    width: 100vw;
                    height: 100vh;
                    z-index: 999999;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 24px;
                    background: rgba(0, 0, 0, 0.65);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    animation: overlayFade 0.25s ease both;
                }

                .js-core {
    position: relative;
    width: 200px;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.js-glow {
    position: absolute;
    inset: -25px;
    border-radius: 50%;
    background: radial-gradient(
        circle,
        rgba(7, 196, 236, 0.32) 0%,
        rgba(113, 221, 55, 0.16) 45%,
        transparent 72%
    );
    filter: blur(8px);
    animation: glowPulse 1.6s ease-in-out infinite;
}

/* Logo: small, on top */
.js-logo-wrap {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.04);
    animation:
        logoEnter 0.4s cubic-bezier(0.16, 1, 0.3, 1) both,
        logoBreathe 1.8s ease-in-out 0.4s infinite;
}

.js-logo {
    width: 120px;
    height: 120px;
    object-fit: contain;
}

/* Ring: sits underneath the logo, self-centering */
.js-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 150px;
    height: 150px;
    border-radius: 50%;
    padding: 3px;
    z-index: 1;
    background: conic-gradient(
        from 0deg,
        transparent 0deg,
        rgba(7, 196, 236, 0.9) 90deg,
        rgba(113, 221, 55, 0.9) 180deg,
        transparent 260deg,
        transparent 360deg
    );
    -webkit-mask:
        linear-gradient(#000 0 0) content-box,
        linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    animation: ringSpin 2s linear infinite;
}

.js-ring-dot {
    position: absolute;
    top: -4px;
    left: 50%;
    width: 8px;
    height: 8px;
    margin-left: -4px;
    border-radius: 50%;
    background: #07c4ec;
    box-shadow: 0 0 10px 2px rgba(7, 196, 236, 0.8);
}

@keyframes ringSpin {
    from {
        transform: translate(-50%, -50%) rotate(0deg);
    }
    to {
        transform: translate(-50%, -50%) rotate(360deg);
    }
}

                .js-ring-dot {
                    position: absolute;
                    top: -5px;
                    left: 50%;
                    width: 12px;
                    height: 12px;
                    margin-left: -6px;
                    border-radius: 50%;
                    background: #07c4ec;
                    box-shadow: 0 0 14px 3px rgba(7, 196, 236, 0.8);
                }

                /* Three sequential gradient dots */
                .js-dots {
                    display: flex;
                    gap: 8px;
                }

                .js-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #07c4ec 0%, #71dd37 100%);
                    opacity: 0.3;
                    animation: dotPulse 0.8s ease-in-out infinite;
                }

                .d1 {
                    animation-delay: 0s;
                }
                .d2 {
                    animation-delay: 0.12s;
                }
                .d3 {
                    animation-delay: 0.24s;
                }

                .js-text {
                    margin: 0;
                    font-size: 13px;
                    font-weight: 500;
                    letter-spacing: 0.02em;
                    color: rgba(255, 255, 255, 0.8);
                    animation: textFade 1s ease-in-out infinite;
                }

                @keyframes overlayFade {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes logoEnter {
                    from {
                        opacity: 0;
                        transform: scale(0.85);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                @keyframes logoBreathe {
                    0%,
                    100% {
                        transform: scale(0.98);
                    }
                    50% {
                        transform: scale(1.03);
                    }
                }

                @keyframes glowPulse {
                    0%,
                    100% {
                        opacity: 0.55;
                        transform: scale(0.94);
                    }
                    50% {
                        opacity: 0.9;
                        transform: scale(1.06);
                    }
                }

                @keyframes ringRotate {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }

                @keyframes dotPulse {
                    0%,
                    100% {
                        opacity: 0.3;
                        transform: scale(0.85);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1.15);
                    }
                }

                @keyframes textFade {
                    0%,
                    100% {
                        opacity: 0.5;
                    }
                    50% {
                        opacity: 0.95;
                    }
                }
            `}</style>
        </div>,
        document.body
    );
}