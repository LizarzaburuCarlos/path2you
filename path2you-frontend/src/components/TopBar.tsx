import { useEffect, useState } from "react";
import { storeUser, userData } from "../core/helpers";
import { editarUsuario, getUsuario } from "../core/service";
import fetchApi from "../lib/strapi";
import type User from "../interfaces/user";
import { toast } from "react-toastify";

const TopBar = () => {

    const [usser, setUsser] = useState<User>();
    const [light, setLight] = useState<boolean>();
    const [dark, setDark] = useState<boolean>();
    const [neumorphism, setNeumorphism] = useState<boolean>();

    useEffect(() => {
      
        const fetchData = async () => {
          const userDataResponse = await userData();
          const usuarioCompleto = await fetchUserData(userDataResponse.id);
          setUsser(usuarioCompleto);
         
        };
        
        fetchData();
      }, []);

      useEffect(() => {
        handleFirstActive(usser);
       
      }, [usser]);

    async function fetchUserData(user) {
        try {
          const userDataApi = await fetchApi<User>({
            endpoint: "users/" + user,
          });
          
          return userDataApi;              
        } catch (error) {
          console.log("error", error);
        }
    }

    const editStyleUsuario = async (dark: boolean, neu: boolean) => {
      const usuarioUpdated = { ...usser!, darkmode: dark, neumorphismmode: neu };
      // console.log(usuarioUpdated);
      try {
        const res = await editarUsuario(usuarioUpdated.id, usuarioUpdated);
        storeUser(res);
        console.log(res);
        if (!res.status) {
          setUsser(usuarioUpdated);
          
        } else {
          toast.error(res);
          console.log(res);
        }
      } catch (error) {
        toast.error("Error al actualizar el usuario");
      }
    };

  const handleFirstActive = (user)  => {
    var btnDark = document.getElementById("btnDark")!;
    var btnLight = document.getElementById("btnLight")!;
    var btnNeu = document.getElementById("btnNeu")!;

    if (user?.darkmode === true) {
      setLight(false);
      setNeumorphism(false);
      setDark(true);
      btnDark.click();
    } else if (user?.neumorphismmode === true) {
      setLight(false);
      setDark(false);
      setNeumorphism(true);
      btnNeu.click();
    } else if (user?.darkmode === false && user?.neumorphismmode === false) {
      setDark(false);
      setNeumorphism(false);
      setLight(true);
      btnLight.click();
    }
  }

    const handleNeumorphismMode = () => {



      if (neumorphism === false) {
        setLight(false);
        setDark(false);
        setNeumorphism(true);
        editStyleUsuario(false, true);
      }

      document.body.classList.remove("dark");
      document.body.classList.remove("light");
      document.body.classList.add("neumorphism");

      console.log("Neumorfismo Activado");
    }

    const handleDarkMode = () => {

      

      if (dark === false) {
        setLight(false);
        setNeumorphism(false);
        setDark(true);
        editStyleUsuario(true, false);
      }

      document.body.classList.remove("neumorphism");
      document.body.classList.remove("light");
      document.body.classList.add("dark");
      
      console.log("Dark Mode Activado");
    };

    const handleLightMode = () => {

      if (light === false) {
        setDark(false);
        setNeumorphism(false);
        setLight(true);
        editStyleUsuario(false, false);
      }
      

      document.body.classList.remove("dark");
      document.body.classList.remove("neumorphism");
      document.body.classList.add("light");

      console.log("Modo Light Activado");
    };

    return(
        <section className="topbar w-full h-16 mb-12 flex items-center justify-between">
            <form className={`topbar__searchbar `}>
                <input type="text" placeholder="Buscar" className="topbar__search-input"/>
                <button type="submit" className={`topbar__search-button `}>S</button>
            </form>
            <div className="topbar__side-buttons">
                <button id="btnLight" onClick={handleLightMode} className={`topbar__button ${light ? "active": ""}`}>
                <i id="sunIcon" className={`${light ? "fa-solid": "fa-regular"}  fa-sun`}></i>
                </button>
                <button id="btnDark" onClick={handleDarkMode} className={`topbar__button ${dark  ? "active": ""} `}>
                <i id="moonIcon" className={`${dark ? "fa-solid": "fa-regular"}  fa-moon`}></i>
                </button>
                <button id="btnNeu" onClick={handleNeumorphismMode} className={`topbar__button ${neumorphism  ? "active": ""} `}>
                <i id="eyeIcon" className={`${neumorphism ? "fa-solid": "fa-regular"}  fa-eye`}></i>
                </button>
            </div>
        </section>
    )
}

export default TopBar;
