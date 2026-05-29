import axios from "axios";

export async function handleLogout(router) {
  try {
    await axios.post("/api/auth/logout");

    router.push("/auth/login");
    router.refresh();
  } catch (error) {
    console.log("Ha habido un error a la hora de desloguearte", error)
  }

}

