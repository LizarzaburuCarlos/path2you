export const LessonViewer = ({leccion, setResolution, setLeccion}) => {

    return (

        <div className="lesson__viewer">
            <div className="lesson__return mb-3 w-fit">
                <button className="h-fit py-1 px-2 w-full bg-red-300" onClick={() => {
                    setResolution(null)
                    setLeccion(null)
                    }}>Volver</button>
            </div>
            <div className="lesson__viewer__video">
                <video controls className="lesson__viewer__video__player">
                    <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
                    Your browser does not support HTML video.
                </video>
            </div>
            <div className="lesson__viewer__content">
                <h4 className="lesson__viewer__title font-semibold text-2xl mb-2">{leccion.attributes.title}</h4>
            </div>
        </div>
    )
}