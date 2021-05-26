import Popup from "reactjs-popup";
import 'reactjs-popup/dist/index.css';
import { formatTime } from '../../helpers/format';
import ShowImg from '../ShowImg';

function SelfImgMess({ images, seen, time }) {

    const calcTime = formatTime(time);

    return (
        <>

            <div className="flex justify-end mb-4">
                <span className="text-gray-500 text-xs mx-2">{calcTime}</span>
                {seen && <span className="text-gray-200 text-xs mx-2">✔</span>}
            </div>
            <div className="flex flex-row-reverse justify-start items-end text-sm">
                <ul className="flex flex-wrap -mx-4 mb-1 flex-row-reverse w-4/5 h-4/5">
                    {
                        images.map((img, i) => {
                            return <Popup key={i} modal trigger={
                                <li className="md:w-1/4 px-4 mb-1" key={i}>
                                    <div className="overflow-hidden rounded w-full shadow-md cursor-pointer">
                                        <img alt="upload preview" src={img}
                                            className="rounded shadow-md h-full w-full object-cover transform transition duration-500 hover:scale-110" />
                                    </div>
                                </li>
                            }>
                                {<ShowImg img={img} />}
                            </Popup>
                        })
                    }
                </ul>
            </div>
        </>
    )
}

export default SelfImgMess;