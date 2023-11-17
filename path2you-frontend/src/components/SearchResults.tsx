import { useEffect, useState } from "react";
import type Course from "../interfaces/course";
import fetchApi from "../lib/strapi";
import CourseCard from "./CourseCard";
import "../styles/CourseCardDefault.styles.css";
import type Module from "../interfaces/module";

const SearchResults = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [title, setTitle] = useState<string>("");
  const [cursos, setCursos] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search).get(
      "title"
    );
    fetchCourses(queryParams);
    // fetchModules(queryParams);
    setTitle(queryParams || "");
  }, []);

  const fetchCourses = async (queryParams) => {
    try {
      const courses = await fetchApi<Course[]>({
        endpoint: "courses?populate=photo",
        query: {
          "filters[$or][0][title][$containsi]": queryParams,
          "filters[$or][1][slug][$containsi]": queryParams,
        },
        wrappedByKey: "data",
      });
      setCursos(courses);

    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

//   const fetchModules = async (queryParams) => {
//     try {
//       const modules = await fetchApi<Module[]>({
//         endpoint: "modules?populate=course",
//         query: {
//           "filters[$or][0][title][$containsi]": queryParams,
//           "filters[$or][1][slug][$containsi]": queryParams,
//         },
//         wrappedByKey: "data",
//       });
//       setModules(modules);
//     } catch (error) {
//       console.log(error);
//     }
//   };

  return (
    <section className="search-results w-full">
      {loading && (
        <div className="loader">
          <div className="spinner"></div>
        </div>
      )}
      <div className={`search-results__presentation mb-12`}>
        <h1 className="search-results__title font-bold text-xl md:text-3xl inline">
          Resultados de{" "}
        </h1>
        <p className="search-results__text font-semibold text-xl md:text-3xl inline">
          {title ? title : "la búsqueda"}
        </p>
      </div>
      {cursos.length > 0 ? (
        <>
          <h3 className="search-results__course-title w-full mb-4 font-semibold text-xl">‣ Cursos:</h3>
          <div className="search-results__grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {cursos.map((course) => {
              return <CourseCard {...course.attributes} />;
            })}
          </div>
        </>
      ) : (
        <div className="search-results__failed-fetch w-full h-11 flex justify-center items-center mb-4">
          <h3>No se encontraron cursos.</h3>
        </div>
      )}
      {/* {modules.length > 0 ? (
        <>
          <h3 className="search-results__course-title w-full mb-4 font-semibold text-xl">‣ Cursos:</h3>
          <div className="search-results__grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {cursos.map((course) => {
              return <CourseCard {...course.attributes} />;
            })}
          </div>
        </>
      ) : (
        <div className="search-results__failed-fetch w-full h-11 flex justify-center items-center mb-4">
          <h3>No se encontraron cursos.</h3>
        </div>
      )} */}
    </section>
  );
};

export default SearchResults;
