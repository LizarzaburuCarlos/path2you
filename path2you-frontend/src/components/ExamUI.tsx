import { useEffect, useState } from "react";
import type Question from "../interfaces/question";
import fetchApi from "../lib/strapi";
import { userData } from "../core/helpers";
import type User from "../interfaces/user";
import type Inscription from "../interfaces/inscription";
import type Exam from "../interfaces/exam";

export const ExamUI = (exam: Exam) => { 
  
    const examId = exam.id.toString();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [user, setUser] = useState<User>();
    const courseId = exam.attributes.course.data.id.toString();
    const [inscription, setInscription] = useState<Inscription>();

    useEffect(() => {

        const userDataResponse = async () => {
            const userDataResponse = await userData();
            setUser(userDataResponse);
            const ins = await getInscription(userDataResponse.id);            
            setInscription(ins);
            
        }
        const fetchQuestions = async () => {
            const questions = await fetchApi<Question[]>({
                endpoint: "questions",
                wrappedByKey: "data",
                query: {
                  "filters[exam][id][$eq]": examId || "",
                },
            });

            setQuestions(questions);
            // console.log(questions);
            
        };
        userDataResponse();
        fetchQuestions();

    }, []);

    const getInscription = async (id) => {      
          const getInscription = await fetchApi<Inscription>({
            endpoint: "inscriptions",
            wrappedByKey: "data",
            method: "GET",
            query: {
              "filters[user][id][$eq]": id,
              "filters[course][id][$eq]": courseId,
            },
        });       
       return getInscription[0];
    };

    const handleScore = async (event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault();
        const answers = Object.fromEntries(
            new FormData(event.currentTarget).entries()
          ) as any;
  
        
        let score = 0;
            
        for (const key in answers) {
            const respuestaUsuario = answers[key];
            const pregunta = questions.find((q) => q.id === parseInt(key));
          
            if (pregunta) {
                if (
                  (respuestaUsuario === "verdadero" && pregunta.attributes.true) ||
                  (respuestaUsuario === "falso" && pregunta.attributes.false)
                ) {
                  score += 2;
                }
              }
            }

          console.log(`Tu puntaje es: ${score}`);

        try {
            const res = await fetchApi({
              endpoint: "scores",
              method: "POST",
              body: {
                data: {
                  user: user!.id,
                  exam: examId,
                  score: Number(score),
                  approved: score >= 6 ? true : false,
                },
              },
            });
            console.log(res);
            
        } catch (error) {
            console.log("error", error);
        }

        let finished: boolean;

        if (score >= 6) {
          finished = true;
        } else {
          finished = false;
        }
        console.log(inscription);
        
        try {
            const res = await fetchApi({
              endpoint: "inscriptions/" + inscription!.id,
              method: "PUT",
              body: {
                  data: {
                    user: user!.id,
                    course: courseId,
                    date: inscription!.attributes.date,
                    finished: finished,
                  },
                },
              });
              console.log(res);
              location.replace("/profile");
                
            } catch (error) {
              console.log("error", error);
        }
         
    }

    return (
        <div className="exam__container w-[80%]">
            <h4 className="exam__title text-2xl font-bold mb-3">{exam.attributes.title}</h4>
            <div className=" mb-6">{exam.attributes.description}</div>
            
            <form 
            onSubmit={handleScore}
            >
                <div className="flex flex-col gap-6">
                    {questions.map((question, index) => (
                        <div className="exam__question--container rounded-lg p-6 flex flex-col gap-4">
                            <h5 className="text font-semibold">0{index+1}. {question.attributes.title}</h5>
                            <div className="flex flex-col gap-6">
                                <div className="flex text items-center gap-8">
                                  <div className="question__option rounded-lg py-2 flex-row flex gap-4 ">
                                    <input className="text-xl" type="radio" name={`${question.id}`} id={`question-a-${index}`} value="verdadero" />
                                    <label htmlFor={`question-a-${index}`}>Verdadero</label>
                                  </div>
                                  <div className="question__option rounded-lg py-1 px-4 flex-row flex gap-4">
                                    <input type="radio" name={`${question.id}`} id={`question-b-${index}`} value="falso" />
                                    <label htmlFor={`question-b-${index}`}>Falso</label>
                                  </div>
                                </div>  
                            </div>
                        </div>
                    ))}
                </div>
                <div className="exam__button--submit my-6">
                  <button type="submit" className="transform duration-300 hover:scale-105 py-2 px-4 rounded-full">
                  <i class="fa-solid fa-check-double mr-2"></i>
                    Presentar Examen
                  </button>
                </div>
                

            </form>

        </div>
    );
}