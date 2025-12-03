import { Button } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import wheelSound from "../../../assets/audio/Prize-wheel-spin-sound-effect.mp3";
import { apiConnectorPost } from "../../../services/apiconnector";
import { endpoint } from "../../../services/urls";
import "./Dup.css";

const values = [
    "$ 0", "$ 0.8", "$ 5",
    "$10", "$ 0.2", "$ 1",
    "$ 6", "$ 7",
    "$0.4", "$ 0.3", "$ 9",
    "$ 3", "$ 8"
];

// Christmas wheel colors
const colors = [
    "#cccccc", "#0f8c0f", "#ff3d3d",
    "#1e9e1e", "#ff5555", "#0c7d0c",
    "#ff6a6a", "#0aa80a",
    "#ff2e2e", "#0f9d0f", "#ff4040",
    "#1aaa1a", "#ff3b3b"
];

const Duplicate = () => {
    const canvasRef = useRef(null);
    const confettiRef = useRef(null);
    const [angle, setAngle] = useState(0);
    const [spinning, setSpinning] = useState(false);
    const [showClaimLink, setShowClaimLink] = useState(false);
    const [winner, setWinner] = useState(null);

    const audioRef = useRef(new Audio(wheelSound));

    const arc = Math.PI / (values.length / 2);

    // Draw wheel
    const drawWheel = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < values.length; i++) {
            const angleOffset = i * arc;
            ctx.beginPath();
            ctx.fillStyle = colors[i];
            ctx.moveTo(250, 250);
            ctx.arc(250, 250, 240, angleOffset, angleOffset + arc);
            ctx.fill();

            ctx.save();
            ctx.fillStyle = "#fff";
            ctx.translate(250, 250);
            ctx.rotate(angleOffset + arc / 2);
            ctx.textAlign = "center";
            ctx.font = "bold 25px Inter";
            ctx.fillText(values[i], 140, 10);
            ctx.restore();
        }
    };

    useEffect(() => {
        drawWheel();
    }, []);

    useEffect(() => {
        audioRef.current = new Audio(wheelSound);
        audioRef.current.loop = true;
        audioRef.current.preload = "auto";
    }, []);

    const cleanPrize = (value) => {
        return Number(value.replace(/[^0-9.]/g, ""));
    };

    const spin = () => {
        if (spinning) return;
        setSpinning(true);

        // Play sound
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => { });

        // Stop sound after 4s
        setTimeout(() => {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }, 4000);

        let speed = Math.random() * 0.35 + 0.35;
        let localAngle = angle;

        const loop = setInterval(() => {
            localAngle += speed;
            speed *= 0.985;

            const pointerOffset = (3 * Math.PI) / 4 + 0.30;

            let activeIndex = Math.floor(
                ((2 * Math.PI - ((localAngle + pointerOffset) % (2 * Math.PI))) / arc)
            );

            activeIndex = (activeIndex + values.length) % values.length;

            drawWheelRotated(localAngle);

            if (speed < 0.002) {
                clearInterval(loop);
                setSpinning(false);
                setAngle(localAngle);

                const prize = values[activeIndex];
                setWinner(prize);

                if (prize === "$ 0") {
                    toast("🎄 Better luck next time!");
                    setTimeout(() => setWinner(null), 2500); // slightly longer for animation
                } else {
                    startConfetti();
                    storeresult(prize);
                    setTimeout(() => setWinner(null), 3500); // keep popup while confetti plays
                }
            }

        }, 16);
    };

    const drawWheelRotated = (rotation) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(250, 250);
        ctx.rotate(rotation);
        ctx.translate(-250, -250);
        drawWheel();
        ctx.restore();
    };

    // CONFETTI
    const confettiAnimationRef = useRef(null);

    const startConfetti = () => {
        const confettiCanvas = confettiRef.current;
        const ctx = confettiCanvas.getContext("2d");

        const colors = ["#ff0000", "#ffffff", "#00a000"]; // red, white, green
        const pieces = [];

        for (let i = 0; i < 150; i++) {
            pieces.push({
                x: Math.random() * window.innerWidth,
                y: -Math.random() * window.innerHeight,
                w: 8,
                h: 14,
                color: colors[Math.floor(Math.random() * colors.length)],
                speed: Math.random() * 3 + 2
            });
        }

        const draw = () => {
            ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            pieces.forEach((c) => {
                ctx.fillStyle = c.color;
                ctx.fillRect(c.x, c.y, c.w, c.h);
                c.y += c.speed;
                if (c.y > window.innerHeight) c.y = -10;
            });

            confettiAnimationRef.current = requestAnimationFrame(draw);
        };

        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
        draw();

        setTimeout(() => {
            cancelAnimationFrame(confettiAnimationRef.current);
            ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        }, 3000);
    };

    const storeresult = async (prize) => {
        const cleanedPrize = cleanPrize(prize);

        try {
            const res = await apiConnectorPost(endpoint?.store_rewards, {
                rew: cleanedPrize
            });

            if (res?.data?.success) {
                setShowClaimLink(true);
                localStorage.setItem("amnt", String(cleanedPrize));
            } else {
                toast.error("Something went wrong!");
            }
        } catch {
            toast.error("Network error!");
        }
    };

    return (
        <div style={{
            backgroundImage: `url(${"https://img.freepik.com/free-photo/still-life-christmas-decoration-with-copy-space_23-2151868692.jpg?semt=ais_hybrid&w=740&q=80"})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
        }}>
            <div className="container">
                {showClaimLink && (
                    <div className="text-center text-white">
                        <p className="text-white bg-black rounded px-1">🎁 Click this link to claim your reward</p>

                        <Link to={`/fund`}>
                            <Button className="!bg-white !mt-1">
                                Claim Now
                            </Button>
                        </Link>
                    </div>
                )}

                <div className="wheel-area">
                    <canvas id="wheelcanvas" ref={canvasRef} width={500} height={500}></canvas>

                    <div className="play-btn" onClick={spin}></div>

                    <div className="pointer">
                        <img
                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAEsUlEQVR4nO2bX2gUVRjHv7M7MzuzO7uzs3s7u7M7s7sz+4RRMVIRBpWlStGlhKpSxYy0WxCxFIrI1TSi2r8g+Jf8QtqkUbqikCxsQSVFaFJJQxSJRCEpYhNEQ/7G+zc2dmZndmdmSmZvZnZmb2PvP/cc88557zrnPvuPc8wcc8/MeMBz0ySrZyHYS+vV6oXhwOB2wBi6XS6CQCYfDgb/8PsOFwOASqUS2tra0i5XIZFgqFPp9Gin5jamqKgD19fX0gk8ngbo+Pj8ZNjY2PB5RSKRtLS0uAzc0NoKqqCugCtvb2yCQSCLRaLRVjY2NZFxYWgt7eXtBoNBo1Gg0cDgcQohCYmJi0Wx2u12FIAjOzs7zHQ6HRISEoKmpScB4PB4CoVCIWCwWi0Wg0+nU7Ozs4CkUikQjgcBhgMBsvLy1i/fv2gtrYWTCYT2traMDExAUwmk7+/v8LBwUF4PB4YDAZ8fHxgYmIiYG9vD9BoNNBoNOh0OhwOh2Cz2WzcbjcbDocDoVCIna2truLy8xNPTkzgdrvtdg4ODlAqlcju7i6iKIrW1tYBu90Ol8tlt9uN1u93i4mKQSqUQHx+P9fV1MDQ0xO3tLe7u7hAlEolcXFzg8ePH+NjY2Ag4PDg3t7e4Ha7pVKpKBQKgtraWpBOp/G9vb2cHBwYFqtVo2NjYKCkpQUql0tDQYDgc6HQ6xsbGgkqlQmNjI8bhcHgOHw/j4+Hg8HgcPHz4EPDw6+vrwUqlkMvlWLVaTXfY2FgkEgmCwSD8/PykVCqVtbU1U1NTmM/n67rq6uiYmBxsbG5VKJY7FYjZ2dnYpPJ5PJ7KysogmUz8cDiMBiMBltZWYiqqio4HA7w+/uLDQ0NYDAagqamBvb29gMplMr6+voLAwIBcXFwgEolAq9Xq/S6XU5uZmMDs7y5UrV2Bpabmvr6/SaDRUVlYiFArFYjG63e6sra0thQKBwNzcHIxGo5/P5+NjYWFZWVuBxOJx6fT6eDwODg4P2traYCqVyPf9NmJgYX5OTkgEAgEqfT6eKoqAjX19e3S6XyLS0NGl0OlhYWG69erp7u4OEwqEYn89n3+/XnU4nG5bNq/3+fz8fDQ0NkFAoFABoeHoYkEgkkoik2traQSaT8fFx5HI5k8kEomg0WiAUCgOSkZHRxEKhUIh4/H4zp8/X4ZlMtlq1WoWm81mq1Go9G43G5bJ5PJBKpQB8fHzgcDqKpqYnUajUUqmUy2Uw2GyWRSLBZ/P5/mNjY0oikUgkUgEAjo6OmO73Y7FYpFqtVqvVaDR6PB7x8fFYWVlhd3cXGIaBzWazq6qqqKCgACsrK+FyuUwmkzabTfz8fMxGo8FqtWqtVqJRKJhMplEolEQpVKpUKhULBaLYLFYoFAoEAqHo4ODgxhGI4/H4wcHBhBqNRiYmJkEqlcLi4yO7u7sJqtZqmpibs7Gy4XC48fPhQd3e3vr6+MBgMhoaGhKC4uJlqt1sDAwABLS0tICTE5OTkgFAphcLjs7+8jPj6eg4ODVFWViNVqBUOh8DwOBwGBgZiYmJgKpUK/f39IDg4G6enpQDqdRkpKCjAbDb7//hsNhkMvlSEpKQmKxrGhoYFqtSo0Gg0iYmIIBAIcHBzw/PyM3Nxe9vb1obGyERCLBaLRYKhUAgEAmNjY2wsLCAXq9HQ0NDmEwmEhITg8uXL4HQ61traWgEqlkJKSAoVCAYbD4ZhGI1qtVmNjY9KkUkil0ul8rl8t9u92vb29tra26HQ6cHFxwbFYLKSkpODw8JD8/P9hsNtbo6GiMRiM9PT1YWFggk0lEotHo6OjjC9Es9EEEiQzpwAAAABJRU5ErkJggg=="
                            alt="pointer"
                        />

                    </div>
                </div>

                {winner && (
                    <div className="win-popup">
                        <div className="popup-content">
                            <p className="result-title">🎄 The results are in...</p>
                            <div className="winner-box">{winner}</div>
                        </div>
                    </div>
                )}

                <canvas ref={confettiRef} className="confetti"></canvas>
            </div>
        </div>
    );
};

export default Duplicate;
