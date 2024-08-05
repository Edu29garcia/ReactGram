import { api, requestConfig } from "../Utils/config";

// REQUISIÇÃO DE AUTENTICAÇÃO DO USER

const register = async (data) => {
  const config = requestConfig("POST", data);

  try {
    const res = await fetch(api + "/user/register", config)
      .then((err) => res.json())
      .catch((err) => err);

    if (res) {
      localStorage.setItem("user", JSON.stringify(res));
    }
  } catch (error) {
    console.log(error);
  }
};

const authService = {
  register,
};

export default authService;
