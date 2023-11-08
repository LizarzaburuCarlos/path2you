import type Course from "../interfaces/course";
import fetchApi from "../lib/strapi";
import { useEffect, useState } from "react";
import ModuleCard from "./ModuleCard";
import type Module from "../interfaces/module";
import type Exam from "../interfaces/exam";
import ExamCard from "./ExamCard";

const ModuleList = (course: Course) => {
  const courseId = course.id.toString();
  const [modules, setModules] = useState<Module[]>([]);
  const [exam, setExam] = useState<Exam>();

  useEffect(() => {
    const fetchModules = async () => {
      const modulesData = await fetchApi<Module[]>({
        endpoint: "modules",
        wrappedByKey: "data",
        query: {
          "filters[course][id][$eq]": courseId || "",
        },
      });

      const examData = await fetchApi<Exam>({
        endpoint: "exams",
        wrappedByKey: "data",
        query: {
          "filters[course][id][$eq]": courseId || "",
        },
      });

      setExam(examData[0]);
      setModules(modulesData);
    };

    fetchModules();
  }, [courseId]);

  return (
    <section className="modulelist w-full">
      <h3 className="modulelist__title text-2xl mb-6 font-semibold">
        Módulos
      </h3>
      {modules.length > 0 ? (
        <div className="modulelist__container grid grid-cols-1 lg:grid-cols-2 gap-6">
          {modules.map((module) => (
            <ModuleCard slug={course.attributes.slug} module={module} />
          ))}
        </div>
      ) : (
        <div className="modulelist__empty w-fullt text-center">
          <p className="text-lg font-semibold opacity-50 ">
            No hay clases disponibles para este curso. <br />
            ¡Vuelve pronto!
          </p>
        </div>
      )}
      <h3 className="modulelist__title text-2xl my-6 font-semibold">
        Evaluación
      </h3>
      {exam !== undefined ? (
        <ExamCard exam={exam} />
      ) : (
        <div className="modulelist__empty w-fullt text-center">
          <p className="text-lg font-semibold opacity-50 ">
            No hay clases disponibles para este curso. <br />
            ¡Vuelve pronto!
          </p>
        </div>
      )}
    </section>
  );
};

export default ModuleList;
