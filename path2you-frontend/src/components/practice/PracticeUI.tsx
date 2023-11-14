import { useEffect, useState } from "react";
import { userData } from "../../core/helpers";
import type Ask from "../../interfaces/ask";
import type Practice from "../../interfaces/practice";
import fetchApi from "../../lib/strapi";
import type User from "../../interfaces/user";


export const PracticeUI = (practice: Practice) => { 
  
    const [score, setScore] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [asks, setAsks] = useState<Ask[]>([]);
    const [user, setUser] = useState<User>();
    const moduleId = practice.attributes.module.data.id.toString();
  

    useEffect(() => {

        const userDataResponse = async () => {
            const userDataResponse = await userData();
            setUser(userDataResponse);        
            
        }
        const fetchAsks = async () => {
            const asksData = await fetchApi<Ask[]>({
                endpoint: "asks",
                wrappedByKey: "data",
                query: {
                  "filters[practice][id][$eq]": practice.id.toString() || "",
                },
            });
            setAsks(asksData);
            setLoading(false);
            // console.log(questions);
            
        };
        userDataResponse();
        fetchAsks();

    }, []);

    const handleScore = async (event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault();
        const answers = Object.fromEntries(
            new FormData(event.currentTarget).entries()
          ) as any;
  
            
        // for (const key in answers) {
        //     const respuestaUsuario = answers[key];
        //     const pregunta = asks.find((a) => a.id === parseInt(key));
          
        //     if (pregunta) {
        //         if (
        //           (respuestaUsuario === "verdadero" && pregunta.attributes.true) ||
        //           (respuestaUsuario === "falso" && pregunta.attributes.false)
        //         ) {
        //           score += 2;
        //         }
        //       }
        //     }

        //   console.log(`Tu puntaje es: ${score}`);
         
    }

    return (
        <section className="practice__section">
         {loading && (
            <div className="loader">
                <div className="spinner"></div>
            </div>
        )}
        <div className="exam__container w-[80%]">
            <h4 className="exam__title text-2xl font-bold mb-3">{practice.attributes.title}</h4>
            <div className=" mb-6">{practice.attributes.description}</div>
            <form 
            onSubmit={handleScore}
            >
                <div className="flex flex-col gap-6">
                    {asks.map((question, index) => (
                        <div className="exam__question--container rounded-lg p-6 flex flex-col gap-4">
                            <h5 className="text font-semibold">0{index+1}. {question.attributes.title}</h5>
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col justify-center gap-4">
                                  <div className="ask__option rounded-lg py-2 flex-row flex gap-4 ">
                                    <input className="text-xl" type="radio" name={`${question.id}`} id={`question-a-${index}`} value="verdadero" />
                                    <label htmlFor={`question-a-${index}`}>{question.attributes.trueSentence}.</label>
                                  </div>
                                  <div className="ask__option rounded-lg py-1 flex-row flex gap-4">
                                    <input type="radio" name={`${question.id}`} id={`question-b-${index}`} value="falso" />
                                    <label htmlFor={`question-b-${index}`}>{question.attributes.falseSentence}.</label>
                                  </div>
                                </div>  
                            </div>
                        </div>
                    ))}
                </div>
                <div className="exam__button--submit my-6">
                  <button type="submit" className="transform duration-300 hover:scale-105 py-2 px-4 rounded-full">
                  <i className="fa-solid fa-check-double mr-2"></i>
                    Verificar Respuestas
                  </button>
                </div>
            </form>
        </div>
        </section>
    );
}