import { STRAPI_URL } from "../core/constants";
import type Lecture from "../interfaces/lecture";
import "../styles/LectureCardDefault.styles.css";

const LectureCard = (lecture: Lecture) => {
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
    <div className="lecturecard w-full h-44 px-8 py-6 flex gap-6 items-center">
      <div className="lecturecard__img w-10 h-10 rounded-lg">
        <div className="w-10 h-10 rounded-lg bg-black" />
      </div>
      <div className="lecturecard__content w-full h-full flex flex-col justify-center items-start">
        <div className="lecturecard__presentation">
          <h3 className="lecturecard__title text-customPrimary font-bold text-lg">
            {lecture.attributes.title}
          </h3>
          <p className="lecturecard__text text-customText text-base  overflow-hidden">
            {lecture.attributes.description}
          </p>
        </div>
        <div className="lecturecard__media mt-4 w-full gap-6 flex justify-between items-center">
          {mediaData.length > 0 &&
            mediaData.map((mediaItem) => (
              <button className="h-8 w-8 cursor-pointer bg-slate-100" onClick={() => handleDownload(mediaItem)}>
                {getFileIcon(mediaItem.attributes.name)}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default LectureCard;
