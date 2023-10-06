import { API_URL, STRAPI_URL } from "./constants";

export const logIn = async (identifier: string, password: string) => {
  try {
    const res = await fetch(`${API_URL}/auth/local`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });

    if (!res.ok) {
      console.log("Fallo al iniciar sesión");

      const { error } = await res.json();

      return error;
    } else {
      console.log("Usuario autenticado");

      const data = await res.json();

      return data;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const register = async (data: any) => {
  try {
    const res = await fetch(`${API_URL}/auth/local/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Fallo al Registrar");

      const { error } = await res.json();

      return error;

    } else {
      console.log("Usuario registrado");
      const { user } = await res.json();
      return user;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export function getPhoto({course}){
  const { url } = course.photo.data.attributes;
  return `${STRAPI_URL}${url}`
}

export const getCourses = async () => {
  try {
    const res = await fetch(`${API_URL}/courses?populate=photo`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch courses");
    } else {
        console.log("Cursos obtenidos");
        const { data } = await res.json();
        return data;    
    }

  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default {
  logIn,
  register,
  getCourses,
};
