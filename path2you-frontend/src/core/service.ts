import { API_URL } from "./constants";

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
            console.log(res);
            
            const data = await res.json();
            console.log(data);
            
            return data;

        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const register = async (data: any) => {
    try {
        const res = await fetch(`${API_URL}/auth/local/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        });
    
        if (!res.ok) {
        throw new Error("Failed to register");
        }
    
        const { data: user } = await res.json();
        return user;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getCourses = async () => {
  try {
    const res = await fetch(`${API_URL}/courses`);

    if (!res.ok) {
      throw new Error("Failed to fetch courses");
    }

    const { data } = await res.json();
    return data;
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
