

function ImageTempl({ filename, id, data, content, deleteClick }) {
    return (
        <li className="block p-1 w-1/4">
            <article tabIndex="0"
                className="group hasImage w-full h-full rounded-md focus:outline-none focus:shadow-outline bg-gray-100 cursor-pointer relative text-transparent hover:text-white shadow-sm">
                <img alt="upload preview" src={data}
                    className="img-preview w-full h-full sticky object-cover rounded-md bg-fixed" />

                <section
                    className="flex flex-col hover:text-black rounded-md text-xs break-words w-full h-full z-20 absolute top-0 py-2 px-3">
                    <h1 className="flex-1">{filename}</h1>
                    <div className="flex">
                        <span className="p-1">
                            <i>
                                <svg className="fill-current w-4 h-4 ml-auto pt-"
                                    xmlns="http://www.w3.org/2000/svg" width="24"
                                    height="24" viewBox="0 0 24 24">
                                    <path
                                        d="M5 8.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5c0 .829-.672 1.5-1.5 1.5s-1.5-.671-1.5-1.5zm9 .5l-2.519 4-2.481-1.96-4 5.96h14l-5-8zm8-4v14h-20v-14h20zm2-2h-24v18h24v-18z" />
                                </svg>
                            </i>
                        </span>

                        <p className="p-1 size text-xs">{content}</p>
                        <button
                            className="delete ml-auto focus:outline-none hover:bg-gray-300 p-1 rounded-md" onClick={() => deleteClick(id)}>
                            <svg className="pointer-events-none fill-current w-4 h-4 ml-auto"
                                xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                viewBox="0 0 24 24">
                                <path className="pointer-events-none"
                                    d="M3 6l3 18h12l3-18h-18zm19-4v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.316c0 .901.73 2 1.631 2h5.711z" />
                            </svg>
                        </button>
                    </div>
                </section>
            </article>
        </li>
    );
}

export default ImageTempl;