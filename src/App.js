import { Route, Routes } from "react-router-dom";
import "./assets/style/main.css";
import Dashboard from "./component/Pages/Dashboard";
import ClaimReward from "./component/Pages/Spinner/Claim";
import Fund from "./component/Pages/Spinner/Fund";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/claim" element={<ClaimReward />} />
      <Route path="/fund" element={<Fund />} />
      
    </Routes>
  );
}

export default App;
