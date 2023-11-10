
const News = () => {

    return (
        <section className="news w-full h-96 overflow-hidden sm:h-72 mb-10">
            <div className="news__container h-full w-full md:flex flex-wrap gap-4">
                <div className={`img1 rounded-xl h-full w-full md:w-1/2 lg:w-1/3 flex-1 order-1 overflow-hidden`}>
                    <img src="/images/banners/banner-left.png" className="h-full w-full object-cover object-bottom" alt="Banner Informativo Izquierdo" />
                </div>
                <div className="news__medium flex flex-col gap-4 h-full w-full max-md:hidden lg:w-1/3 lg:flex-1 order-2 max-lg:order-3">
                    <div className={`img2 rounded-xl basis-1/2 overflow-hidden`}>
                        <img src="/images/banners/banner-middle-top.png" className="h-full w-full object-cover object-center" alt="Banner Informativo Superior" />
                    </div>
                    <div className={`img3 rounded-xl basis-1/2 overflow-hidden`}>
                        <img src="/images/banners/banner-middle-bottom.png" className="h-full w-full object-cover object-center" alt="Banner Informativo Inferior" />
                    </div>
                </div>
                <div className={`img4 rounded-xl  h-full w-full md:w-1/2 lg:w-1/3 flex-1 order-3 max-lg:order-2 overflow-hidden`}>
                    <img src="/images/banners/banner-right.png" className="h-full w-full object-cover object-top" alt="Banner Informativo Derecho" />
                </div>
            </div>
        </section>
    )
}

export default News;