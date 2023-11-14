import type module from "../interfaces/module";
import remarkGfm from "remark-gfm";
import { useEffect, useState } from "react";
import type Lesson from "../interfaces/lesson";
import fetchApi from "../lib/strapi";
import LessonCard from "./LessonCard";
import { LessonViewer } from "./LessonViewer";
import type User from "../interfaces/user";
import { userData } from "../core/helpers";
import type Register from "../interfaces/register";
import type Progress from "../interfaces/progress";
import Markdown from "react-markdown";
import type Practice from "../interfaces/practice";

export const ModulesUI = ({ module }) => {
  const [resolution, setResolution] = useState<boolean | null>(null);
  const [leccion, setLeccion] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [hasProgress, setHasProgress] = useState<boolean>(false);
  const [user, setUser] = useState<User>();
  const [practice, setPractice] = useState<Practice>();

  useEffect(() => {
    setLoading(true);
    const fetchLessons = async () => {
      const moduleId = module.id.toString();
      const lecciones = await fetchApi<Lesson[]>({
        endpoint: "lessons?populate=media",
        wrappedByKey: "data",
        query: {
          "filters[module][id][$eq]": moduleId || "",
        },
      });

      setLessons(lecciones);
      setLoading(false);
    };

    const fetchPractice = async () => {
      const practiceData = await fetchApi<Practice>({
        endpoint: "practices?populate=module",
        wrappedByKey: "data",
        query: {
          "filters[module][id][$eq]": module.id.toString() || "",
        },
      });
      console.log(practiceData);
      
      setPractice(practiceData[0]);
    };

    setLeccion(null);
    fetchLessons();
    fetchPractice();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const userDataResponse = await userData();
      setUser(userDataResponse);
      handleRegister(userDataResponse);
    };
    fetchData();
  }, [lessons]);

  async function handleRegister(user) {
    try {
      // Realiza una solicitud para verificar si el usuario tiene un registro para la lección actual
      const existingRecordResponse = await fetchApi<Register[]>({
        endpoint: `registers?filters[user][id][$eq]=${user.id}&filters[module][id][$eq]=${module.id}`,
        method: "GET",
        wrappedByKey: "data",
      });

      const finishedLessonsResponse = await fetchApi<Progress[]>({
        endpoint: `progresses?filters[user][id][$eq]=${
          user.id
        }&filters[lesson][module][id][$eq]=${
          module.id
        }&filters[finished][$eq]=${true}`,
        method: "GET",
        wrappedByKey: "data",
      });

      const totalLessons = lessons.length;

      if (existingRecordResponse.length > 0) {
        if (existingRecordResponse[0].attributes.finished === true) {
          return;
        }

        const finishedLessons = finishedLessonsResponse.length;
        const existingProgress = existingRecordResponse[0];

        console.log(finishedLessons, totalLessons);

        const updatedStatus = Number((finishedLessons / totalLessons) * 100);

        const registerUpdated = {
          id: existingProgress.id,
          attributes: {
            ...existingProgress.attributes,
            status: updatedStatus,
            user: user.id,
            module: module.id,
            finished: updatedStatus === 100 ? true : false,
          },
        };
        const data = { data: registerUpdated };

        console.log(Number(updatedStatus));

        const res = await fetchApi({
          endpoint: "registers/" + existingProgress.id,
          method: "PUT",
          body: {
            data: {
              status: Math.floor(updatedStatus),
              user: user.id,
              module: module.id,
              finished: updatedStatus === 100 ? true : false,
            },
          },
        });

        console.log(res);
      } else {
        // Si el usuario no tiene un registro, crea uno nuevo con el valor status calculado

        const status = (1 / lessons.length) * 100; // Calcula el porcentaje de lecciones terminadas
        console.log(lessons.length);

        const terminado = status === 100 ? true : false;

        // Crea un nuevo registro
        const res = await fetchApi({
          endpoint: "registers",
          method: "POST",
          body: {
            data: {
              status: Math.floor(status),
              user: user.id,
              module: module.id,
              finished: terminado,
            },
          },
        });
        console.log("====================================");
        console.log(res);
        console.log("====================================");
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  if (resolution === true)
    return (
      <LessonViewer
        user={user}
        setHasProgress={setHasProgress}
        setResolution={setResolution}
        setLeccion={setLeccion}
        leccion={leccion}
      />
    );

  return (
    <section className="module w-full">
      {loading && (
        <div className="loader">
          <div className="spinner"></div>
        </div>
      )}
      <div className="module mb-5">
        <h4 className="module__title font-semibold text-2xl mb-2">
          {module.attributes.title}
        </h4>
        <Markdown
          remarkPlugins={[remarkGfm]}
          className="module__description ml-4"
        >
          {module.attributes.description}
        </Markdown>
      </div>

      <div className="module__lessons mb-6">
        <h4 className="module__title font-semibold text-2xl mb-4">Temario</h4>
        {lessons.length > 0 ? (
          <div className="module__lessons__container grid grid-cols-1 gap-6">
            {lessons.map((lesson) => (
              <div className="lesson__card">
                <div className="lesson__card__info">
                  <LessonCard
                    setResolution={setResolution}
                    setLeccion={setLeccion}
                    lesson={lesson}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="module__lessons__empty w-fullt text-center">
            <p className="text-lg font-semibold opacity-50 ">
              Aún no hay lecciones disponibles para este módulo. <br />
              ¡Vuelve pronto!
            </p>
          </div>
        )}
        </div>

        {practice !== undefined && (
          <>
           <a href={`/practices/${practice.attributes.slug}`} className={`modulecard w-full md:w-[70%] mx-4 h-24 px-6 py-6 flex gap-6 items-center`}>
              <div className={`modulecard__media w-[15%] lg:w-[10%] flex justify-start items-center`}>
                  <div className="h-10 w-10 md:h-14 md:w-14 flex justify-center items-center">
                    <i className="fa-solid fa-brain mx-auto text-lg md:text-xl"></i>
                  </div>
              </div>
      
              <div className={`modulecard__content w-full md:w-[80%] h-full flex flex-col justify-center items-start`}>
                  <div className="modulecard__presentation">
                      <h3 className="modulecard__title font-semibold text-base md:text-lg">
                          {practice.attributes.title}
                      </h3>
                  </div>
              </div>
            </a>
            </>
        ) }
      
    </section>
  );
};
