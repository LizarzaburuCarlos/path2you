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
          "filters[finished][$eq]": "false",
        },
      });

      setInscribedCourses(inscribedCoursesData);
    } catch (error) {
      console.log("error", error);
    }
  }

  const calcularDiferenciaEnDias = (fechaInscripcionString) => {
    const fechita = fechaFormateada(fechaInscripcionString);
    const [dia, mes, año] = fechita.split('/');
  
    const fechaInscripcionDate = new Date(`${año}-${mes}-${dia}`);
  
    const fechaActual = new Date();
  
    const diferenciaEnMilisegundos = fechaActual.getTime() - fechaInscripcionDate.getTime();
    
    const resultado = Math.floor(diferenciaEnMilisegundos / (1000 * 60 * 60 * 24));

    if (resultado === 0) {return "hoy"} else if (resultado === 1) {return "ayer"} else {return `hace ${resultado} días`};
  };

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
        className={`inscribedcourse transform transition-all duration-300 hover:scale-[1.02] w-fit h-fit px-6 py-4 rounded-lg flex flex-col justify-center gap-1`}
      >
        
        <div className="inscribedcourse__presentation w-full flex items-center gap-6">
          <h4 className="md:text-lg font-semibold">{course.title}</h4>
        </div>
        <p className="inscribedcourse__date text-sm md:text-base">
          Desde {calcularDiferenciaEnDias(inscriptionData.date)}
        </p>
        <div className=" flex mt-2 w-full justify-end  text-sm font-semibold mr-2">
          <p className="unfinished__course text-sm md:text-base rounded-full px-3 py-1">En Curso</p></div>
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
              className={`inscribedlist__header mb-6`}
            >
              <h3 className="w-full text-lg font-semibold ">Continúa estudiando</h3>
            </div>
            <div className="inscribedlist__content flex gap-4">
              {inscribedCourses.map((inscription) => (
                <InscribedCourse {...inscription} />
              ))}
            </div>
          </>
        ) : (
          <div className="inscribedlist__empty w-full text-center">
            <p className="text-lg font-semibold opacity-50 ">
              No hay cursos inscritos o en progreso. <br />
              ¡Inscríbete en uno ahora!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default InscribedList;
