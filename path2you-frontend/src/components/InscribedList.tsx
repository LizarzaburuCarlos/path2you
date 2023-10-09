import { useEffect, useState } from "react";
import type Course from "../interfaces/course";
import { userData } from "../core/helpers";
import fetchApi from "../lib/strapi";
import type Inscription from "../interfaces/inscription";

//FALTA:
// 1. Poner un loading de carga para los cursos
// 2. Poner un mensaje de toast ante un error

const InscribedList = () => {
  const [inscribedCourses, setInscribedCourses] = useState<Inscription[]>([]);
  const [user, setUser] = useState({ id: null });

  useEffect(() => {
    const fetchData = async () => {
      const userDataResponse = await userData();
      setUser(userDataResponse);

      await fetchInscriptions(userDataResponse);
    };
    fetchData();
  }, []);

  async function fetchInscriptions(user) {
    try {
      const inscribedCoursesData = await fetchApi<Inscription[]>({
        endpoint: "inscriptions?populate=course",
        wrappedByKey: "data",
        query: {
          "filters[user][id][$eq]": user.id,
        },
      });

      setInscribedCourses(inscribedCoursesData);
    } catch (error) {
      console.log("error", error);
    }
  }

  const InscribedCourse = (inscription: Inscription) => {
    const course = inscription.attributes.course.data.attributes;
    const inscriptionData = inscription.attributes;
    return (
      <a href={`/courses/${course.slug}`} className="inscribedcourse w-full h-24 py-4 rounded-lg bg-slate-200 flex items-center gap-6">
        <div className="inscribedcourse__presentation w-6/12 pl-6 flex items-center gap-4">
          <div className="img h-12 w-12 bg-black"></div>
          <h4>{course.title}</h4>
        </div>
        <p className="inscribedcourse__date w-6/12 pr-6">{inscriptionData.date.toString()}</p>
      </a>
    );
  };

  return (
    <section className="inscribedlist w-full">
      <div className="inscribedlist__container">
        {inscribedCourses.length > 0 ? (
          <>
            <div className="inscribedlist__header flex items-center gap-6 mb-4">
              <h3 className="w-6/12 font-semibold text-customText">
                Cursos del usuario:
              </h3>
              <h3 className="w-6/12">Fecha de inicio:</h3>
            </div>
            <div className="inscribedlist__content flex flex-col gap-4">
                {inscribedCourses.map((inscription) => (
                    <InscribedCourse {...inscription} />
                ))
                }
            </div>
          </>
        ) : (
          <div className="inscribedlist__empty w-full text-center">
            <p className="text-lg font-semibold opacity-50 ">
              No hay cursos inscritos. <br />
              ¡Inscríbete ahora!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default InscribedList;
