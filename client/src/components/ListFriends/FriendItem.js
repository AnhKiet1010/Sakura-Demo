import { formatTime } from '../../helpers/format';

function FriendItems({ avatar, name, lastTime, lastMess, active, handleOnClick, unReadMess }) {
    var time = new Date(lastTime);
    return (
        <div onClick={handleOnClick} className={`w-full flex items-start py-2 hover:bg-secondary px-4 cursor-pointer ${active && "bg-secondary"}`}>
            <div className="m-1 mr-2 w-12 h-12 relative flex justify-center items-center rounded-full text-xl text-white">
                <img src={avatar} className="rounded-full" alt="avatar" />
                {/* <div className="absolute right-0.5 top-0.5 w-2.5 h-2.5 rounded-full bg-green-500" /> */}
            </div>
            <div className="flex-1 flex flex-col">
                <span className="font-bold opacity-90 my-1">{name}</span>
                <div className="text-xs opacity-60 truncate" style={{maxWidth: "120px"}}>{lastMess}</div>
            </div>
            <div className="flex flex-col justify-between items-end">
                <span className="text-gray-600 opacity-90 my-2 text-xs">{formatTime(time)}</span>
                { unReadMess !== 0 && <span className="inline-flex items-center justify-center px-2 py-1 mr-2 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">{unReadMess < 5 ? unReadMess : "5+"}</span> }
            </div>
        </div>
    );
}

export default FriendItems;