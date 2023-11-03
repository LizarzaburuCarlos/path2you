import ReactMarkdown from "react-markdown";
import type Lecture from "../interfaces/lecture";
import remarkGfm from "remark-gfm";
import { useEffect, useState } from "react";
import type Lesson from "../interfaces/lesson";
import fetchApi from "../lib/strapi";
import LessonCard from "./LessonCard";
import { LessonViewer } from "./LessonViewer";

type LectureUIProps = {
    lecture: Lecture;
    url: URL;
    pene: string;
  };

export const LecturesUI: React.FC<LectureUIProps> = ({ lecture, url, pene }) => {

    const [resolution, setResolution] = useState<boolean | null>(null);
    const [leccion, setLeccion] = useState<Lesson | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [lessons, setLessons] = useState<Lesson[]>([]);


    useEffect(() => {
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
      };
      setLeccion(null);
      fetchLessons();
  
      }, []);

    if (resolution === true)
        return (
        <LessonViewer setResolution={setResolution} setLeccion={setLeccion} leccion={leccion} />
    );

    return (
        <section className="lecture w-full">
            <div className="lecture__info mb-5">
                <h4 className="lecture__title font-semibold text-2xl mb-2">{lecture.attributes.title}</h4>
                <ReactMarkdown remarkPlugins={[remarkGfm]} className="lecture__description ml-4">{lecture.attributes.description}</ReactMarkdown>
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