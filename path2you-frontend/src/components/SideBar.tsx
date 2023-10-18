
//FALTA:
// 1. Agregar funcionalidad a cada sección del menú
// 2. Agregar background al menú según la sección en la que se encuentre el usuario

const SideBar = () => {
  
  const logout = () => {
    localStorage.setItem("user", "");
    location.replace("/");
    
    
  };

  return (
    <nav className={`sidebar  w-full h-full px-4 py-10 flex flex-col justify-between items-center`}>
      <div className="sidebar__top  w-full">
        <img src="/icono.png" alt="" className="sidebar__logo max-w-[3rem] mx-auto" />
        <ul className="sidebar__menu flex flex-col gap-6 mt-20 items-center text-white">
          <li className={`sidebar__menu-item `}>
            <a href="/" className="sidebar__menu-link">
            <i className="fa-solid fa-house text-white text-2xl"></i>
            </a>
          </li>
          <li className={`sidebar__menu-item `}>
            <a href="/courses" className="sidebar__menu-link">
              <i className="fas fa-book text-white text-2xl"></i>
            </a>
          </li>
          <li className={`sidebar__menu-item `}>
            <a href="/profile" className="sidebar__menu-link">
              <i className="fas fa-user text-white text-2xl"></i>
            </a>
          </li>
          <li className={`sidebar__menu-item `}>
            <a href="/settings" className="sidebar__menu-link">
              <i className="fas fa-cog text-white text-2xl"></i>
            </a>
          </li>
        </ul>
      </div>
      <div className="sidebar__bottom text-white w-full">
        <button onClick={logout} className={`w-full`}>
        <i className="fa fa-right-to-bracket text-2xl mx-auto"></i>
        </button>
      </div>
    </nav>
  );
};

export default SideBar;
