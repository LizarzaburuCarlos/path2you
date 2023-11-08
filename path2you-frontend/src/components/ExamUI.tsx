import { useEffect, useState } from "react";
import type Question from "../interfaces/question";
import fetchApi from "../lib/strapi";
import { userData } from "../core/helpers";
import type User from "../interfaces/user";


export const ExamUI = ({ exam }) => { 

    const examId = exam.id.toString();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [user, setUser] = useState<User>();

    useEffect(() => {

        const userDataResponse = async () => {
            const userDataResponse = await userData();
            setUser(userDataResponse);
        
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
            console.log(questions);
            
        };

        userDataResponse();
        fetchQuestions();

    }, []);

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
            location.replace("/profile");
            
        } catch (error) {
            console.log("error", error);
         }

    }

    return (
        <div className="">
            <h4 className="text-3xl font-semibold mb-4">{exam.attributes.title}</h4>
            <div>{exam.attributes.description}</div>
            
            <form 
            onSubmit={handleScore}
            >
                <div className="flex flex-col gap-4">
                    {questions.map((question, index) => (
                        <div className="flex flex-col gap-4">
                            <h5 className="text-xl font-semibold">{index+1}. {question.attributes.title}</h5>
                            <div className="flex flex-col gap-6">
                                <div className="flex items-center gap-4">
                                    <input type="radio" name={`${question.id}`} id={`question${index}`} value="verdadero" />
                                    <label className="mr-10" htmlFor={`question${index}`}>Verdadero</label>
                                    <input type="radio" name={`${question.id}`} id={`question${index}`} value="falso" />
                                    <label htmlFor={`question${index}`}>Falso</label>
                                </div>  
                            </div>
                        </div>
                    ))}
                </div>
                <button type="submit" className="btn btn-primary">Enviar</button>

            </form>

        </div>
    );
}