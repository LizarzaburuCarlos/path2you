import { useEffect, useState } from "react";
import type Course from "../interfaces/course";
import { userData } from "../core/helpers";
import fetchApi from "../lib/strapi";
import type Inscription from "../interfaces/inscription";
import type User from "../interfaces/user";

//FALTA:
// 1. Poner un loading de carga para los cursos
// 2. Poner un mensaje de toast ante un error

const InscribedList = () => {
  const [inscribedCourses, setInscribedCourses] = useState<Inscription[]>([]);
  const [user, setUser] = useState({ id: null });
  const [style, setStyle] = useState<string>("");

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
      fetchUserData(user.id);
      setInscribedCourses(inscribedCoursesData);
    } catch (error) {
      console.log("error", error);
    }
  }

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

  const InscribedCourse = (inscription: Inscription) => {
    const course = inscription.attributes.course.data.attributes;
    const inscriptionData = inscription.attributes;
    return (
      <a href={`/courses/${course.slug}`} className={`inscribedcourse ${style} w-full h-20 py-4 rounded-lg flex items-center gap-6`}>
        <div className="inscribedcourse__presentation w-6/12 pl-6 flex items-center gap-6">
          <div className="img h-12 w-12 rounded-lg "></div>
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
            <div className={`inscribedlist__header ${style} flex items-center gap-6 mb-6`}>
              <h3 className="w-6/12 font-semibold ">
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
