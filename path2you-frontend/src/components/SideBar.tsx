import { useEffect } from "react";

const SideBar = () => {
  
  const logout = () => {
    localStorage.setItem("user", "");
    location.replace("/");
    
  };

  useEffect(() => {
    const currentUrl = window.location.pathname;
    const menuItems = document.querySelectorAll('.sidebar__menu-item');
    const cursosItem = document.getElementById('cursos')!;

    menuItems.forEach(item => {
      const link = item.querySelector('.sidebar__menu-link');

      if (link) {
        const linkUrl = link.getAttribute('href');

        if (linkUrl === currentUrl) {    
          item.classList.add('active');
          }
        }

        if ((currentUrl.includes("/courses") || currentUrl.includes("/modules") 
        || currentUrl.includes("/lessons") || currentUrl.includes("/practices")
        || currentUrl.includes("/exams"))) {
          cursosItem.classList.add('active');
        }
      });

  }, []);

  return (
    <nav className={`sidebar w-full h-full px-4 py-10 flex flex-col justify-between items-center`}>
      <div className="sidebar__top  w-full">
        <div className="sidebar__logo w-[56px] h-[56px] rounded-full flex flex-row  mx-auto justify-center items-center">
          <img src="/icono.png" alt="" className="sidebar__logo max-w-[2.5rem]" />
        </div>
        <ul className="sidebar__menu flex flex-col gap-6 mt-20 items-center text-white">
          <li className={`sidebar__menu-item`}>
            <a href="/" className="sidebar__menu-link">
            <i className="fa-solid fa-house text-white text-2xl"></i>
            <p className="font-semibold tracking-wide mt-[2px] uppercase text-xs">Inicio</p>
            </a>
          </li>
          <li id="cursos" className={`sidebar__menu-item`}>
            <a href="/courses" className="sidebar__menu-link">
              <i className="fas fa-book text-white text-2xl"></i>
              <p className="font-semibold tracking-wide mt-[2px] uppercase text-xs">Cursos</p>
            </a>
          </li>
          <li className={`sidebar__menu-item`}>
            <a href="/profile" className="sidebar__menu-link">
              <i className="fas fa-user text-white text-2xl"></i>
              <p className="font-semibold tracking-wide mt-[2px] uppercase text-xs">Perfil</p>
            </a>
          </li>
          {/* <li className={`sidebar__menu-item `}>
            <a href="/settings" className="sidebar__menu-link">
              <i className="fas fa-cog text-white text-2xl"></i>
            </a>
          </li> */}
        </ul>
      </div>
      <div className="sidebar__bottom  text-white w-full">
        <button onClick={logout} className={`w-full`}>
        <i className="fa fa-right-to-bracket text-2xl mx-auto"></i>
        </button>
      </div>
    </nav>
  );
};

export default SideBar;
