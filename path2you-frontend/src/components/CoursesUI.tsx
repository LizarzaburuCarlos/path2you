import { useEffect, useState } from "react";
import type Course from "../interfaces/course";
import fetchApi from "../lib/strapi";
import { userData } from "../core/helpers";
import CourseCard from "./CourseCard";
import type User from "../interfaces/user";
import "../styles/CourseCardDefault.styles.css";

export const CoursesUI = () => {
  const [cursos, setCursos] = useState<Course[]>([]);
  const [style, setStyle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const userDataResponse = await userData();
      // console.log(userDataResponse);
      await fetchUserData(userDataResponse.id);
    };

    fetchData();
    fetchCourses();
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

  const fetchCourses = async () => {
    const courses = await fetchApi<Course[]>({
      endpoint: "courses?populate=photo",
      wrappedByKey: "data",
    });
    setCursos(courses);
    setLoading(false);
  };

  return (
    <section className="courselist w-full">
      {loading && (
        <div className="loader">
          <div className="spinner"></div>
        </div>
      )}

      <div className={`courselist__presentation ${style} mb-12`}>
        <h1 className="courselist__title mb-2 font-bold text-3xl">Cursos</h1>
        <p className="courselist__text">
          Descubre todos los cursos que ofrecemos:
        </p>
      </div>
      {cursos ? (
        <div className="courselist__grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cursos.map((course) => {
            return <CourseCard {...course.attributes} />;
          })}
        </div>
      ) : (
        <div className="courselist__failed-fetch w-full h-11 flex justify-center items-center">
          <h3>No se encontraron resultados.</h3>
        </div>
      )}
    </section>
  );
};
