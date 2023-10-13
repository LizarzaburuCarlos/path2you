import { useEffect, useState } from "react";
import type Course from "../interfaces/course";
import { getPhoto } from "../core/service";
import { userData } from "../core/helpers";
import fetchApi from "../lib/strapi";
import LectureList from "./LectureList";
import type User from "../interfaces/user";
import "../styles/CoursePresentation.styles.css";

//FALTA:
// 1. Un loading para la comprobación de datos, carga de lectures e inscripción
// 2. Reorganizar el código para que sea más legible
// 3. Revisar el manejo de errores


const CoursePresentation = (course: Course) => {
  const [inscription, setInscription] = useState(false);
  const [user, setUser] = useState({ id: null });
  const [style, setStyle] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const userDataResponse = await userData();
      setUser(userDataResponse);

      await fetchInscription(userDataResponse);
      fetchUserData(userDataResponse.id);
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

  async function fetchInscription(user) {
    try {
      const res:any = await fetchApi({
        endpoint: "inscriptions",
        method: "GET",
        query: {
          "filters[user][id][$eq]": user.id,
          "filters[course][id][$eq]": course.id.toString(),
        },
      });

      if (res.data[0]) {
        setInscription(true);
      } else {
        console.log("no inscrito");
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  async function handleInscription() {
    try {
      const res = await fetchApi({
        endpoint: "inscriptions",
        method: "POST",
        body: {
          data: {
            user: user.id,
            course: course.id,
            date: new Date(),
          },
        },
      });
      setInscription(true);
    } catch (error) {
      console.log("error", error);
    }
  }

  return (
    <section className="course w-full">
      <div className="course__container grid gap-6 grid-cols-2">
        <div className={`course__presentation ${style} relative`}>
          <h3 className="course__title font-bold text-3xl lg:text-5xl mb-6">
            {course.attributes.title}
          </h3>
          <p className="course__description mb-20 font-medium text-lg">
            {course.attributes.description}
          </p>
          <div className="course__inscription w-36 bottom-0 absolute">
            {inscription ? (
              <></>
            ) : (
              <button
                className={`button-primary ${style} w-full`}
                onClick={() => handleInscription()}
              >
                Inscribirse
              </button>
            )}
          </div>
        </div>
        <div className="course__image w-full rounded-xl overflow-hidden aspect-[3/2]">
          {!course.attributes.photo.data ? (
            <img
              src="/images/course-placeholder.png"
              alt={course.attributes.title}
            />
          ) : (
            <img
              className="w-full h-full object-cover"
              src={getPhoto({ course: course.attributes })}
              alt={course.attributes.title}
            />
          )}
        </div>
      </div>
      {inscription ? (
        <LectureList {...course} />
      ) : (
        <div className={`course__empty w-full ${style} text-center mt-20`}>
          <p className="text-lg font-semibold opacity-80 ">
            No estás inscrito en este curso. <br />
            ¡Inscríbete!
          </p>
        </div>
      )}
    </section>
  );
};

export default CoursePresentation;
