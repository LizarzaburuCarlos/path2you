import { useEffect, useState } from "react";
import { userData } from "../../core/helpers";
import type Ask from "../../interfaces/ask";
import type Practice from "../../interfaces/practice";
import fetchApi from "../../lib/strapi";
import type User from "../../interfaces/user";
import type Module from "../../interfaces/module";


export const PracticeUI = (practice: Practice) => { 
  
    const [loading, setLoading] = useState<boolean>(true);
    const [asks, setAsks] = useState<Ask[]>([]);
    const [results, setResults] = useState<Array<boolean>>([]);
    const [showButton, setShowButton] = useState<boolean>(true);
    const [module, setModule] = useState<Module>();
    const [selectedOptions, setSelectedOptions] = useState<any>([]);
    const [formSubmitted, setFormSubmitted] = useState(false);

    useEffect(() => {

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
            
        };

        setModule(practice.attributes.module.data);
 
        fetchAsks();

    }, []);

    const handleOptionChange = (questionId: number) => {
      setSelectedOptions((prevSelectedOptions) => {
        const newSelectedOptions = [...prevSelectedOptions, questionId];
        return newSelectedOptions;
      });
    };

    const handleScore = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const answers = Object.fromEntries(
          new FormData(event.currentTarget).entries()
        ) as any;

        const resultados: boolean[] = [];

        for (const key in answers) {
          const respuestaUsuario = answers[key];
          const pregunta = asks.find((a) => a.id === parseInt(key));
        
          if (pregunta) {
            if (
              (respuestaUsuario === "verdadero" && pregunta.attributes.true) ||
              (respuestaUsuario === "falso" && pregunta.attributes.false)
            ) {
              resultados.push(true);
            } else {
              resultados.push(false);
            }
          }
        }
      
        setResults(resultados);
        setFormSubmitted(true);
        setShowButton(false);
        
    };

    const isFormValid = () => {
      return selectedOptions.length === asks.length;
    };

    return (
        <section className="practice__section">
         {loading && (
            <div className="loader">
                <div className="spinner"></div>
            </div>
        )}
        <div className="exam__container w-[80%]">
          <div className="button__return mb-6 w-fit hover:scale-105 transition-all duration-300">
              <a href={`/modules/${module?.attributes.slug}`} className="h-fit py-1 px-2 w-full font-semibold">
              <i className="fa-solid fa-arrow-left-long pr-1"></i>
              Volver</a>
          </div>
          <h4 className="exam__title text-2xl font-bold mb-3">{practice.attributes.title}</h4>
          <div className=" mb-6">{practice.attributes.description}</div>
          <form onSubmit={handleScore}>  
            <div className="flex flex-col gap-6">
              {asks.map((question, index) => (
                <div className={`exam__question--container rounded-lg p-6 flex flex-col gap-4 ${
                  results.length > 0 ? (results[index] ? 'correct' : 'incorrect') : ''
                  }`}>
                  <h5 className="text font-semibold">0{index+1}. {question.attributes.title}</h5>
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col justify-center gap-4">
                      <div className="ask__option rounded-lg py-2 flex-row flex gap-4 ">
                        <input
                        onChange={() => handleOptionChange(question.id)} 
                        disabled={formSubmitted} type="radio" name={`${question.id}`} id={`question-a-${index}`} value="verdadero" />
                        <label htmlFor={`question-a-${index}`}>{question.attributes.trueSentence}.</label>
                      </div>
                      <div className="ask__option rounded-lg py-1 flex-row flex gap-4">
                        <input 
                        onChange={() => handleOptionChange(question.id)}
                        disabled={formSubmitted} type="radio" name={`${question.id}`} id={`question-b-${index}`} value="falso" />
                        <label htmlFor={`question-b-${index}`}>{question.attributes.falseSentence}.</label>
                      </div>
                    </div>  
                  </div>
                </div>
              ))}
            </div>
            {showButton && (
              <div className="exam__button--submit my-6">
                <button disabled={!isFormValid()} type="submit">
                  <i className="fa-solid fa-check-double mr-2"></i>
                  Verificar Respuestas
                </button>
              </div>
            )}
          </form>
        </div>
      </section>
    );
}