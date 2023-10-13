import { useEffect, useState } from "react";
import { userData } from "../core/helpers";
import { editarUsuario, getUsuario } from "../core/service";
import fetchApi from "../lib/strapi";
import type User from "../interfaces/user";
import { toast } from "react-toastify";

const TopBar = () => {

    const [usuario, setUsuario] = useState<User>();
    const [style, setStyle] = useState<string>("");

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
          fetchStyle(userDataApi);
          // console.log(userDataApi);

        } catch (error) {
          console.log("error", error);
        }
    }

    const fetchStyle = async (usuario) => {
    
      if (usuario!.darkmode === true) {
        setStyle("dark");
      } else if (usuario!.neumorphismmode === true) {
        setStyle("neumorphism");
      } else {
        setStyle("light");
      }

    };

    const handleDarkMode = async () => {
 
      const usuarioDarkMode = { ...usuario!, darkmode: true, neumorphismmode: false };

      // console.log(usuarioDarkMode);
      
      try {

        const res = await editarUsuario(usuarioDarkMode.id, usuarioDarkMode);
        console.log(res);
        
        if (!res.status) {
          setStyle("dark");
          console.log("Dark Mode Activado");
          
        } else {
          toast.error(res);
          console.log(res);
          
        }
      } catch (error) {
        toast.error("Error al activar el Dark Mode");
      }
    };

    const handleNeumorphismMode = async () => {

      const usuarioNeumorphism = { ...usuario!, darkmode: false, neumorphismmode: true };

      // console.log(usuarioNeumorphism);
      
      try {

        const res = await editarUsuario(usuarioNeumorphism.id, usuarioNeumorphism);
        // console.log(res);
        
        if (!res.status) {
          setStyle("neumorphism");
          console.log("Neumorfismo Activado");
          
        } else {
          toast.error(res);
          console.log(res);
          
        }
      } catch (error) {
        toast.error("Error al activar el Neumorfismo Mode");
      }

    };

    const handleLightMode = async () => {

      const usuarioLightMode = { ...usuario!, darkmode: false, neumorphismmode: false };

      // console.log(usuarioNormalMode);
      
      try {

        const res = await editarUsuario(usuarioLightMode.id, usuarioLightMode);
        // console.log(res);
        
        if (!res.status) {
          setStyle("light");
          console.log("Modo Light Activado");
          
        } else {
          toast.error(res);
          console.log(res);
          
        }
      } catch (error) {
        toast.error("Error al activar el Modo Light");
      }

    };

    return(
        <section className="topbar w-full h-16 mb-12 flex items-center justify-between">
            <form className={`topbar__searchbar ${style}`}>
                <input type="text" placeholder="Buscar" className="topbar__search-input"/>
                <button type="submit" className={`topbar__search-button ${style}`}>S</button>
            </form>
            <div className="topbar__side-buttons">
                <button onClick={handleLightMode} className={`topbar__button ${style}`}>L</button>
                <button onClick={handleDarkMode} className={`topbar__button ${style}`}>M</button>
                <button onClick={handleNeumorphismMode} className={`topbar__button ${style}`}>N</button>
            </div>
        </section>
    )
}

export default TopBar;
