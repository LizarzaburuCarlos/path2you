import { useEffect, useState } from "react";
import type Course from "../interfaces/course";
import { userData, formatDate } from "../core/helpers";
import fetchApi from "../lib/strapi";
import type Inscription from "../interfaces/inscription";
import dayjs from "dayjs";

//FALTA:
// 2. Poner un mensaje de toast ante un error

const InscribedList = () => {
  const [inscribedCourses, setInscribedCourses] = useState<Inscription[]>([]);
  const [user, setUser] = useState({ id: null });

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const userDataResponse = await userData();
      setUser(userDataResponse);

      await fetchInscriptions(userDataResponse);
      setLoading(false);
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

  const fechaFormateada = (fecha) => {
    let formateada = dayjs(fecha).format("DD/MM/YYYY");
    console.log(formateada);
    return formateada;
};

  const InscribedCourse = (inscription: Inscription) => {
    const course = inscription.attributes.course.data.attributes;
    const inscriptionData = inscription.attributes;
    return (
      <a
        href={`/courses/${course.slug}`}
        className={`inscribedcourse w-full h-20 py-4 rounded-lg flex items-center gap-6`}
      >
        <div className="inscribedcourse__presentation w-full sm:w-5/12 pl-6 flex items-center gap-6">
          <div className="img h-11 w-11 rounded-lg flex-none"></div>
          <h4>{course.title}</h4>
        </div>
        <p className="inscribedcourse__date w-3/12 max-sm:hidden">
          {fechaFormateada(inscriptionData.date)}
        </p>
        <p className="inscribedcourse__date w-4/12 pr-6 max-sm:hidden">
        {inscriptionData.finished ? "Finalizado" : "En curso"}
        </p>
      </a>
    );
  };

  return (
    <section className="inscribedlist w-full">
      {loading && (
        <div className="loader">
          <div className="spinner"></div>
        </div>
      )}

      <div className="inscribedlist__container">
        {inscribedCourses.length > 0 ? (
          <>
            <div
              className={`inscribedlist__header flex items-center gap-6 mb-6`}
            >
              <h3 className="w-full sm:w-5/12 font-semibold ">Cursos del usuario:</h3>
              <h3 className="w-3/12 max-sm:hidden">Fecha de inicio:</h3>
              <h3 className="w-4/12 max-sm:hidden">Estado:</h3>
            </div>
            <div className="inscribedlist__content flex flex-col gap-4">
              {inscribedCourses.map((inscription) => (
                <InscribedCourse {...inscription} />
              ))}
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
