import { useEffect, useState } from "react";
import { userData } from "../core/helpers";
import { editarUsuario, getUsuario } from "../core/service";
import fetchApi from "../lib/strapi";
import type User from "../interfaces/user";
import { toast } from "react-toastify";

const TopBar = () => {

    const [usser, setUsser] = useState<User>();
    const [light, setLight] = useState<string>("");
    const [dark, setDark] = useState<string>("");
    const [neumorphism, setNeumorphism] = useState<string>("");

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

    const handleIconsBtns = () => {
      var btnNeu = document.getElementById("btnNeu");
      var btnDark = document.getElementById("btnDark");
      var btnLight = document.getElementById("btnLight");

      var sunIcon = document.getElementById("sunIcon");
      var moonIcon = document.getElementById("moonIcon");
      var eyeIcon = document.getElementById("eyeIcon");

      if (btnNeu?.classList.contains("active")) {
        eyeIcon?.classList.remove("fa-regular");
        eyeIcon?.classList.add("fa-solid");
        sunIcon?.classList.remove("fa-solid");
        sunIcon?.classList.add("fa-regular");
        moonIcon?.classList.remove("fa-solid");
        moonIcon?.classList.add("fa-regular");
      }

      if (btnDark?.classList.contains("active")) {
        moonIcon?.classList.remove("fa-regular");
        moonIcon?.classList.add("fa-solid");
        sunIcon?.classList.remove("fa-solid");
        sunIcon?.classList.add("fa-regular");
        eyeIcon?.classList.remove("fa-solid");
        eyeIcon?.classList.add("fa-regular");
      }
      if (btnLight?.classList.contains("active")) {
        sunIcon?.classList.remove("fa-regular");
        sunIcon?.classList.add("fa-solid");
        moonIcon?.classList.remove("fa-solid");
        moonIcon?.classList.add("fa-regular");
        eyeIcon?.classList.remove("fa-solid");
        eyeIcon?.classList.add("fa-regular");
    }
  }

  const handleFirstActive = (user)  => {
    if (user?.darkmode === true) {
      setLight("");
      setNeumorphism("");
      setDark("active");
      handleIconsBtns();
    } else if (user?.neumorphismmode === true) {
      setLight("");
      setDark("");
      setNeumorphism("active");
      handleIconsBtns();
    } else if (user?.darkmode === false && user?.neumorphismmode === false) {
      setDark("");
      setNeumorphism("");
      setLight("active");
      handleIconsBtns();
    }
  }

    const handleNeumorphismMode = () => {

      var btnNeu = document.getElementById("btnNeu");
      var btnDark = document.getElementById("btnDark");
      var btnLight = document.getElementById("btnLight");

      btnLight?.classList.remove("active");
      btnDark?.classList.remove("active");
      btnNeu?.classList.add("active");

      handleIconsBtns();
      editStyleUsuario(false, true);

      document.body.classList.remove("dark");
      document.body.classList.remove("light");
      document.body.classList.add("neumorphism");

      console.log("Neumorfismo Activado");
    }

    const handleDarkMode = () => {
      var btnNeu = document.getElementById("btnNeu");
      var btnDark = document.getElementById("btnDark");
      var btnLight = document.getElementById("btnLight");

      btnLight?.classList.remove("active");
      btnNeu?.classList.remove("active");
      btnDark?.classList.add("active");

      handleIconsBtns();
      editStyleUsuario(true, false);

      document.body.classList.remove("neumorphism");
      document.body.classList.remove("light");
      document.body.classList.add("dark");
      console.log("Dark Mode Activado");
    };

    const handleLightMode = () => {

      var btnNeu = document.getElementById("btnNeu");
      var btnDark = document.getElementById("btnDark");
      var btnLight = document.getElementById("btnLight");
      
      btnDark?.classList.remove("active");
      btnNeu?.classList.remove("active");
      btnLight?.classList.add("active");
      
      handleIconsBtns();
      editStyleUsuario(false, false);

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
                <button id="btnLight" onClick={handleLightMode} className={`topbar__button ${light}`}>
                <i id="sunIcon" className="fa-regular fa-sun"></i>
                </button>
                <button id="btnDark" onClick={handleDarkMode} className={`topbar__button ${dark} `}>
                <i id="moonIcon" className="fa-regular fa-moon"></i>
                </button>
                <button id="btnNeu" onClick={handleNeumorphismMode} className={`topbar__button ${neumorphism} `}>
                <i id="eyeIcon" className="fa-regular fa-eye"></i>
                </button>
            </div>
        </section>
    )
}

export default TopBar;
