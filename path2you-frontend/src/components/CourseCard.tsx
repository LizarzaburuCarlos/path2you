import '../styles/CourseCardDefault.styles.css'

const CourseCard = (course: any,) => {
   
    return(
        <div className="coursecard w-full h-32 px-8 py-6 flex gap-6 justify-between items-center">
            <div className="coursecard__img w-6 h-12 bg-black rounded-lg">
                <img src={course.img} alt={course.title} className="w-full h-full object-cover object-center rounded-lg" />
            </div>
            <div className="coursecard__content w-fit h-full flex flex-col justify-center items-end max-w-xs">
                <h3 className="coursecard__title text-customPrimary font-bold text-lg">{course.title}</h3>
                <p className="coursecard__text text-customText text-base">{course.description}</p>
            </div>
        </div>
    )
}

export default CourseCard;