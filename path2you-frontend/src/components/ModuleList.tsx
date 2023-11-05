import type Course from "../interfaces/course";
import fetchApi from "../lib/strapi";
import { useEffect, useState } from "react";
import ModuleCard from "./ModuleCard";
import type Module from "../interfaces/module";

const ModuleList = (course: Course) => {
  const courseId = course.id.toString();
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    const fetchModules = async () => {
      const modulesData = await fetchApi<Module[]>({
        endpoint: "modules",
        wrappedByKey: "data",
        query: {
          "filters[course][id][$eq]": courseId || "",
        },
      });

      setModules(modulesData);
    };

    fetchModules();
  }, [courseId]);

  return (
    <section className="modulelist w-full mt-10">
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
    </section>
  );
};

export default ModuleList;
