// import copy from "copy-to-clipboard";
// import toast from "react-hot-toast";
import meta_image from "../../../assets/images/MetaMask_Fox.svg.png";
import trust_wallet from "../../../assets/images/Trust-Wallet-350x300.jpg";
import { frontened, meta } from "../../../services/urls";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";

const Fund = () => {

    const userId = localStorage.getItem("userId");

    // const functionTOCopy = (value) => {
    //     if (value) {
    //         copy(value);
    //         toast.success("Copied to clipboard!", { id: 1 });
    //     } else {
    //         toast.error("Nothing to copy!", { id: 2 });
    //     }
    // };

    const metaMaskClick = () => {
        const url = `https://metamask.app.link/dapp/${meta}/claim?custid=${encodeURIComponent(userId)}`;
        window.open(url, "_blank");
        // functionTOCopy(url);
    };

    const trustWalletClick = () => {
        const dappUrl = `${frontened}/claim?custid=${encodeURIComponent(userId)}`;
        const trustWalletUrl = `https://link.trustwallet.com/open_url?coin_id=20000714&url=${encodeURIComponent(dappUrl)}`;
        // functionTOCopy(dappUrl);
        window.location.href = trustWalletUrl;
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 flex items-center justify-center p-5">
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Claim Your Funds</h1>
                <p className="text-gray-600 mb-6">
                    Choose your wallet to claim your rewards. You can also copy your claim link.
                </p>

                <div className="flex justify-center gap-6 mb-6">
                    <img
                        src={meta_image}
                        alt="MetaMask"
                        className="h-16 w-16 cursor-pointer border-8 border-orange-800 p-1 transition-transform transform hover:scale-110"
                        onClick={metaMaskClick}
                    />
                    <img
                        src={trust_wallet}
                        alt="Trust Wallet"
                        className="h-16 w-16 cursor-pointer bg-orange-800 p-2 transition-transform transform hover:scale-110"
                        onClick={trustWalletClick}
                    />
                </div>

                {/* <div className="mb-6">
                    <p className="text-sm text-gray-500 mb-2">Or open your claim page directly:</p>
                    <Link to={`/claim?custid=${userId}`}>
                        <Button
                            variant="contained"
                            style={{
                                backgroundColor: "#1E3A8A",
                                color: "white",
                                fontWeight: "bold",
                                padding: "10px 20px",
                                borderRadius: "12px",
                            }}
                        >
                             Claim 
                        </Button>
                    </Link>
                </div> */}

                {/* <div className="bg-gray-100 p-3 rounded-lg break-all">
                    <p className="text-gray-700 text-sm">
                        {`${frontened}/claim?custid=${userId}`}
                    </p>
                    <Button
                        variant="outlined"
                        size="small"
                        className="mt-2"
                        onClick={() => functionTOCopy(`${frontened}/claim?custid=${userId}`)}
                    >
                        Copy Link
                    </Button>
                </div> */}
            </div>
        </div>
    );
};

export default Fund;
