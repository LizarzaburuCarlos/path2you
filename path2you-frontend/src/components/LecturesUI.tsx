import type Lecture from "../interfaces/lecture";
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

type LectureUIProps = {
    lecture: Lecture;
  };

export const LecturesUI: React.FC<LectureUIProps> = ({ lecture }) => {

    const [resolution, setResolution] = useState<boolean | null>(null);
    const [leccion, setLeccion] = useState<Lesson | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [hasProgress, setHasProgress] = useState<boolean>(false);
    const [user, setUser] = useState<User>();

    useEffect(() => {
      setLoading(true);
        const fetchLessons = async () => {
            const lectureId = lecture.id.toString();
          const lecciones = await fetchApi<Lesson[]>({
            endpoint: "lessons?populate=media",
            wrappedByKey: "data",
            query: {
              "filters[lecture][id][$eq]": lectureId || "",
            },
          });
        
          setLessons(lecciones);
          setLoading(false);
      };
      setLeccion(null);
      fetchLessons();
   
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
            endpoint: `registers?filters[user][id][$eq]=${user.id}&filters[lecture][id][$eq]=${lecture.id}`,
            method: "GET",
            wrappedByKey: "data",
          });

          const finishedLessonsResponse = await fetchApi<Progress[]>({
            endpoint: `progresses?filters[user][id][$eq]=${user.id}&filters[lesson][lecture][id][$eq]=${lecture.id}&filters[finished][$eq]=${true}`,
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
            
         
            const registerUpdated = { id: existingProgress.id, attributes: 
              {...existingProgress.attributes, 
                status: updatedStatus, user:user.id, lecture:lecture.id, finished: updatedStatus === 100 ? true : false }};
            const data = { data: registerUpdated }
           
              console.log(Number(updatedStatus));
              
              
            const res = await fetchApi({
              endpoint: "registers/"+existingProgress.id,
              method: "PUT",
              body: {
               data:{
                status: Math.floor(updatedStatus),
                user: user.id,
                lecture: lecture.id,
                finished: updatedStatus === 100 ? true : false,
               }
              }
              ,
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
                   data:{
                    status: Math.floor(status),
                    user: user.id,
                    lecture: lecture.id,
                    finished: terminado,
                   }
                  }
                  ,
                });
                console.log('====================================');
                console.log(res);
                console.log('====================================');
           
          }

        } catch (error) {
          console.log("error", error);
        }
      }

    if (resolution === true)
        return (
        <LessonViewer user={user} setHasProgress={setHasProgress} setResolution={setResolution} setLeccion={setLeccion} leccion={leccion} />
    )

    return (
        <section className="lecture w-full">
          {loading && (
            <div className="loader">
              <div className="spinner"></div>
            </div>
          )}
            <div className="lecture__info mb-5">
                <h4 className="lecture__title font-semibold text-2xl mb-2">{lecture.attributes.title}</h4>
                <Markdown remarkPlugins={[remarkGfm]} className="lecture__description ml-4">
                  {lecture.attributes.description}</Markdown>
            </div>

            <div className="lecture__lessons">
                <h4 className="lecture__title font-semibold text-2xl mb-4">Temario</h4>
                {lessons.length > 0 ? (
                    <div className="lecture__lessons__container grid grid-cols-1 gap-6">
                        {lessons.map((lesson) => (
                            <div className="lesson__card">
                                <div className="lesson__card__info">
                                    <LessonCard setResolution={setResolution} setLeccion={setLeccion} lesson={lesson} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="lecture__lessons__empty w-fullt text-center">
                        <p className="text-lg font-semibold opacity-50 ">
                            Aún no hay clases disponibles para esta lección. <br />
                            ¡Vuelve pronto!
                        </p>
                    </div>
                )}
            </div>
        </section>
        
    );
};