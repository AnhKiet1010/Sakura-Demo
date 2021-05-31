import Popup from "reactjs-popup";
import 'reactjs-popup/dist/index.css';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import { formatTime } from '../../helpers/format';
import ShowImg from '../ShowImg';


function SelfImgMess({ images, seen, time, slideImages }) {
    const calcTime = formatTime(time);

    return (
        <>

            <div className="flex justify-end mb-4">
                <span className="text-gray-500 text-xs mx-2">{calcTime}</span>
                {seen && <span className="text-gray-200 text-xs mx-2">✔</span>}
            </div>
            <div className="flex flex-row-reverse justify-start items-end text-sm">
                <ul className="flex flex-wrap -mx-4 mb-1 flex-row-reverse w-4/5">
                    {
                        images.map((img, i) => {
                            return <Popup key={i} className="my-slide-popup" modal trigger={
                                <li className="md:w-1/4 px-4 mb-1" key={i}>
                                    <LazyLoadImage alt="upload preview" src={img}
                                        className="rounded shadow-md h-full w-full object-cover cursor-pointer" style={{ background: "#d1dcf5" }} />
                                </li>
                            }>
                                {close => <ShowImg slideImages={slideImages} onClose={close} currentImg={img} />}
                            </Popup>
                        })
                    }
                </ul>
            </div>
        </>
    )
}

export default SelfImgMess;