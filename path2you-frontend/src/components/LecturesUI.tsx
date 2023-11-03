import ReactMarkdown from "react-markdown";
import type Lecture from "../interfaces/lecture";
import remarkGfm from "remark-gfm";
import { useEffect, useState } from "react";
import type Lesson from "../interfaces/lesson";
import fetchApi from "../lib/strapi";
import LessonCard from "./LessonCard";

type LectureUIProps = {
    lecture: Lecture;
  };

export const LecturesUI: React.FC<LectureUIProps> = ({ lecture }) => {

    const [loading, setLoading] = useState<boolean>(true);
    const [lessons, setLessons] = useState<Lesson[]>([]);


    useEffect(() => {
        const fetchLectures = async () => {
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
    
      fetchLectures();
    
      }, [lecture.id]);

      

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
                                    <LessonCard lesson={lesson} />
                                </div>
                                {/* <div className="lesson__card__media">
                                    <img className="lesson__card__img" src={lesson.attributes.media.data.attributes.url} alt={lesson.attributes.media.data.attributes.name} />
                                </div> */}
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