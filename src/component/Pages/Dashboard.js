import axios from "axios";
import { useState } from "react";
import bg from "../../assets/images/bg.jpg";
import { endpoint } from "../../services/urls";
import Spinner from "./Spinner/Home";
import Duplicate from "./Spinner/Duplicate";

const Dashboard = () => {
  const [started, setStarted] = useState(false);

  const registrationgetfn = async () => {
    try {
      const res = await axios.get(endpoint?.member_user_registration);
      if (res?.data?.success) {
        localStorage.setItem(
          "logindataen",
          res?.data?.result?.[0]?.token
        );
        localStorage.setItem(
          "userId",
          res?.data?.result?.[0]?.cust_id
        );
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

  return !started ? (
    <div
      className="text-white p-2 text-center z-20 flex h-screen items-center justify-center cursor-pointer christmas-glow relative"
      style={{
        backgroundImage: `url(${"https://i.pinimg.com/236x/4e/7d/b4/4e7db4d95320d533f5a80c879f3ec91e.jpg"})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      onClick={handleStart}
    >
    <p className="">  Click to start the game!</p>
      <div className="snow">
        {Array.from({ length: 40 }).map((_, i) => (
          <span
            key={i}
            style={{
              left: Math.random() * 100 + "%",
              animationDuration: 2 + Math.random() * 4 + "s",
              animationDelay: Math.random() * 5 + "s",
            }}
          ></span>
        ))}
      </div>
    </div>
  ) : (
    <Duplicate />
  );
};

export default Dashboard;


// return(
 
//       <>
//             {!started ? (
//                 <div
//                     className=" text-white p-2 text-center z-20 flex h-screen items-center justify-center cursor-pointer"
//                     style={{
//                         backgroundImage: `url(${bg})`,
//                         backgroundSize: "cover",
//                         backgroundPosition: "center",
//                         backgroundRepeat: "no-repeat"
//                     }}
//                     onClick={handleStart}
//                 >
//                     Click  to start the game!
//                 </div>
//             ) : (
//                 // <Spinner />
//                 <Duplicate/>
//             )}
//         </>
   
// )