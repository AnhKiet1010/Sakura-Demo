import { formatTime } from '../../helpers/format';

function SelfImgMess({ images, seen, time, avatar }) {

    const calcTime = formatTime(time);

    return (
        <>

            <div className="flex justify-start items-start text-sm">
                <img src={avatar} className="w-10 h-10 rounded-full mr-3" alt="avatar" />
                <div>
                    <ul className="flex flex-wrap -mx-4 mb-1">
                        {
                            images.map((img, i) => {
                                return <li className="md:w-1/4 px-4 mb-1" key={i}>
                                    <div className="overflow-hidden rounded shadow-md">
                                        <img alt="upload preview" src={img}
                                            className="transform transition duration-500 hover:scale-110" />
                                    </div>
                                </li>
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