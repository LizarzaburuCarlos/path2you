import { useEffect, useState } from "react";
import type Score from "../interfaces/score";
import fetchApi from "../lib/strapi";
import dayjs from "dayjs";
import type Progress from "../interfaces/progress";

export const UserCourseCard = ({ inscription, user }) => {
    console.log(user.id);
    
    const curso = inscription.attributes.course.data;
    const [score, setScore] = useState<Score>();
    const [progreso, setProgreso] = useState<Progress>();

    const fechaFormateada = (fecha) => {
        let formateada = dayjs(fecha).format("DD/MM/YYYY");
        console.log(formateada);
        return formateada;
    };

    const fetchScore = async (id) => {
        const score = await fetchApi<Score>({
            endpoint: "scores",
            query:{
                "filters[user][id][$eq]": id.toString() || "",
                "filters[exam][course][id][$eq]": inscription.attributes.course.data.id.toString() || "",
            },
            method: "GET",
            wrappedByKey: "data",
        });
        setScore(score[0]);

        console.log(score);
    };

    useEffect(() => {
        fetchScore(user.id);
    }, [user]);

    return (
        <a href={`/courses/${curso.attributes.slug}`} className="mt-4 profile__course--card--link">
            <div  className="mt-4 profile__course--card w-full lg:w-full p-6 rounded-md mb-4">
                <h3 className="text-lg font-semibold ">{inscription.attributes.course.data.attributes.title}</h3>
                <div className="text-base">
                    <p>Fecha de inicio: {fechaFormateada(inscription.attributes.date)}</p>
                    <p>Estado: {inscription.attributes.finished ? "Finalizado" : "En curso"}</p>
                    {inscription.attributes.finished && (
                        <div className="flex gap-2">
                            <p>Calificación: {score?.attributes.score}</p>
                            <p className={`font-bold ${score?.attributes.approved ? "":""}`}>{score?.attributes.approved ? "Aprobado":"Desaprobado"}</p>
                        </div>
                    )}
                    {/* {inscription.attributes.finished === false && (
                        <div className="flex gap-2">
                            <p>Progreso: </p>
                            <p className={`${score?.attributes.approved ? "":""}`}></p>
                        </div>
                    )}  */}
                </div>
            </div>
        </a>
    );

};