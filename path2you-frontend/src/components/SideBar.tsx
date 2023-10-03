import { useEffect } from "react";

//FALTA:
// 1. Agregar íconos a cada sección del menú
// 2. Agregar funcionalidad a cada sección del menú
// 3. Agregar background al menú según la sección en la que se encuentre el usuario


const SideBar = () => {
  const logout = () => {
    localStorage.setItem("user", "");
    location.replace("/");
  };

  return (
    <nav className="sidebar w-full h-full px-4 py-10 flex flex-col justify-between items-center">
      <div className="sidebar__top  w-full">
        <img src="/icono.png" alt="" className="sidebar__logo max-w-[3rem] mx-auto" />
        <ul className="sidebar__menu flex flex-col gap-6 mt-20 items-center text-white">
          <li className="sidebar__menu-item">
            <a href="/" className="sidebar__menu-link">
              <i className="fas fa-home"></i>
              Inicio
            </a>
          </li>
          <li className="sidebar__menu-item">
            <a href="/profile" className="sidebar__menu-link">
              <i className="fas fa-user"></i>
              Perfil
            </a>
          </li>
          <li className="sidebar__menu-item">
            <a href="/courses" className="sidebar__menu-link">
              <i className="fas fa-book"></i>
              Cursos
            </a>
          </li>
          <li className="sidebar__menu-item">
            <a href="/settings" className="sidebar__menu-link">
              <i className="fas fa-cog"></i>
              Ajustes
            </a>
          </li>
        </ul>
      </div>
      <div className="sidebar__bottom text-white w-full">
        <button onClick={logout} className="sidebar__logoff">
          L
        </button>
      </div>
    </nav>
  );
};

export default SideBar;
