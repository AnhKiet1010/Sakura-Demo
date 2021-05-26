import React, { useState } from 'react';
import API from '../../api/API';

import ImageTempl from './ImageTempl';
import FileTempl from './FileTempl';


function UploadPopup({ close, currentUser }) {
    const [gallery, setGallery] = useState([]);
    const [files, setFiles] = useState({});
    const [loading, setLoading] = useState(false);

    function onSubmit(e) {
        setLoading(true);
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i]);
        }
        formData.append("toId", currentUser.lineId);
        formData.append("type", gallery[0].type);
        API.sendMessage(formData)
            .then(res => {
                console.log('res', res);
                setLoading(false);
                close();
            }).catch(err => {
                console.log('loi', err);
            })
    }

    function addFile(file) {
        const isImage = file.type.match("image.*");
        
        const isVideo = file.type.match("video.*");

        const objectURL = URL.createObjectURL(file);

        const clone = {
            type: isImage ? 'image' : isVideo ? 'video' : 'file',
            filename: file.name,
            data: objectURL,
            content: `${file.size > 1024
                ? file.size > 1048576
                    ? Math.round(file.size / 1048576) + "mb"
                    : Math.round(file.size / 1024) + "kb"
                : file.size + "b"
                + isImage &&
                Object.assign(clone.querySelector("img"), {
                    src: objectURL,
                    alt: file.name
                })}`
        }

        return clone;

    }

    const handleOnChange = (e) => {
        setFiles(e.target.files);
        const newGallery = [];
        for (let file of e.target.files) {
            newGallery.push(addFile(file));
        }
        setGallery([...newGallery]);
    };


    const handleCancelClick = () => {
        setGallery([]);
        console.log('gallery', gallery);
    };

    const handleFileDeleteClick = (index) => {
        console.log("Clicked", index);
        setGallery([...gallery.slice(0,index), ...gallery.slice(index+1)]);
    }

    return (
        <div className="-mx-3 bg-primary text-primary p-5 flex flex-col">
            <label className="block uppercase tracking-wide text-grey-darker text-xl text-center font-bold mb-2"
                htmlFor="grid-state">
                Upload File
                                </label>
            {/* <!-- scroll area --> */}
            <main className="container mx-auto max-w-screen-lg h-full">
                {/* <!-- file upload modal --> */}
                <article aria-label="File Upload Modal" className="relative h-full flex flex-col">

                    {/* <!-- scroll area --> */}
                    <section className="h-full overflow-auto py-8 px-2 w-full h-full flex flex-col">
                        <header
                            className="border-dashed border-2 border-gray-400 py-12 flex flex-col justify-center items-center">
                            <p
                                className="mb-3 font-semibold text-gray-900 flex flex-wrap justify-center">
                                <span>Drag and drop your</span>&nbsp;<span>files anywhere
                                                        or</span>
                            </p>
                            <input id="hidden-input" type="file" multiple className="hidden" onChange={handleOnChange}
                                name="files" capture />
                            <label id="button" htmlFor="hidden-input"
                                className="mt-2 rounded-sm px-3 py-1 cursor-pointer bg-secondary dark:hover:bg-gray-700 text-primary focus:shadow-outline">
                                Upload a file
                                                </label>
                        </header>

                        <p className="pt-8 pb-3 font-semibold sm:text-md text-primary">
                            To Upload
                                            </p>

                        <ul id="gallery" className="flex flex-1 flex-wrap -m-1">
                            {
                                gallery.length === 0 ? <li id="empty"
                                    className="h-full w-full text-center flex flex-col items-center justify-center items-center">
                                    <img className="mx-auto w-32"
                                        src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png"
                                        alt="no data" />
                                    <span className="text-small text-primary">No files selected</span>
                                </li> :
                                    gallery.map((file, i) => {
                                        if (file.type === 'image') {
                                            return <ImageTempl filename={file.filename} deleteClick={handleFileDeleteClick} data={file.data} content={file.content} key={i} id={i} />
                                        } else {
                                            return <FileTempl filename={file.filename} deleteClick={handleFileDeleteClick} data={file.data} content={file.content} key={i} id={i} />
                                        }
                                    })
                            }
                        </ul>
                    </section>

                    {/* <!-- sticky footer --> */}
                    <footer className="flex justify-end px-8 pb-8 pt-4">
                        <button id="cancel"
                            onClick={handleCancelClick}
                            className="rounded-sm px-3 py-1 bg-blue-700 hover:bg-blue-500 text-white focus:shadow-outline focus:outline-none mr-2">
                            Clear
                            </button>
                        <button
                            onClick={onSubmit}
                            className="rounded-sm px-3 py-1 bg-green-700 hover:bg-green-500 text-white focus:shadow-outline focus:outline-none mr-2">
                            {
                                loading ? <i className="fas fa-circle-notch fa-spin fa-1x" /> : "Send"
                            }
                        </button>
                        <button
                            onClick={close}
                            className="rounded-sm px-3 py-1 bg-red-700 hover:bg-red-500 text-white focus:shadow-outline focus:outline-none">
                            Close
                                            </button>
                    </footer>
                </article>
            </main>
        </div>
    )
}

export default UploadPopup;