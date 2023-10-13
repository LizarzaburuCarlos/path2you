import type Course from "../interfaces/course";
import fetchApi from "../lib/strapi";
import type Lecture from "../interfaces/lecture";
import { useEffect, useState } from "react";
import LectureCard from "./LectureCard";
import type User from "../interfaces/user";
import { userData } from "../core/helpers";

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

  const [style, setStyle] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
          const userDataResponse = await userData();
            // console.log(userDataResponse);
          await fetchUserData(userDataResponse.id);
        };
        
        fetchData();
        
      }, []);

  async function fetchUserData(user) {
    try {
      const userDataApi = await fetchApi<User>({
        endpoint: "users/" + user,
      });    
      fetchStyle(userDataApi);
      // console.log(userDataApi);

    } catch (error) {
      console.log("error", error);
    }
}

const fetchStyle = async (usuario) => {

  if (usuario!.darkmode === true) {
    setStyle("dark");
  } else if (usuario!.neumorphismmode === true) {
    setStyle("neumorphism");
  } else {
    setStyle("light");
  }

};

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
