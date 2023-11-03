
import React, { useEffect, useRef, useState } from "react";
import type Lesson from "../interfaces/lesson";
import type User from "../interfaces/user";
import { userData } from "../core/helpers";
import { getUsuario } from "../core/service";
import "../styles/LectureCardDefault.styles.css";
type LessonCardProps = {
    lesson: Lesson;
  };
  

const LessonCard : React.FC<LessonCardProps> = ({ lesson }) => {
    const [resolution, setResolution] = useState<boolean | null>(null);
    const circleRef = useRef(null);
    const prevUsuarioRef = useRef<User | null>(null);
    const [valueProgress, setValueProgress] = useState(60);
    const [usuario, setUsuario] = useState<User>();
    const [hasMedia, setHasMedia] = useState<boolean>(false);
  
    let mediaData: any = {};
  
    
  
    useEffect(() => {
      const fetchData = async () => {
        const { id } = userData();
        const fetchedUsuario = await getUsuario(id);
        setUsuario(fetchedUsuario);
      };

      if (lesson.attributes.media.data) {
        setHasMedia(true);
      }
    
      fetchData();
      
    
    }, [usuario]);
  
    useEffect(() => {
      prevUsuarioRef.current = usuario!;
    
    }, [usuario]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    useEffect(() => {
      const circle = circleRef.current as unknown as HTMLElement;
      const prevUsuario = prevUsuarioRef.current;
  
      const fetchProgress = () => {
        let progressStartValue = 0;
        let progressEndValue = valueProgress || 0;
        let speed = 20;
        let user = usuario!;
        if (circle && usuario) { 
      
          if (prevUsuario !== usuario) {
            if (timerRef.current) {
              clearInterval(timerRef.current); 
            }
            
            timerRef.current = setInterval(() => {
            progressStartValue++;
            
            if (user.darkmode === true) {
              circle.style.background = `conic-gradient(#766f87 ${progressStartValue * 3.6}deg, #37343e 0deg)`
            }
            if (user.neumorphismmode === true) {
              circle.style.background = `conic-gradient(#7342b0 ${progressStartValue * 3.6}deg, #9c7ed8 0deg)`
            }
            if (user.neumorphismmode === false && user.darkmode === false) {
              circle.style.background = `conic-gradient(#7342b0 ${progressStartValue * 3.6}deg, #1b1d21 0deg)`
            }
            if (progressStartValue === progressEndValue) {
              clearInterval(timerRef.current!);
            }
          }, speed);
        } else {
          if (user.darkmode === true) {
            circle.style.background = `conic-gradient(#766f87 ${valueProgress * 3.6}deg, #37343e 0deg)`
          }
          if (user.neumorphismmode === true) {
            circle.style.background = `conic-gradient(#7342b0 ${valueProgress * 3.6}deg, #9c7ed8 0deg)`
          }
          if (user.neumorphismmode === false && user.darkmode === false) {
            circle.style.background = `conic-gradient(#7342b0 ${valueProgress * 3.6}deg, #1b1d21 0deg)`
          }
        }
        }
       
      };
      fetchProgress();
    }, [usuario, valueProgress]);
    
    const handleLecture = () => {
      if (resolution === null) {
        setResolution(true);
      } else {
        setResolution(!resolution);
      }
    }
  
    const getFileIcon = (fileName: string) => {
      const extension = fileName.split(".").pop()?.toLowerCase();
      switch (extension) {
        case "pdf":
          return <i className="fa-regular fa-file-pdf mx-auto text-lg"></i>;
        case "png":
        case "jpg":
        case "jpeg":
        case "gif":
        case "webp":
          return <i className="fa-regular fa-file-image mx-auto text-lg"></i>;
        case "mp4":
          return <i className="fa-regular fa-file-video mx-auto text-lg"></i>;
        default:
          return null;
      }
    };
  
  
    return (
        <button className={`lecturecard w-full md:w-[70%] mx-4 h-24 px-6 py-6 flex gap-6 items-center`}>
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