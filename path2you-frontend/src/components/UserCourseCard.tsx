import { useEffect, useState } from "react";
import type Score from "../interfaces/score";
import fetchApi from "../lib/strapi";
import dayjs from "dayjs";
import { getPhoto } from "../core/service";
import type Course from "../interfaces/course";

export const UserCourseCard = ({ inscription, user }) => {
    
    const curso = inscription.attributes.course.data;
    
    const [score, setScore] = useState<Score>();
    const [course, setCourse] = useState<Course>();

    const fechaFormateada = (fecha) => {
        let formateada = dayjs(fecha).format("DD/MM/YYYY");
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
    };

    useEffect(() => {

        const getCurso = async (id) => {
            const curso = await fetchApi<Course>({
                endpoint: "courses/" + id.toString() + "?populate=*",
                method: "GET",
                wrappedByKey: "data",
            });
            setCourse(curso);
        };

        getCurso(curso.id);
    }, []);

    useEffect(() => {
        fetchScore(user.id);
    }, []);

    return (
        <a href={`/courses/${curso.attributes.slug}`} className="mt-4 profile__course--card--link">
            <div  className="mt-4 profile__course--card w-full lg:w-full p-6 rounded-md mb-4">
                <div className="profile__course--info">
                    <h3 className="text-lg font-semibold">{inscription.attributes.course.data.attributes.title}</h3>
                    <div className="text-base">
                        <p>Fecha de inicio: {fechaFormateada(inscription.attributes.date)}</p>
                        {inscription.attributes.finished === false && (
                            <div className="unfinished__course mt-2 inline-block rounded-full px-3 py-1 text-sm font-semibold mr-2">En Curso</div>
                        )}
                        {inscription.attributes.finished && (
                            <>
                            <p className="mb-2" >Calificación: {score?.attributes.score}</p>
                            <div className="finished__course inline-block rounded-full px-3 py-1 text-sm font-semibold mr-2">Finalizado</div>
                            <div className={`inline-block ${score?.attributes.approved ? "approved__course":"disapproved__course"} rounded-full px-3 py-1 text-sm font-semibold mr-2`}>
                                {score?.attributes.approved ? "Aprobado":"Desaprobado"}</div>
                            </>
                        )}
                    </div>
                </div>
                
            </div>
        </a>
    );

};