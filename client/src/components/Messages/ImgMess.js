import Popup from "reactjs-popup";
import 'reactjs-popup/dist/index.css';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import ShowImg from '../ShowImg';
import { formatTime } from '../../helpers/format';

function SelfImgMess({ images, seen, time, avatar, slideImages }) {

    const calcTime = formatTime(time);

    return (
        <>

            <div className="flex justify-start items-start text-sm">
                <img src={avatar} className="w-10 h-10 rounded-full mr-3" alt="avatar" />
                <div>
                    <ul className="flex flex-wrap -mx-4 mb-1">
                    {
                        images.map((img, i) => {
                            return <Popup key={i} className="my-slide-popup" modal trigger={
                                <li className="md:w-1/4 px-4 mb-1" key={i}>
                                        <LazyLoadImage alt="upload preview" src={img}
                                            className="rounded shadow-md h-full w-full object-cover overflow-hidden cursor-pointer" />
                                </li>
                            }>
                                {close => <ShowImg slideImages={slideImages} onClose={close} currentImg={img} />}
                            </Popup>
                        })
                    }
                    </ul>
                    <div className="flex flex-row mb-4">
                        {seen && <span className="text-gray-200 text-xs">✔</span>}
                        <span className="text-gray-500 text-xs mx-2">{calcTime}</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SelfImgMess;