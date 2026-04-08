import axios from "axios";

export default async function FRProducts() {
  const res = await fetch("https://download.falk-ross.eu/ws/R000-011/json/99967.json");

  if (!res.ok) {
    throw new Error(`Error al descargar JSON: ${res.status}`);
  }

  const data = await res.json();
  return data;
}