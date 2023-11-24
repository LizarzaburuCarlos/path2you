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
  const [isOpen, setIsOpen] = useState(false);

  const logout = () => {
    localStorage.setItem("user", "");
    location.replace("/");
  };


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

  const handleFirstActive = (user) => {
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
  };

  const handleNeumorphismMode = () => {
    if (neumorphism === false) {
      setLight(false);
      setDark(false);
      setNeumorphism(true);
      editStyleUsuario(false, true);
      setIsOpen(false);
    }

    document.body.classList.remove("dark");
    document.body.classList.remove("light");
    document.body.classList.add("neumorphism");

    console.log("Neumorfismo Activado");
  };

  const handleDarkMode = () => {
    if (dark === false) {
      setLight(false);
      setNeumorphism(false);
      setDark(true);
      editStyleUsuario(true, false);
      setIsOpen(false);
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
      setIsOpen(false);
    }

    document.body.classList.remove("dark");
    document.body.classList.remove("neumorphism");
    document.body.classList.add("light");

    console.log("Modo Light Activado");
  };

  return (
    <section className="topbar w-full h-16 mb-12 flex items-center justify-between">
      <form action="/search" method="get" className={`topbar__searchbar`}>
        <input
          type="text"
          placeholder="Buscar un curso..."
          className="topbar__search-input"
          name="title"
          minLength={3}
          required
        />
        <button type="submit" className={`topbar__search-button `} >
          <i className="fa-solid fa-magnifying-glass text-base"></i>
        </button>
      </form>
      <div className="topbar__side-buttons">
        <button
          id="btnLight"
          onClick={handleLightMode}
          className={`topbar__button ${light ? "active" : ""}`}
        >
          <i
            id="sunIcon"
            className={`${light ? "fa-solid" : "fa-regular"}  fa-sun`}
          ></i>
        </button>
        <button
          id="btnDark"
          onClick={handleDarkMode}
          className={`topbar__button ${dark ? "active" : ""} `}
        >
          <i
            id="moonIcon"
            className={`${dark ? "fa-solid" : "fa-regular"}  fa-moon`}
          ></i>
        </button>
        <button
          id="btnNeu"
          onClick={handleNeumorphismMode}
          className={`topbar__button ${neumorphism ? "active" : ""} `}
        >
          <i
            id="eyeIcon"
            className={`${neumorphism ? "fa-solid" : "fa-regular"}  fa-eye`}
          ></i>
        </button>
      </div>
      <div className="topbar-responsive__image sm:hidden">
        <img src="/icono.png" alt="" className="sidebar__logo max-w-[2.5rem]" />
      </div>
      <button
        className="topbar__toggler md:hidden flex hover:text-white active:fill-white hover:fill-white hover:stroke-white cursor-pointer border rounded-md hover:bg-customPrimary p-3 transition-all duration-300"
        type="button"
        aria-expanded="false"
        aria-label="Navegación"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="topbar__toggler-default">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              x1="3.5"
              y1="5.5"
              x2="21.5"
              y2="5.5"
              stroke="#292D32"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="line"
            />
            <line
              x1="4.5"
              y1="12.5"
              x2="21.5"
              y2="12.5"
              stroke="#292D32"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="line"
            />
            <line
              x1="11.5"
              y1="19.5"
              x2="21.5"
              y2="19.5"
              stroke="#292D32"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="line"
            />
          </svg>
        </span>
      </button>
      {isOpen && (
        <div className="flex flex-col mt-16 lg:hidden absolute top-4 left-0 bg-white z-50 w-full items-center gap-10 pb-10 border-y pt-10">
          <button
            id="btnLight"
            onClick={handleLightMode}
            className={`topbar__button rounded-xl ${light ? "active" : ""}`}
          >
            Modo Default
            <i
              id="sunIcon"
              className={`${light ? "fa-solid" : "fa-regular"} ml-4 fa-sun`}
            ></i>
          </button>
          <button
            id="btnDark"
            onClick={handleDarkMode}
            className={`topbar__button rounded-xl  ${dark ? "active" : ""} `}
          >
            Modo Oscuro
            <i
              id="moonIcon"
              className={`${dark ? "fa-solid" : "fa-regular"}  ml-4 fa-moon`}
            ></i>
          </button>
          <button
            id="btnNeu"
            onClick={handleNeumorphismMode}
            className={`topbar__button rounded-xl  ${
              neumorphism ? "active" : ""
            } `}
          >
            Modo Neumorfismo
            <i
              id="eyeIcon"
              className={`${
                neumorphism ? "fa-solid" : "fa-regular"
              }  ml-4 fa-eye`}
            ></i>
          </button>
          <button onClick={logout} className={`w-full`}>
            Cerrar Sesión
            <i className="fa fa-right-to-bracket text-2xl mx-auto ml-4"></i>
          </button>
        </div>
      )}
    </section>
  );
};

export default TopBar;
