import { Button } from "@mui/material";
import copy from "copy-to-clipboard";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import wheel from "../../../assets/audio/Prize-wheel-spin-sound-effect.mp3";
import { apiConnectorPost } from "../../../services/apiconnector";
import { endpoint } from "../../../services/urls";
import "./Spinner.css";

const values = [
    "$ 0", "$ 0.8", "$ 5",
    "$10 ", "$ 0.2", "$ 1",
    "$ 6", "$ 7",
    "$0.4", "$ 0.3", "$ 9",
    "$ 3", "$ 8"
];

const colors = [
    "#c6d200", "#4fd34f", "#00e277",
    "#00d1ff", "#0094ff", "#1a48ff",
    "#462dff", "#8d00ff",
    "#ff00c8", "#ff0055", "#ff2a00",
    "#ff7a00", "#ffe600"
];   

const Spinner = () => {
    const canvasRef = useRef(null);
    const confettiRef = useRef(null);
    const [angle, setAngle] = useState(0);
    const [spinning, setSpinning] = useState(false);
    const [showClaimLink, setShowClaimLink] = useState(false);
    const [winner, setWinner] = useState(null);
    const audioRef = useRef(new Audio(wheel));
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
        audioRef.current = new Audio(wheel);
        audioRef.current.loop = true;
        audioRef.current.preload = "auto";
    }, []);

    const cleanPrize = (value) => {
        return Number(value.replace(/[^0-9.]/g, ""));
    };

    const spin = () => {
        if (spinning) return;
        setSpinning(true);

        // Play sound once at start
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(err => console.log(err));
        }

        // Stop sound after 1 second
        setTimeout(() => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        }, 4000); // adjust duration as needed

        let localSpeed = Math.random() * 0.35 + 0.35;
        let localAngle = angle;

        const loop = setInterval(() => {
            localAngle += localSpeed;
            localSpeed *= 0.985;

            const pointerOffset = (3 * Math.PI) / 4 + 0.30;
            let activeIndex = Math.floor(((2 * Math.PI - ((localAngle + pointerOffset) % (2 * Math.PI))) / arc));
            activeIndex = (activeIndex + values.length) % values.length;

            // const activeIndex = Math.floor(
            //     ((2 * Math.PI - (localAngle % (2 * Math.PI))) / arc) % values.length
            // );

            drawWheelRotated(localAngle);

            if (localSpeed < 0.002) {
                clearInterval(loop);
                setSpinning(false);
                setAngle(localAngle);
                setWinner(values[activeIndex]);
                const prize = values[activeIndex];
                if (prize === "$ 0") {
                    toast("Better luck next time!");

                    // Hide result popup after 2 seconds
                    setTimeout(() => {
                        setWinner(null);
                    }, 2000);

                    return;
                } else {
                    // Show winner popup
                    setWinner(prize);
                    startConfetti();
                    storeresult(prize)
                    setTimeout(() => setWinner(null), 3000);
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


    const confettiAnimationRef = useRef(null);

    const startConfetti = () => {
        const confettiCanvas = confettiRef.current;
        const ctx = confettiCanvas.getContext("2d");
        const confettiCount = 150;
        let confettiPieces = [];

        const randomColor = () => {
            const colors = ["#ff595e", "#ffca3a", "#8ac926", "#1982c4", "#6a4c93"];
            return colors[Math.floor(Math.random() * colors.length)];
        };

        for (let i = 0; i < confettiCount; i++) {
            confettiPieces.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight - window.innerHeight,
                w: 8,
                h: 14,
                color: randomColor(),
                speed: Math.random() * 3 + 2
            });
        }

        const draw = () => {
            ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            confettiPieces.forEach(c => {
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

        // Stop confetti after 3 seconds
        setTimeout(() => {
            if (confettiAnimationRef.current) {
                cancelAnimationFrame(confettiAnimationRef.current);
                ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            }
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
            } else {
                toast.error("Something went wrong!", { id: 1 });
            }
        } catch (e) {
            toast.error("Network error!", { id: 1 });
            console.log(e);
        }
    };

    // const functionTOCopy = (value) => {
    //     copy(value);
    //     toast.success("Copied to clipboard!", { id: 1 });
    // };

    return (
        <div style={{
            backgroundImage: `url(${"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIoM_qvPcms4Z4s9ieXqGHocw3oVQMvUau6A&s"})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
        }}>

            <div
                className="container">
                {showClaimLink && (
                    <div className="text-center ">
                        <p className="text-white">Click this link to claim your amount</p>

                        <Link
                            to={`/fund`}>
                            <Button className="!bg-white !mt-1"> Claim Now</Button>
                        </Link>
                        
                    </div>
                )}
                <div className="wheel-area">
                    <canvas id="wheelcanvas" ref={canvasRef} width={500} height={500}></canvas>
                    <div className="play-btn" onClick={spin}></div>
                    <div className="pointer">
                        <img src="https://spinnerwheel.ahaslides.com/172d3668319f74a13a29770d7c394b17.svg" alt="pointer" />
                    </div>
                </div>

                {winner && (
                    <div className="win-popup">
                        <div className="popup-content">
                            <p className="result-title">The results are in...</p>
                            <div className="winner-box">{winner}</div>
                        </div>
                    </div>
                )}
                <canvas ref={confettiRef} className="confetti"></canvas>
            </div>
        </div>

    );
};

export default Spinner;
