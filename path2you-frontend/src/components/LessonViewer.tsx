import { useEffect, useState } from "react";
import fetchApi from "../lib/strapi";
import type User from "../interfaces/user";
import { userData } from "../core/helpers";
import type Progress from "../interfaces/progress";

export const LessonViewer = ({leccion, setResolution, setLeccion, setHasProgress, user}) => {

    const [isNew, setIsNew] = useState<boolean|null>(null);

    useEffect(() => {
        const checkIsNew = async () => {
            const usuario = user!;
            const query = `filters[user][id][$eq]=${usuario.id}&filters[lesson][id][$eq]=${leccion.id}`
            const progressData = await fetchApi<Progress[]>({
              endpoint: "progresses?"+query,
              wrappedByKey: "data",
             
            });
            if (progressData.length > 0) {
                setIsNew(false);
                
            } else {
                setIsNew(true);
                await handleProgress(usuario);
            }
            
        };
      
        checkIsNew();
      

    }, [user]);

    async function handleProgress(user) {
        try {
          const res = await fetchApi({
            endpoint: "progresses",
            method: "POST",
            body: {
              data: {
                user: user.id,
                lesson: leccion.id,
                finished: true,
              },
            },
          });
          setHasProgress(true);
          
        } catch (error) {
          console.log("error", error);
        }
      }

    return (

        <div className="lesson__viewer">
            <div className="lesson__return mb-3 w-fit">
                <button className="h-fit py-1 px-2 w-full bg-red-300" onClick={() => {
                    setResolution(null)
                    setLeccion(null)
                    }}>Volver</button>
            </div>
            <div className="lesson__viewer__video">
                <video controls className="lesson__viewer__video__player">
                    <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
                    Your browser does not support HTML video.
                </video>
            </div>
            <div className="lesson__viewer__content">
                <h4 className="lesson__viewer__title font-semibold text-2xl mb-2">{leccion.attributes.title}</h4>
            </div>
        </div>
    )
}