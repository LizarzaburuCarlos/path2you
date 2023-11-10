import { useEffect, useState } from "react";
import type User from "../interfaces/user";
import fetchApi from "../lib/strapi";
import { userData } from "../core/helpers";
import type Inscription from "../interfaces/inscription";
import type Progress from "../interfaces/progress";
import type Lesson from "../interfaces/lesson";
import dayjs from 'dayjs';

export const UserUI = () => {

    const [user, setUser] = useState<User>();
    const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
    const [loading, setLoading] = useState<boolean>(true);


    useEffect(() => {
        
        const userDataResponse = async () => {
            const userDataResponse = await userData();
            fetchUser(userDataResponse.id);
            fetchInscriptions(userDataResponse.id)
            setLoading(false);
        };
        userDataResponse();
       
    }, []);

    const fetchUser = async (id) => {
        const user = await fetchApi<User>({
            endpoint: "users/" + id.toString(),
            method: "GET",
        });
        setUser(user);
        console.log();
    };

    const fetchInscriptions = async (id) => {
        const inscriptions = await fetchApi<Inscription[]>({
            endpoint: "inscriptions?populate=*",
            wrappedByKey: "data",
            query: {
                "filters[user][id][$eq]": id.toString() || "",
            },
            method: "GET",
        });
        setInscriptions(inscriptions);
    };

    const fechaFormateada = (fecha) => {
        let formateada = dayjs(fecha).format("DD/MM/YYYY");
        console.log(formateada);
        return formateada;
    };

    // const calculateProgress = async (idCourse) => {

    //     const totalLessons = await fetchApi<Lesson[]>({
    //         endpoint: "lessons",
    //         wrappedByKey: "data",
    //         query: {
    //             "filters[module][course][id][$eq]": idCourse.toString() || "",
    //         },
    //         method: "GET",
    //     })

    //     const progressCount = await fetchApi<Progress[]>({
    //         endpoint: `progresses?populate=*`,
    //         wrappedByKey: "data",
    //         query: {
    //             "filters[user][id][$eq]": user?.id.toString() || "",
    //             "filters[lesson][module][course][id][$eq]": idCourse.toString() || "",
    //         },
    //         method: "GET",
    //     });
      
        
    //     let total = totalLessons.length;
    //     let count = 0;
    //     progressCount.forEach((progress) => {
    //         if (progress.attributes.finished) {
    //             count++;
    //         }
    //     });
    //     setProgress({ idCourse: {
    //         total: total,
    //         count: count
    //     }});
      
        
    //     console.log("total", total, "count", count);
        
    // };

    // useEffect(() => {
    //     // Llama a la función de progreso aquí para cada curso
    //     inscriptions.forEach((inscription) => {
    //       let curso = inscription.attributes.course.data.id;
    //       calculateProgress(curso);
    //     });
  
    //   }, [inscriptions]);

    

    return (
        <>

        {loading && (
                <div className="loader">
                <div className="spinner"></div>
                </div>
            )}

        <div className="profile__container mx-auto mt-8">
    
        <div className="text-center">
            <h1 className="profile__title text-3xl font-bold">Perfil de Usuario</h1>
        </div>

        <div className="profile__info mt-8 flex flex-col md:flex-row gap-2 md:gap-8 px-10 mx-auto w-fit p-8 rounded-lg">
            <div className="flex items-center p-4 justify-center">
                <img src="/usericon.png" alt="Foto de perfil" className="w-28 h-28 rounded-full" />
            </div>
            <div className="flex flex-col gap-[1px] md:mt-4 text-center">
                <h2 className="text-xl font-semibold ">{user?.name}</h2>
                <p className="">@{user?.username}</p>
                <p className=" italic">{user?.email}</p>
                <p className=" text-xs mt-3">Estás aquí desde {fechaFormateada(user?.createdAt)}</p>
            </div>
        </div>

        <div className="mt-8">
            <h2 className="profile__title text-2xl font-bold">Cursos</h2>
            <p className="">Estos son los cursos que has tomado.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6">            
            {inscriptions.map((inscription) => {
                let curso = inscription.attributes.course.data;
                return (
                <a href={`/courses/${curso.attributes.slug}`} className="mt-4 profile__course--card--link">
                    <div  className="mt-4 profile__course--card w-full lg:w-full p-6 rounded-md mb-4">
                        <h3 className="text-lg font-semibold ">{inscription.attributes.course.data.attributes.title}</h3>
                        <div className="text-base">
                            <p>Fecha de inicio: {fechaFormateada(inscription.attributes.date)}</p>
                            <p>Estado: {inscription.attributes.finished ? "Finalizado" : "En curso"}</p>
                        </div>
                    </div>
                </a>)})}
            </div>
        </div>
    </div>
    </>
    );
       


};