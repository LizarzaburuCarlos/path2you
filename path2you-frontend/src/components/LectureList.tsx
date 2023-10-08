import type Course from "../interfaces/course";
import fetchApi from "../lib/strapi";
import type Lecture from "../interfaces/lecture";
import { useEffect, useState } from "react";
import LectureCard from "./LectureCard";

const LectureList = (course: Course) => {
  const courseId = course.id.toString();
  const [lectures, setLectures] = useState<Lecture[]>([]);

  useEffect(() => {
    const fetchLectures = async () => {
      const lecturesData = await fetchApi<Lecture[]>({
        endpoint: "lectures?populate=media",
        wrappedByKey: "data",
        query: {
          "filters[course][id][$eq]": courseId || "",
        },
      });
      
      setLectures(lecturesData);
      
  };

  fetchLectures();

  }, [courseId]);

  return (
    <section className="lecturelist w-full mt-20">
      {lectures.length > 0 ? (
        <div className="lecturelist__container grid grid-cols-1 lg:grid-cols-2 gap-4">
          {lectures.map((lecture) => (
            <LectureCard {...lecture} />
          ))}
        </div>
      ) : (
        <div className="lecturelist__empty w-fullt text-center">
          <p className="text-lg font-semibold opacity-50 ">
            No hay clases disponibles para este curso. <br />
            ¡Vuelve pronto!
          </p>
        </div>
      )}
    </section>
  );
};

export default LectureList;
