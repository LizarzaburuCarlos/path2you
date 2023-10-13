import { useEffect, useState } from "react";
import { STRAPI_URL } from "../core/constants";
import { userData } from "../core/helpers";
import type Lecture from "../interfaces/lecture";
import type User from "../interfaces/user";
import fetchApi from "../lib/strapi";
import "../styles/LectureCardDefault.styles.css";

const LectureCard = (lecture: Lecture) => {

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

  let mediaData: any = {};

  if (lecture.attributes.media.data) {
    mediaData = Object.values(lecture.attributes.media.data);
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return "P";
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
      case "webp":
        return "I";
      case "mp4":
        return "V";
      default:
        return null;
    }
  };

  const handleDownload = (mediaItem: any) => {
    
    const fileName = mediaItem.attributes.url;
    const fileUrl = `${STRAPI_URL}${fileName}`;

    const anchor = document.createElement("a");
    anchor.href = fileUrl;
    anchor.download = fileName;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.click();

    return undefined;
  };

  return (
    <div className={`lecturecard ${style} w-full h-44 px-8 py-6 flex gap-6 items-center`}>
      <div className={`lecturecard__img ${style} w-10 h-10 rounded-full`}>
        <div className="w-10 h-10 rounded-full" />
      </div>
      <div className={`lecturecard__content ${style} w-full h-full flex flex-col justify-center items-start`}>
        <div className="lecturecard__presentation">
          <h3 className="lecturecard__title font-bold text-lg">
            {lecture.attributes.title}
          </h3>
          <p className="lecturecard__text text-base overflow-hidden">
            {lecture.attributes.description}
          </p>
        </div>
        <div className={`lecturecard__media ${style} mt-4 w-full gap-6 flex justify-start items-center`}>
          {mediaData.length > 0 &&
            mediaData.map((mediaItem) => (
              <button className="h-8 w-8 cursor-pointer" onClick={() => handleDownload(mediaItem)}>
                {getFileIcon(mediaItem.attributes.name)}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default LectureCard;
