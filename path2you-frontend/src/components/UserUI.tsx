import { useEffect, useState } from "react";
import type User from "../interfaces/user";
import fetchApi from "../lib/strapi";
import { userData } from "../core/helpers";
import type Inscription from "../interfaces/inscription";
import type Progress from "../interfaces/progress";
import type Lesson from "../interfaces/lesson";

export const UserUI = () => {

    const [user, setUser] = useState<User>();
    const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
    const [progreso, setProgreso] = useState<number>(0);
    const [progress, setProgress] = useState({});


    useEffect(() => {
        const userDataResponse = async () => {
            const userDataResponse = await userData();
            fetchUser(userDataResponse.id);
            fetchInscriptions(userDataResponse.id)
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
        <div className="container mx-auto mt-8">
    
        <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">Perfil de Usuario</h1>
            <p className="text-gray-600">¡Es un gusto tenerte aquí, {user?.name}!</p>
        </div>

        <div className="mt-8 px-8 mx-auto w-fit bg-white p-8 rounded-lg shadow-md">
            <div className="flex items-center justify-center">
                <img src="public/icono.png" alt="Foto de perfil" className="w-20 h-20 rounded-full" />
            </div>
            <div className="mt-4 text-center">
                <h2 className="text-xl font-semibold text-gray-800">{user?.username}</h2>
                <p className="text-gray-600 italic">{user?.email}</p>
                <p className="text-gray-600">Unido desde el {user?.createdAt}</p>
            </div>
        </div>

        <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800">Cursos</h2>
            <p className="text-gray-600">Estos son los cursos que has tomado.</p>
            <div className="grid grid-cols-3 gap-6">            
            {inscriptions.map((inscription) => {
                let curso = inscription.attributes.course.data.id;
                return (
                <div className="mt-4">
                    <div className="bg-white px-6 py-4 w-fit p-4 rounded-md shadow-md mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">{inscription.attributes.course.data.attributes.title}</h3>
                        <div className="text-gray-600">
                            <p>Fecha de inicio: {inscription.attributes.date.toString()}</p>
                            <p>Estado: {inscription.attributes.finished ? "Finalizado" : "En curso"}</p>
                        </div>
                    </div>
                </div>)})}
            </div>
        </div>
    </div>
    );
       


};