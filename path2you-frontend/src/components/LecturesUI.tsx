import type Lecture from "../interfaces/lecture";

type LectureUIProps = {
    slug: string;
    lecture: Lecture;
  };

export const LecturesUI = (lecture: Lecture) => {

    return (
        <section className="lecture-info w-full">
            <div>{lecture.attributes.title}</div>
            <div className="h-20 w-20 bg-red-600"></div>
        </section>
        
    );
};