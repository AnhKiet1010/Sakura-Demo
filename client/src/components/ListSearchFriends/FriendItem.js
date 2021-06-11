import { useSelector } from 'react-redux';
import { AddIcon, CheckedIcon } from '../../icons';
import { useState } from 'react';
import socket from '../../helpers/socketConnect';

function FriendItems({ frId, avatar, name, online, last }) {
    const user = useSelector(state => state.user);
    const [sended, setSended] = useState(false);

    function handleOnClick() {
        setSended(true);
        socket.emit('UserSendRequestFriend', {fromId: user.id, toId: frId});
    }

    return (
        <div className={`w-full flex items-center ${!last && "border-b"} py-2 hover:bg-secondary px-4 cursor-pointer`}>
            <div className="m-1 mr-2 w-12 h-12 relative flex justify-center items-center rounded-full text-xl text-white">
                <img src={avatar} className={`rounded-full ${online && "border border-green-500"} object-cover object-center w-full h-full`} alt="avatar" />
                {online && <div className="absolute right-0.5 top-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border" />}
            </div>
            <div className="flex-1 flex flex-col justify-center h-full my-auto">
                <span className={`font-bold opacity-90 h-full mb-1`}>{name}</span>
            </div>
            {
                sended ?
                    <div className="flex items-center border border-color-green-400 p-2 text-sm rounded-xl bg-white text-green-600 hover:opacity-70  animate__animated animate__fadeIn">
                        <CheckedIcon className="w-3 h-3 fill-current mr-2" /> Invited
                    </div> :
                    <div className="flex items-center border border-color-white p-2 text-sm rounded-xl bg-secondary hover:opacity-70"  onClick={handleOnClick}>
                        <AddIcon className="w-3 h-3 fill-current mr-2" /> Add friend
                    </div>
            }
        </div>
    );
}

export default FriendItems;