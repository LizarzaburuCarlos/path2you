import { useEffect, useState } from "react";
import { getPhoto } from "../core/service";
import { userData } from "../core/helpers";
import type User from "../interfaces/user";
import fetchApi from "../lib/strapi";

// FALTA:
// 1. Agregar un loading
// 2. Mejorar apariencia de cards
// 3. Definir que información se colocará en las cards

const CourseCard = (course: any) => {

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

  return (
    <a
      href={`/courses/${course.slug}/`}
      aria-label={`Curso ${course.title}`}
      className={`coursecard ${style} w-full h-32 px-8 py-6 flex gap-6 justify-between items-center`}
    >
      <div className="coursecard__img w-12 h-12 min-w-[3rem] rounded-lg">
        {!course.photo.data ? (
          <div className="w-12 h-12 rounded-lg bg-black" />
        ) : (
          <img
            src={getPhoto({ course })}
            alt={course.title}
            className="w-full h-full object-cover object-center rounded-lg"
          />
        )}
      </div>
      <div className="coursecard__content w-full h-full flex flex-col justify-center items-start">
        <h3 className="coursecard__title  font-bold text-lg">
          {course.title}
        </h3>
        <p className="coursecard__text max-h-[60px]  text-base overflow-hidden">
          {course.description}
        </p>
      </div>
    </a>
  );
};

export default CourseCard;
