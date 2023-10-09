

const News = () => {
    return (
        <section className="news w-full h-72 mb-10 bg-blue">
            <div className="news__container h-full w-full flex  flex-wrap gap-4">
                <div className="img1 rounded-xl bg-slate-200 h-full w-1/2 md:w-1/3 flex-1 order-1"></div>
                <div className="news__medium flex flex-col gap-4 h-full w-full md:w-1/3 md:flex-1 order-2 max-md:order-3">
                    <div className="img2 rounded-xl bg-slate-200 basis-1/2"></div>
                    <div className="img3 rounded-xl bg-slate-200 basis-1/2"></div>
                </div>
                <div className="img3 rounded-xl bg-slate-200 h-full w-1/2 md:w-1/3 flex-1 order-3 max-md:order-2"></div>
            </div>
        </section>
    )
}

export default News;