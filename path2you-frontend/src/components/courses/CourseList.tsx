import { useEffect, useState } from "react";
import CourseCard from "../CourseCard";
import { getCourses } from "../../core/service";
import { toast } from "react-toastify";


// FALTA:
// 1. Agregar un loading
// 2. Mejorar apariencia de cards
// 3. Agregar redirect con el slug de los cursos
// 4. Definir que información se colocará en las cards

const CourseList = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  async function fetchData() {
    try {
      const res = await getCourses();
      if (!res.status) {
        setCourses(res);
        console.log("res", res);
        setLoading(false);
      } else {
        toast.error(res);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error as string);
      setLoading(false);
    }
  }


  useEffect(() => {
    setLoading(true);
    fetchData();
  }, []);

  return (
    <section className="courselist w-full">
      <div className="courselist__presentation mb-12">
        <h1 className="courselist__title text-customPrimary font-bold text-3xl">
          Cursos
        </h1>
        <p className="courselist__text">
          Descubre todos los cursos que ofrecemos:
        </p>
      </div>
      {courses.length > 0 ? (
        <div className="courselist__grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => {
                
                return (
                <CourseCard {...course.attributes}  />
                );
            })}
        </div>
      ) : (
        <div className="courselist__failed-fetch w-full h-11 flex justify-center items-center">
            <h3>No se encontraron resultados.</h3>
        </div>
      )
        }
    </section>
  );
};

export default CourseList;
