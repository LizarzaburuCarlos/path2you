import { getPhoto } from '../core/service';
import '../styles/CourseCardDefault.styles.css'


// FALTA:
// 1. Agregar un loading
// 2. Mejorar apariencia de cards
// 3. Definir que información se colocará en las cards

const CourseCard = (course: any,) => {

    return(
        <a href={`/courses/${course.slug}/`} aria-label={`Curso ${course.title}`} className="coursecard w-full h-32 px-8 py-6 flex gap-6 justify-between items-center">
            <div className="coursecard__img w-12 h-12 rounded-lg">
                {!course.photo.data ?
                <div className='w-12 h-12 rounded-lg bg-black'>

                </div>    
                : 
                
                <img src={getPhoto({course})} alt={course.title} className="w-full h-full object-cover object-center rounded-lg" />

                 }
            </div>
            <div className="coursecard__content w-fit h-full flex flex-col justify-center items-end max-w-xs">
                <h3 className="coursecard__title text-customPrimary font-bold text-lg">{course.title}</h3>
                <p className="coursecard__text text-customText text-base">{course.description}</p>
            </div>
        </a>
    )
}

export default CourseCard;