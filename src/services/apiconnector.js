import axios from "axios";

export const apiConnectorGet = async (endpoint, param) => {
  try {
    const response = await axios?.get(
      endpoint,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("logindataen")}`,
        },
      },
      {
        params: param,
      }
    );
    // if (response?.data?.msg === "Invalid Token.") {
    //   toast("Login in another device ", { id: 1 });
    //   localStorage.clear();
    //   sessionStorage.clear();
    //   window.location.href = `${front_end_domain}`;
    //   return;
    // }
    return response;
  } catch (e) {
    return {
      msg: e?.message,
    };
  }
};
export const apiConnectorPost = async (endpoint, reqBody) => {
  try {
    const response = await axios?.post(endpoint, reqBody, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("logindataen")}`,
      },
    });
    return response;
  } catch (e) {
    return {
      msg: e?.message,
    };
  }
};
export const apiConnectorGetWithoutToken = async (endpoint, param, logindataen) => {
  try {
    const response = await axios?.get(
      endpoint,
      {
        headers: {
          Authorization: `Bearer ${logindataen}`,
        },
      },
      {
        params: param,
      }
    );
    // if (response?.data?.msg === "Invalid Token.") {
    //   toast("Login in another device ", { id: 1 });
    //   localStorage.clear();
    //   sessionStorage.clear();
    //   window.location.href = `${front_end_domain}`;
    //   return;
    // }
    return response;
  } catch (e) {
    return {
      msg: e?.message,
    };
  }
};
export const apiConnectorPOSTWithoutToken = async (
  endpoint,
  reqBody,
  logindataen
) => {
  try {
    const response = await axios?.post(endpoint, reqBody, {
      headers: {
        Authorization: `Bearer ${logindataen}`,
      },
    });
    return response;
  } catch (e) {
    return {
      msg: e?.message,
    };
  }
};


