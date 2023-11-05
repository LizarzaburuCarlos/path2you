
import React, { useEffect, useRef, useState } from "react";
import type Lesson from "../interfaces/lesson";
import type User from "../interfaces/user";
import { userData } from "../core/helpers";
import { getUsuario } from "../core/service";
import "../styles/ModuleCardDefault.styles.css";
import fetchApi from "../lib/strapi";
import type Progress from "../interfaces/progress";

const LessonCard = ({ lesson, setResolution, setLeccion }) => {

    const [hasMedia, setHasMedia] = useState<boolean>(false);
    const [isFinished, setIsFinished] = useState<boolean>(false);
  
    useEffect(() => {

      if (lesson.attributes.media.data) {
        setHasMedia(true);
      }

      const checkProgress = async () => {
        const usuario = await userData();
        const query = `filters[user][id][$eq]=${usuario.id}&filters[lesson][id][$eq]=${lesson.id}`
        const progressData = await fetchApi<Progress>({
        endpoint: "progresses?"+query,
        wrappedByKey: "data",
      });
      
        if (progressData[0].attributes.finished === true) {
          setIsFinished(true);
        }
    };

    checkProgress();
      
      
    }, []);
      
    const handleLesson = () => {
      setResolution(true);
      setLeccion(lesson);
    }
  
    return (
        <button onClick={handleLesson} className={`modulecard w-full md:w-[70%] mx-4 h-24 px-6 py-6 flex gap-6 items-center`}>
            <div className={`modulecard__media w-[15%] lg:w-[10%] flex justify-start items-center`}>
                {hasMedia === true && (
                    <div className="h-10 w-10 md:h-14 md:w-14 flex justify-center items-center">
                        <i className="fa-solid fa-video mx-auto text-lg md:text-xl"></i>
                    </div>
                )}
                {hasMedia === false && (
                    <div className="h-10 w-10 md:h-14 md:w-14 flex justify-center items-center">
                        <i className="fa-solid fa-book mx-auto text-lg md:text-xl"></i>
                    </div>
                )}
            </div>
    
            <div className={`modulecard__content w-full md:w-[80%] h-full flex flex-col justify-center items-start`}>
                <div className="modulecard__presentation">
                    <h3 className="modulecard__title font-semibold text-base md:text-lg">
                        {lesson.attributes.title}
                    </h3>
                </div>
            </div>
            <div className={`modulecard__status w-[15%] lg:w-[10%] flex justify-end items-center`}>
                {isFinished === true && (
                    <div className="h-10 w-10 md:h-14 md:w-14 flex justify-center items-center">
                        <i className="fa-solid fa-check mx-auto text-lg md:text-xl"></i>
                    </div>
                )}
                {isFinished === false && (
                    <div className="h-10 w-10 md:h-14 md:w-14 flex justify-center items-center">
                        <i className="fa-solid fa-circle mx-auto text-lg md:text-xl"></i>
                    </div>
                )}
            </div>
      </button>
    );
  };
  
  export default LessonCard;