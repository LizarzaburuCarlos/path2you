import { useEffect, useState } from "react";
import { userData } from "../core/helpers";
import { editarUsuario, getUsuario } from "../core/service";
import fetchApi from "../lib/strapi";
import type User from "../interfaces/user";
import { toast } from "react-toastify";

const TopBar = () => {

    const [usuario, setUsuario] = useState<User>();
    const [active, setActive] = useState<string>("");
    // const [style, setStyle] = useState<string>("");

    useEffect(() => {
      
        const fetchData = async () => {
          const userDataResponse = await userData();
            // console.log(userDataResponse);
          await fetchUserData(userDataResponse.id);
        };
        handleIconsBtns();
        fetchData();
        
      }, []);

      

    async function fetchUserData(user) {
        try {
          const userDataApi = await fetchApi<User>({
            endpoint: "users/" + user,
          });    
          setUsuario(userDataApi);
          // fetchStyle(userDataApi);
          // console.log(userDataApi);

        } catch (error) {
          console.log("error", error);
        }
    }

    // const fetchStyle = async (usuario) => {
    
    //   if (usuario!.darkmode === true) {
    //     setStyle("dark");
        
    //   } else if (usuario!.neumorphismmode === true) {
    //     setStyle("neumorphism");
        
    //   } else {
    //     setStyle("light");
    
    //   }

    // };

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
       
        sunIcon?.classList.remove("fa-solid");
        sunIcon?.classList.add("fa-regular");
        moonIcon?.classList.remove("fa-solid");
        moonIcon?.classList.add("fa-regular");
        eyeIcon?.classList.remove("fa-regular");
        eyeIcon?.classList.add("fa-solid");
      } else if (btnDark?.classList.contains("active")) {
        sunIcon?.classList.remove("fa-solid");
        sunIcon?.classList.add("fa-regular");
        eyeIcon?.classList.remove("fa-solid");
        eyeIcon?.classList.add("fa-regular");
        moonIcon?.classList.remove("fa-regular");
        moonIcon?.classList.add("fa-solid");

    } else {
        moonIcon?.classList.remove("fa-solid");
        moonIcon?.classList.add("fa-regular");
        eyeIcon?.classList.remove("fa-solid");
        eyeIcon?.classList.add("fa-regular");
        sunIcon?.classList.remove("fa-regular");
        sunIcon?.classList.add("fa-solid");
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
                <button id="btnLight" onClick={handleLightMode} className={`topbar__button active`}>
                <i id="sunIcon" className="fa-regular fa-sun"></i>
                </button>
                <button id="btnDark" onClick={handleDarkMode} className={`topbar__button `}>
                <i id="moonIcon" className="fa-regular fa-moon"></i>
                </button>
                <button id="btnNeu" onClick={handleNeumorphismMode} className={`topbar__button `}>
                <i id="eyeIcon" className="fa-regular fa-eye"></i>
                </button>
            </div>
        </section>
    )
}

export default TopBar;
