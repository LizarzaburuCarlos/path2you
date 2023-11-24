import { useEffect, useState } from "react";
import type Course from "../interfaces/course";
import { getPhoto } from "../core/service";
import { userData } from "../core/helpers";
import fetchApi from "../lib/strapi";
import ModuleList from "./ModuleList";
import type User from "../interfaces/user";
import "../styles/CoursePresentation.styles.css";
import type Exam from "../interfaces/exam";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type Inscription from "../interfaces/inscription";

//FALTA:
// 2. Reorganizar el código para que sea más legible
// 3. Revisar el manejo de errores

const CoursePresentation = (course: Course) => {
  const courseId = course.id.toString();
  const [inscription, setInscription] = useState(false);
  const [inscriptionData, setInscriptionData] = useState<Inscription>();
  const [user, setUser] = useState({ id: null });
 
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const userDataResponse = await userData();
      setUser(userDataResponse);

      await fetchInscription(userDataResponse);
      fetchUserData(userDataResponse.id);
      setLoading(false);
    };

    fetchData();
  }, []);

  async function fetchUserData(user) {
    try {
      const userDataApi = await fetchApi<User>({
        endpoint: "users/" + user,
      });
      // console.log(userDataApi);
    } catch (error) {
      console.log("error", error);
    }
  }

  async function fetchInscription(user) {
    try {
      const res: any = await fetchApi({
        endpoint: "inscriptions",
        method: "GET",
        query: {
          "filters[user][id][$eq]": user.id,
          "filters[course][id][$eq]": course.id.toString(),
        },
      });

      if (res.data[0]) {
        setInscription(true);
        setInscriptionData(res.data[0]);
      } else {
        console.log("no inscrito");
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  async function handleInscription() {
    setLoading(true);
    try {
      const res = await fetchApi({
        endpoint: "inscriptions",
        method: "POST",
        body: {
          data: {
            user: user.id,
            course: course.id,
            date: new Date(),
            finished: false,
          },
        },
      });
      setInscription(true);
      
    } catch (error) {
      console.log("error", error);
    }
    setLoading(false);
  }

  return (
    <section className="course w-full">
      {loading && (
        <div className="loader">
          <div className="spinner"></div>
        </div>
      )}

      <div className="course__container grid gap-6 md:grid-cols-2 mb-6">
        <div className={`course__presentation relative`}>
        {inscription ? (
              <>
              {inscriptionData?.attributes.finished === false && (
                <div className="unfinished__course mt-2 inline-block rounded-full px-3 py-1 text-sm font-semibold mb-4 mr-2">
                  En Curso</div>
              )}

              {inscriptionData?.attributes.finished && (
                <>
                <div className="finished__course inline-block rounded-full px-3 py-1 text-sm mb-4 font-semibold mr-2">
                  Finalizado</div>
                </>
              )}
              </>
            ) : (
              <></>
            )}
          <h3 className="course__title font-bold text-3xl lg:text-5xl lg:leading-[50px] mb-6">
            {course.attributes.title}
          </h3>
          <div className="course__description font-medium text-base md:text-lg text-justify">
            <Markdown remarkPlugins={[remarkGfm]} >{course.attributes.description}</Markdown>
          </div>
          {inscription ? (
              <></>
            ) : (
              <div className="course__inscription w-36 mt-8 md:absolute">
                <button
                  className={`button-primary w-full`}
                  onClick={() => handleInscription()}
                >
                  Inscribirse
                </button>
              </div>
            )}
          
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
        <ModuleList {...course} />
      ) : (
        <div className={`course__empty w-full text-center mt-20`}>
          <p className="text-base md:text-lg font-semibold opacity-80 ">
            No estás inscrito en este curso. <br />
            ¡Inscríbete!
          </p>
        </div>
      )}
    </section>
  );
};

export default CoursePresentation;
