import { useEffect, useState } from 'react';
import socket from '../../helpers/socketConnect';
import { useSelector, useDispatch } from 'react-redux';
import { formatTime, formatText } from '../../helpers/format';
import { LoveIcon, AngryIcon, SadIcon, LikeIcon, SurpriseIcon, HeartIcon, CheckIcon } from '../../icons';
import API from '../../api/API';
import { setTouchingMess } from '../../slices/touchingMessSlice';
import ImgMess from './ImgMess';
import handleMessClickOutside from '../../helpers/handleMessClickOutside';

function TypeText({ mess, slideImages }) {
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.currentUser);
    const [replyMess, setReplyMess] = useState({});
    const { messRef, showReact, setShowReact } = handleMessClickOutside(false);
    const touchingMess = useSelector(state => state.touchingMess);
    const isMobile = useSelector(state => state.isMobile);

    const calcTime = formatTime(mess.time);

    const handleClickReact = (reactIndex) => {
        socket.emit("SendReact", { messId: mess._id, react: reactIndex, id: currentUser._id });
        setShowReact(false);
    }


    function handleMessClick() {
        setShowReact(!showReact);
        if (touchingMess.showEditPanel) {
            let action = setTouchingMess({ mess: {}, showEditPanel: false, self: false });
            dispatch(action);
        } else {
            let action = setTouchingMess({ mess, showEditPanel: true, self: false });
            dispatch(action);
        }
    }

    useEffect(() => {
        async function getReply() {
            if (mess.reply && mess.reply !== "") {
                await API.messagesDetail({ id: mess.reply })
                    .then(res => {
                        setReplyMess(res.data.data.mess);
                    });
            }
        }
        getReply();
    }, [mess]);

    return (
        <div className="flex items-start mb-8 text-sm">
            <img src={currentUser.avatar} className="w-10 h-10 rounded-full mr-3 object-cover" alt="avatar" />
            <div className={`relative flex items-end ${mess.type !== 'image' && "text-mess-frame"}`} >
                <div className={`relative text-gray-800 leading-normal bg-gray-200 dark:bg-gray-300 rounded-lg ${mess.type !== 'image' && "px-4 py-3"} m-0 cursor-pointer max-w-md`}
                    onClick={handleMessClick}
                    ref={messRef}
                >
                    {
                        mess.reply !== "" &&
                        <div className="bg-gray-300 dark:bg-gray-400 text-primary w-full rounded-lg px-4 py-2 mb-2 opacity-70">
                            <div className="border-l-2 border-blue-600 pl-2 text-sm w-full">
                                <div className="flex items-center">
                                    <span className="font-bold"></span>{replyMess.author !== currentUser._id ? <span className='font-bold'>You</span> : <span className='font-bold'>{currentUser.name}</span>}
                                </div>
                                <div className={`text-primary opacity-75 italic text-sm truncate ${isMobile ? "w-44" : "max-w-md"}`}>{replyMess.content}</div>
                            </div>
                        </div>
                    }
                    {
                        mess.type === "image"
                            ?
                            <ImgMess img={mess.img} slideImages={slideImages} />
                            :
                            formatText(mess.content)
                    }
                    {
                        mess.react !== "" && <div className="absolute -bottom-5 right-0" onClick={() => handleClickReact("")}>
                            <div className="flex bg-gray-200 p-0.5 border-2 dark:border-gray-700 border-white rounded-full">
                                {mess.react === "1" && <LoveIcon className="react-icon w-4 h-4 mx-1 hover:opacity-50 cursor-pointer" />}
                                {mess.react === "2" && <AngryIcon className="react-icon w-4 h-4 mx-1 hover:opacity-50 cursor-pointer" />}
                                {mess.react === "3" && <SadIcon className="react-icon w-4 h-4 mx-1 hover:opacity-50 cursor-pointer" />}
                                {mess.react === "4" && <SurpriseIcon className="react-icon w-4 h-4 mx-1 hover:opacity-50 cursor-pointer" />}
                                {mess.react === "5" && <HeartIcon className="react-icon w-4 h-4 mx-1 hover:opacity-50 cursor-pointer" />}
                                {mess.react === "6" && <LikeIcon className="react-icon w-4 h-4 mx-1 hover:opacity-50 cursor-pointer" />}
                            </div>
                        </div>
                    }
                </div>
                {
                    showReact &&
                    <div className={`absolute flex mr-2 bg-secondary py-2 px-1 rounded-lg -top-10 left-0 z-10`} ref={messRef}>
                        <div onClick={() => handleClickReact("1")}><LoveIcon className="react-icon w-6 h-6 mx-1 hover:opacity-50 cursor-pointer" /></div>
                        <div onClick={() => handleClickReact("2")}><AngryIcon className="react-icon w-6 h-6 mx-1 hover:opacity-50 cursor-pointer" /></div>
                        <div onClick={() => handleClickReact("3")}><SadIcon className="react-icon w-6 h-6 mx-1 hover:opacity-50 cursor-pointer" /></div>
                        <div onClick={() => handleClickReact("4")}><SurpriseIcon className="react-icon w-6 h-6 mx-1 hover:opacity-50 cursor-pointer" /></div>
                        <div onClick={() => handleClickReact("5")}><HeartIcon className="react-icon w-6 h-6 mx-1 hover:opacity-50 cursor-pointer" /></div>
                        <div onClick={() => handleClickReact("6")}><LikeIcon className="react-icon w-6 h-6 mx-1 hover:opacity-50 cursor-pointer" /></div>
                    </div>
                }
                <div className={`flex flex-col items-start`}>
                    {mess.seen && <span className="text-gray-200 text-xs mx-2">
                        <CheckIcon className="w-3" />
                    </span>}
                    <span className="text-gray-500 text-xs mx-2">{calcTime}</span>
                </div>
            </div>
        </div>
    );
}

export default TypeText;