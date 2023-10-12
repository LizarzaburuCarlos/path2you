import { useEffect, useState } from "react";
import { userData } from "../core/helpers";
import { editarUsuario, getUsuario } from "../core/service";
import fetchApi from "../lib/strapi";
import type User from "../interfaces/user";
import { toast } from "react-toastify";

const TopBar = () => {

    const [usuario, setUsuario] = useState<User>();

    useEffect(() => {
        const fetchData = async () => {
          const userDataResponse = await userData();
            // console.log(userDataResponse);
          await fetchUserData(userDataResponse.id);
        };
        fetchData();
      }, []);

    async function fetchUserData(user) {
        try {
          const userDataApi = await fetchApi<User>({
            endpoint: "users/" + user,
          });
    
          setUsuario(userDataApi);
          // console.log(userDataApi);
          
        } catch (error) {
          console.log("error", error);
        }
    }

    const handleDarkMode = async () => {
 
      const usuarioDarkMode = { ...usuario!, darkmode: true, neumorphismmode: false };

      console.log(usuarioDarkMode);
      
      try {

        const res = await editarUsuario(usuarioDarkMode.id, usuarioDarkMode);
        console.log(res);
        
        if (!res.status) {
          console.log("Dark Mode Activado");
          
        } else {
          toast.error(res);
          console.log(res);
          
        }
      } catch (error) {
        toast.error("Error al activar el Dark Mode");
      }
    };

    return(
        <section className="topbar w-full h-16 mb-12 flex items-center justify-between">
            <form className="topbar__searchbar">
                <input type="text" placeholder="Buscar" className="topbar__search-input"/>
                <button type="submit" className="topbar__search-button">L</button>
            </form>
            <div className="topbar__side-buttons">
                <button onClick={handleDarkMode} className=" topbar__button darkmode">M</button>
                <button className="topbar__button lightmode">N</button>
            </div>
        </section>
    )
}

export default TopBar;
