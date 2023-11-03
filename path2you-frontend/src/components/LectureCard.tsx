import { useEffect, useRef, useState, type ReactNode } from "react";
import { STRAPI_URL } from "../core/constants";

import type Lecture from "../interfaces/lecture";

import "../styles/LectureCardDefault.styles.css";
import type User from "../interfaces/user";
import { userData } from "../core/helpers";
import { getUsuario } from "../core/service";
import { LecturesUI } from "./LecturesUI";
import type Register from "../interfaces/register";
import fetchApi from "../lib/strapi";

type LectureCardProps = {
  slug: string;
  lecture: Lecture;
};

const LectureCard : React.FC<LectureCardProps> = ({ slug, lecture }) => {
  const [resolution, setResolution] = useState<boolean | null>(null);
  const circleRef = useRef(null);
  const prevUsuarioRef = useRef<User | null>(null);
  const [valueProgress, setValueProgress] = useState(0);
  const [usuario, setUsuario] = useState<User>();

  useEffect(() => {
    const fetchData = async () => {
      const { id } = userData();
      const fetchedUsuario = await getUsuario(id);
      setUsuario(fetchedUsuario);
      getProgress(id);
    };
  
    fetchData();
  
  }, []);

  async function getProgress(id) {
    const existingRecordResponse = await fetchApi<Register[]>({
      endpoint: `registers?filters[user][id][$eq]=${id}&filters[lecture][id][$eq]=${lecture.id}`,
      method: "GET",
      wrappedByKey: "data",
    });

    if (existingRecordResponse.length > 0) {
      const progress = existingRecordResponse[0].attributes.status;
      setValueProgress(progress);
    }
  }

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

  const handleDownload = (mediaItem: any) => {
    
    const fileName = mediaItem.attributes.url;
    const fileUrl = `${STRAPI_URL}${fileName}`;

    const anchor = document.createElement("a");
    anchor.href = fileUrl;
    anchor.download = fileName;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.click();

    return undefined;
  };


  return (
    <a href={`${slug}/lectures/${lecture.attributes.slug}`} className={`lecturecard w-full h-44 px-8 py-6 flex gap-6 items-center`}>
      {/* <div className={`lecturecard__img w-16 h-16 rounded-full`}>
        <div className="w-20 h-20 rounded-full" />
      </div> */}
      <div className={`skill w-20 h-20 relative`}>
        <div id="circle" className="circle w-20 h-20 flex items-center justify-center rounded-full" ref={circleRef} > 
          <span className="font-semibold relative" id="number">{valueProgress}%</span>
        </div>
      </div>

      <div className={`lecturecard__content w-full h-full flex flex-col justify-center items-start`}>
        <div className="lecturecard__presentation">
          <h3 className="lecturecard__title font-bold text-lg">
            {lecture.attributes.title}
          </h3>
        </div>
        {/* <div className={`lecturecard__media mt-4 w-full gap-6 flex justify-start items-center`}>
         {mediaData.length > 0 &&
            mediaData.map((mediaItem) => (
              <button className="h-10 w-10 cursor-pointer" onClick={() => handleDownload(mediaItem)}>
                {getFileIcon(mediaItem.attributes.name)}
              </button>
            ))} 
        </div> */}
      </div>
    </a>
  );
};

export default LectureCard;
