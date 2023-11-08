import type Exam from "../interfaces/exam";

type ExamCardProps = {
    exam: Exam;
  };

const ExamCard: React.FC<ExamCardProps> = ( { exam } ) => {

    return (
        <a
        href={`/exams/${exam.attributes.slug}`}
        className={`modulecard w-full h-28 px-8 py-6 flex gap-6 items-center`}
      >
          <div
            className={`modulecard__img flex items-center justify-center w-16 h-16 rounded-xl`}
          >
            <div className="flex justify-center items-center w-16 h-16" >
                <i className="icon__exam text-3xl fa-solid fa-puzzle-piece"></i>
            </div>
          </div>
  
        <div
          className={`modulecard__content w-full h-full flex flex-col justify-center items-start`}
        >
          <div className="modulecard__presentation">
            <h3 className="modulecard__title font-bold text-lg">
              {exam.attributes.title}
            </h3>
          </div>
        </div>
      </a>
    );


};

export default ExamCard;