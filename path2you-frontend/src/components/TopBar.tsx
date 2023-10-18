import { useEffect, useState } from "react";
import { userData } from "../core/helpers";
import { editarUsuario, getUsuario } from "../core/service";
import fetchApi from "../lib/strapi";
import type User from "../interfaces/user";
import { toast } from "react-toastify";

const TopBar = () => {

    const [usuario, setUsuario] = useState<User>();
    const [light, setLight] = useState<string>("");
    const [dark, setDark] = useState<string>("");
    const [neumorphism, setNeumorphism] = useState<string>("");

    useEffect(() => {
      
        const fetchData = async () => {
          const userDataResponse = await userData();
            // console.log(userDataResponse);
          await fetchUserData(userDataResponse.id);
          handleFirstActive(userDataResponse)
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

    // const handleDarkMode = async () => {
 
    //   const usuarioDarkMode = { ...usuario!, darkmode: true, neumorphismmode: false };
    //   // console.log(usuarioDarkMode);
      
    //   try {

    //     const res = await editarUsuario(usuarioDarkMode.id, usuarioDarkMode);
    //     // console.log(res);
        
    //     if (!res.status) {
    //       setStyle("dark");
    //       document.body.classList.remove("neumorphism");
    //       document.body.classList.remove("light");
    //       document.body.classList.add("dark");
    //       console.log("Dark Mode Activado");
          
    //     } else {
    //       toast.error(res);
    //       console.log(res);
          
    //     }
    //   } catch (error) {
    //     toast.error("Error al activar el Dark Mode");
    //   }
    // };

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
      handleDarkMode();
    } else if (user?.neumorphismmode === true) {
      setLight("");
      setDark("");
      setNeumorphism("active");
      handleNeumorphismMode();
    } else if (user?.darkmode === false && user?.neumorphismmode === false) {
      setDark("");
      setNeumorphism("");
      setLight("active");
      handleLightMode();
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

      document.body.classList.remove("dark");
      document.body.classList.remove("neumorphism");
      document.body.classList.add("light");
      console.log("Modo Light Activado");
    };

    // const handleNeumorphismMode = async () => {

    //   const usuarioNeumorphism = { ...usuario!, darkmode: false, neumorphismmode: true };
    //   // console.log(usuarioNeumorphism);
      
    //   try {

    //     const res = await editarUsuario(usuarioNeumorphism.id, usuarioNeumorphism);
    //     // console.log(res);
        
    //     if (!res.status) {
    //       setStyle("neumorphism");
    //       document.body.classList.remove("dark");
    //       document.body.classList.remove("light");
    //       document.body.classList.add("neumorphism");
          
    //       console.log("Neumorfismo Activado");
          
    //     } else {
    //       toast.error(res);
    //       console.log(res);
          
    //     }
    //   } catch (error) {
    //     toast.error("Error al activar el Neumorfismo Mode");
    //   }

    // };

    // const handleLightMode = async () => {

    //   const usuarioLightMode = { ...usuario!, darkmode: false, neumorphismmode: false };
    //   // console.log(usuarioNormalMode);
      
    //   try {

    //     const res = await editarUsuario(usuarioLightMode.id, usuarioLightMode);
    //     // console.log(res);
        
    //     if (!res.status) {
    //       setStyle("light");
    //       document.body.classList.remove("dark");
    //       document.body.classList.remove("neumorphism");
    //       document.body.classList.add("light");
          
    //       console.log("Modo Light Activado");
          
    //     } else {
    //       toast.error(res);
    //       console.log(res);
          
    //     }
    //   } catch (error) {
    //     toast.error("Error al activar el Modo Light");
    //   }

    // };

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
