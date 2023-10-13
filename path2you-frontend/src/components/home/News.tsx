import { useEffect, useState } from "react";
import type User from "../../interfaces/user";
import fetchApi from "../../lib/strapi";
import { userData } from "../../core/helpers";


const News = () => {

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
        <section className="news w-full h-72 mb-10">
            <div className="news__container h-full w-full flex  flex-wrap gap-4">
                <div className={`img1 ${style} rounded-xl h-full w-1/2 md:w-1/3 flex-1 order-1`}></div>
                <div className="news__medium flex flex-col gap-4 h-full w-full md:w-1/3 md:flex-1 order-2 max-md:order-3">
                    <div className={`img2 rounded-xl ${style} basis-1/2`}></div>
                    <div className={`img3 rounded-xl ${style} basis-1/2`}></div>
                </div>
                <div className={`img4 rounded-xl ${style} h-full w-1/2 md:w-1/3 flex-1 order-3 max-md:order-2`}></div>
            </div>
        </section>
    )
}

export default News;