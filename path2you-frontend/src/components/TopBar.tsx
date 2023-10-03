
const TopBar = () => {

    return(
        <section className="topbar w-full h-16 mb-12 flex items-center justify-between">
            <form className="topbar__searchbar">
                <input type="text" placeholder="Buscar" className="topbar__search-input"/>
                <button type="submit" className="topbar__search-button">L</button>
            </form>
            <div className="topbar__side-buttons">
                <button className="topbar__button">M</button>
                <button className="topbar__button">N</button>
            </div>
        </section>
    )
}

export default TopBar;
