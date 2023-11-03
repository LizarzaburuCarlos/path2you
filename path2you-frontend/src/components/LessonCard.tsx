
import React, { useEffect, useRef, useState } from "react";
import type Lesson from "../interfaces/lesson";
import type User from "../interfaces/user";
import { userData } from "../core/helpers";
import { getUsuario } from "../core/service";
import "../styles/LectureCardDefault.styles.css";

const LessonCard = ({ lesson, setResolution, setLeccion }) => {
    const [hasMedia, setHasMedia] = useState<boolean>(false);
  
    useEffect(() => {

      if (lesson.attributes.media.data) {
        setHasMedia(true);
      }
      
      
    }, []);
      
    const handleLesson = () => {
      setResolution(true);
      setLeccion(lesson);
    }
  
    return (
        <button onClick={handleLesson} className={`lecturecard w-full md:w-[70%] mx-4 h-24 px-6 py-6 flex gap-6 items-center`}>
            <div className={`lecturecard__media w-[15%] lg:w-[10%] flex justify-start items-center`}>
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
    
            <div className={`lecturecard__content w-full md:w-[80%] h-full flex flex-col justify-center items-start`}>
                <div className="lecturecard__presentation">
                    <h3 className="lecturecard__title font-semibold text-base md:text-lg">
                        {lesson.attributes.title}
                    </h3>
                </div>
            </div>
      </button>
    );
  };
  
  export default LessonCard;