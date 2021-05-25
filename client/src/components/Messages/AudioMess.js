import { formatTime } from '../../helpers/format';


function AudioMess({ src, avatar, seen, time }) {

    const calcTime = formatTime(time);

    return (
        <div className="flex justify-start items-start text-sm mb-3">
            <img src={avatar} className="w-10 h-10 rounded mr-3" alt="avatar" />
            <div className="flex items-end">
                <audio controls title="Advertisement"
                    webkit-playsinline="true"
                    playsInline={true}>
                    <source src={src} type="audio/mp4" />
                    Your browser does not support the audio tag.
            </audio>
                <div className="flex flex-col ml-3 mb-1">
                    {seen && <span className="text-gray-200 text-xs">✔</span>}
                    <span className="text-gray-500 text-xs">{calcTime}</span>
                </div>
            </div>
        </div>
    );
}

export default AudioMess;