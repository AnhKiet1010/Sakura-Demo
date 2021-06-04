import { useEffect, useState } from 'react';
import { formatTime } from '../../helpers/format';
import { useSelector } from 'react-redux';

function FriendItems({ frId, avatar, name, lastTime, lastMess, handleOnClick, unReadMess, online }) {
    const typing = useSelector(state => state.typing);
    const currentUser = useSelector(state => state.currentUser);

    return (
        <div onClick={handleOnClick} className={`w-full flex items-center py-2 hover:bg-secondary px-4 cursor-pointer ${currentUser._id === frId && "bg-secondary"}`}>
            <div className="m-1 mr-2 w-12 h-12 relative flex justify-center items-center rounded-full text-xl text-white">
                <img src={avatar} className={`rounded-full border ${online ? "border-green-500" : "border-gray-300"} object-cover object-center w-full h-full`} alt="avatar" />
                { online && <div className="absolute right-0.5 top-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border" /> }
            </div>
            <div className="flex-1 flex flex-col justify-center h-full my-auto">
                <span className={`font-bold opacity-90 h-full mb-1`}>{name}</span>
                <div className="text-xs opacity-60 truncate" style={{maxWidth: "120px"}}>{
                    typing.id === frId ? name + " is typing..." :  lastMess
                }</div>
            </div>
            <div className="flex flex-col justify-center items-center">
                {!unReadMess && <span className="text-primary opacity-90 mt-1 text-xs opacity-10" style={{maxWidth: '50px'}}>{formatTime(lastTime)}</span>}
                { unReadMess !== 0 && <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">{unReadMess < 5 ? unReadMess : "5+"}</span> }
            </div>
        </div>
    );
}

export default FriendItems;