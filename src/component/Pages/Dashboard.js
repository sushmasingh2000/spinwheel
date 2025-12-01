import axios from "axios";
import { useState } from "react";
import bg from "../../assets/images/bg.jpg";
import { endpoint } from "../../services/urls";
import Spinner from "./Spinner/Home";

const Dashboard = () => {
    const [started, setStarted] = useState(false);

    const registrationgetfn = async () => {
        try {
            const res = await axios.get(endpoint?.member_user_registration);
            if (res?.data?.success) {
                localStorage.setItem("logindataen", res?.data?.result?.[0]?.token)
                localStorage.setItem("userId", res?.data?.result?.[0]?.cust_id)
            }
        } catch (e) {
            console.log("Something went wrong", e);
        }
    };
    const handleStart = () => {
        openFullscreen(); // allowed because user clicked
        setStarted(true);
        registrationgetfn();

    };

    const openFullscreen = () => {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    };

    return (
        <>
            {!started ? (
                <div
                    className=" text-white p-2 text-center z-20 flex h-screen items-center justify-center cursor-pointer"
                    style={{
                        backgroundImage: `url(${bg})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat"
                    }}
                    onClick={handleStart}
                >
                    Click  to start the game!
                </div>
            ) : (
                <Spinner />
            )}
        </>
    );
};

export default Dashboard;
