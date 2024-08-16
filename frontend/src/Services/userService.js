import { api, requestConfig } from "../Utils/config";

// Pegar dados do usuario pelo token
const profile = async (data, token) => {
  const config = requestConfig("GET", data, token);

  try {
    const res = await fetch(api + "/users/profile", config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

// Atualizar o user
const updateProfile = async (data, token) => {
  const config = requestConfig("PUT", data, token, true);

  try {
    const res = await fetch(api + "/users/", config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

// Pegar o usuario pelo ID
const getUserDetails = async (id) => {
  const config = requestConfig("GET");

  try {
    const res = await fetch(api + "/users/" + id)
      .then((res) => res.json())
      .catch((err) => err);
  } catch (error) {
    console.log(error);
  }
};

const userService = {
  profile,
  updateProfile,
};

export default userService;
