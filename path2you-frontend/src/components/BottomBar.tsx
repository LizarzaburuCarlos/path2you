import { useEffect, useState } from "react";
import "../styles/BottomBarDefault.styles.css";

const BottomBar = () => {
  useEffect(() => {
    const currentUrl = window.location.pathname;
    const menuItems = document.querySelectorAll(".bottombar__menu-item");
    const cursosItem = document.getElementById("cursos")!;

    menuItems.forEach((item) => {
      const link = item.querySelector(".bottombar__menu-link");

      if (link) {
        const linkUrl = link.getAttribute("href");

        if (linkUrl === currentUrl) {
          item.classList.add("active");
        }
      }

      if (currentUrl.includes("/courses")) {
        cursosItem.classList.add("active");
      }
    });
  }, []);

  return (
    <nav className="bottombar w-11/12 h-20 px-10 py-10 flex flex-row justify-between items-center sm:hidden">
      <ul className="bottombar__menu flex flex-row h-full w-full gap-6 items-center justify-between text-white">
        <li className={`bottombar__menu-item`}>
          <a href="/" className="bottombar__menu-link">
            <i className="fa-solid fa-house text-white text-2xl"></i>
          </a>
        </li>
        <li className={`bottombar__menu-item`}>
          <a href="/courses" className="bottombar__menu-link">
            <i className="fas fa-book text-white text-2xl"></i>
          </a>
        </li>
        <li className={`bottombar__menu-item`}>
          <a href="/profile" className="bottombar__menu-link">
            <i className="fas fa-user text-white text-2xl"></i>
          </a>
        </li>
        <li className={`bottombar__menu-item`}>
          <a href="/settings" className="bottombar__menu-link">
            <i className="fas fa-cog text-white text-2xl"></i>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default BottomBar;
