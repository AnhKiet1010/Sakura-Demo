import { formatTime } from '../../helpers/format';

function Self({ link, seen, time }) {

    const calcTime = formatTime(time);

    return (
        <div className="flex flex-row-reverse justify-start rounded-md items-end mb-4 text-sm">
            <video controls poster="/images/w3html5.gif" className="w-2/4 rounded-md">
                <source src={link} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="flex flex-col items-end">
                {seen && <span className="text-gray-200 text-xs mx-2">✔</span>}
                <span className="text-gray-500 text-xs mx-2">{calcTime}</span>
            </div>
        </div>
    )
}

export default Self;