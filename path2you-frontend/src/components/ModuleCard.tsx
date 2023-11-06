import { useEffect, useRef, useState, type ReactNode } from "react";
import { STRAPI_URL } from "../core/constants";

import type Module from "../interfaces/module";

import "../styles/ModuleCardDefault.styles.css";
import type User from "../interfaces/user";
import { userData } from "../core/helpers";
import { getUsuario } from "../core/service";
import { ModulesUI } from "./ModulesUI";
import type Register from "../interfaces/register";
import fetchApi from "../lib/strapi";

type ModuleCardProps = {
  slug: string;
  module: Module;
};

//!PROBLEMAS:
// 1. El estilo del círculo de progreso no se actualiza cuando se cambia de estilo
// 2. El usuario en el useEffect genera un bucle infinito de getUsuario()

const ModuleCard: React.FC<ModuleCardProps> = ({ slug, module }) => {
  const [resolution, setResolution] = useState<boolean | null>(null);
  const circleRef = useRef(null);
  const prevUsuarioRef = useRef<User | null>(null);
  const [valueProgress, setValueProgress] = useState(0);
  const [usuario, setUsuario] = useState<User>();

  async function getProgress(id) {
    const existingRecordResponse = await fetchApi<Register[]>({
      endpoint: `registers?filters[user][id][$eq]=${id}&filters[module][id][$eq]=${module.id}`,
      method: "GET",
      wrappedByKey: "data",
    });

    if (existingRecordResponse.length > 0) {
      const progress = existingRecordResponse[0].attributes.status;
      setValueProgress(progress);
      console.log(progress);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const { id } = userData();
      const fetchedUsuario = await getUsuario(id);

      setUsuario(fetchedUsuario);
      getProgress(id);
    };

    fetchData();

    prevUsuarioRef.current = usuario!;
  }, []);

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
              circle.style.background = `conic-gradient(#766f87 ${
                progressStartValue * 3.6
              }deg, #37343e 0deg)`;
            }
            if (user.neumorphismmode === true) {
              circle.style.background = `conic-gradient(#7342b0 ${
                progressStartValue * 3.6
              }deg, #9c7ed8 0deg)`;
            }
            if (user.neumorphismmode === false && user.darkmode === false) {
              circle.style.background = `conic-gradient(#7342b0 ${
                progressStartValue * 3.6
              }deg, #1b1d21 0deg)`;
            }
            if (progressStartValue === progressEndValue) {
              clearInterval(timerRef.current!);
            }
          }, speed);
        } else {
          if (user.darkmode === true) {
            circle.style.background = `conic-gradient(#766f87 ${
              valueProgress * 3.6
            }deg, #37343e 0deg)`;
          }
          if (user.neumorphismmode === true) {
            circle.style.background = `conic-gradient(#7342b0 ${
              valueProgress * 3.6
            }deg, #9c7ed8 0deg)`;
          }
          if (user.neumorphismmode === false && user.darkmode === false) {
            circle.style.background = `conic-gradient(#7342b0 ${
              valueProgress * 3.6
            }deg, #1b1d21 0deg)`;
          }
        }
      }
    };
    fetchProgress();
  }, [valueProgress]);

  // const getFileIcon = (fileName: string) => {
  //   const extension = fileName.split(".").pop()?.toLowerCase();
  //   switch (extension) {
  //     case "pdf":
  //       return <i className="fa-regular fa-file-pdf mx-auto text-lg"></i>;
  //     case "png":
  //     case "jpg":
  //     case "jpeg":
  //     case "gif":
  //     case "webp":
  //       return <i className="fa-regular fa-file-image mx-auto text-lg"></i>;
  //     case "mp4":
  //       return <i className="fa-regular fa-file-video mx-auto text-lg"></i>;
  //     default:
  //       return null;
  //   }
  // };

  return (
    <a
      href={`modules/${module.attributes.slug}`}
      className={`modulecard w-full h-36 px-8 py-6 flex gap-6 items-center`}
    >
      {valueProgress === 0 && (
        <div
          className={`modulecard__img flex items-center justify-center w-[75px] h-[75px] rounded-full`}
        >
          <div className="w-[75px] h-[75px] rounded-full" />
        </div>
      )}

      {valueProgress > 0 && (
        <div className={`skill w-20 h-20 relative`}>
          <div
            id="circle"
            className="circle w-20 h-20 flex items-center justify-center rounded-full"
            ref={circleRef}
          >
            <span className="font-semibold relative" id="number">
              {valueProgress}%
            </span>
          </div>
        </div>
      )}

      <div
        className={`modulecard__content w-full h-full flex flex-col justify-center items-start`}
      >
        <div className="modulecard__presentation">
          <h3 className="modulecard__title font-bold text-lg">
            {module.attributes.title}
          </h3>
        </div>
        {/* <div className={`modulecard__media mt-4 w-full gap-6 flex justify-start items-center`}>
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

export default ModuleCard;
