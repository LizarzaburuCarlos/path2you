import { useEffect, useState } from "react";
import type Course from "../interfaces/course";
import fetchApi from "../lib/strapi";
import CourseCard from "./CourseCard";
import "../styles/CourseCardDefault.styles.css";

export const CoursesUI = () => {
  const [cursos, setCursos] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const userString = localStorage.getItem("user");
  
    if (userString) {
      const user = JSON.parse(userString);
      fetchCourses(user);
    } else {
      console.error("No se encontró usuario.");
    }    
  }, []);

  const fetchCourses = async (user) => {
    const courses = await fetchApi<Course[]>({
      headers:{
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.jwt}`,
      },
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

      <div className={`courselist__presentation mb-12`}>
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
