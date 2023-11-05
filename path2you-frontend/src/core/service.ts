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


export const editarUsuario = async (id, data) => {
  try {
    const res = await fetch(`${API_URL}/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Fallo al editar usuario");
    } else {
      // Convierte el cuerpo de la respuesta a un objeto JSON
      const userData = await res.json();

      console.log("Usuario editado:", userData);
      return userData;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const editarRegistroLecture = async (id, data) => {
  console.log("data", data);
  
  try {
    const res = await fetch(`${API_URL}/registers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      
      throw new Error("Fallo al editar registro");
    
    } else {

      const data = await res.json();

      console.log("Registro editado:", data);
      return data;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

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

// getUsuario
export const getUsuario = async (id: string) => {
  try {
    const res = await fetch(`${API_URL}/users/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch user");
    } else {
        const data = await res.json();
        return data;    
    }

  } catch (error) {
    console.error(error);
    throw error;
  }
};

export function getPhoto({course}){
  const { url } = course.photo.data.attributes;
  return `${url}`
}

export function getMedia({lesson}){
  const { url } = lesson.media.data.attributes;
  return `${url}`
}

export default {
  logIn,
  register,
  getCourses,
};
