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
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedOptions, setSelectedOptions] = useState<any>([]);

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
            setLoading(false);
            
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
                    finished: true,
                  },
                },
              });
              console.log(res);
              location.replace("/profile");
                
            } catch (error) {
              console.log("error", error);
        }
         
    }

    const handleOptionChange = (questionId: number) => {
      setSelectedOptions((prevSelectedOptions) => {
        if (!prevSelectedOptions.includes(questionId)) {
          const newSelectedOptions = [...prevSelectedOptions, questionId];
          return newSelectedOptions;
        }
        return prevSelectedOptions;
      });
    };

    const isFormValid = () => {
      return selectedOptions.length === questions.length;
    };

    return (
      <section>
         {loading && (
          <div className="loader">
            <div className="spinner"></div>
          </div>
        )}

        <div className="exam__container w-[80%]">
            <div className="button__return mb-6 w-fit hover:scale-105 transition-all duration-300">
              <a href={`/courses/${exam.attributes.course.data.attributes.slug}`} className="h-fit py-1 px-2 w-full font-semibold">
              <i className="fa-solid fa-arrow-left-long pr-1"></i>
              Volver</a>
            </div>
            <h4 className="exam__title text-2xl font-bold mb-3">{exam.attributes.title}</h4>
            <div className=" mb-6">{exam.attributes.description}</div>
            <form onSubmit={handleScore}>
              <div className="flex flex-col gap-6">
                {questions.map((question, index) => (
                  <div className="exam__question--container rounded-lg p-6 flex flex-col gap-4">
                    <h5 className="text font-semibold">0{index+1}. {question.attributes.title}</h5>
                    <div className="flex flex-col gap-6">
                      <div className="flex text items-center gap-8">
                        <div className="question__option rounded-lg py-2 flex-row flex gap-4 ">
                          <input 
                            onChange={() => handleOptionChange(question.id)}
                            type="radio" name={`${question.id}`} id={`question-a-${index}`} value="verdadero" />
                          <label htmlFor={`question-a-${index}`}>Verdadero</label>
                        </div>
                        <div className="question__option rounded-lg py-1 px-4 flex-row flex gap-4">
                          <input
                            onChange={() => handleOptionChange(question.id)}
                            type="radio" name={`${question.id}`} id={`question-b-${index}`} value="falso" />
                          <label htmlFor={`question-b-${index}`}>Falso</label>
                        </div>
                      </div>  
                    </div>
                   </div>
                  ))}
              </div>
              <div className="exam__button--submit my-6">
                <button type="submit" disabled={!isFormValid()} className="transform duration-300 hover:scale-105 py-2 px-4 rounded-full">
                  <i className="fa-solid fa-check-double mr-2"></i>
                    Presentar Examen
                </button>
              </div>
            </form>
        </div>
      </section>
    );
}