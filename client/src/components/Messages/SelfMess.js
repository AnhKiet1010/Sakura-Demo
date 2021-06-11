
import { useEffect, useState } from 'react';
import socket from '../../helpers/socketConnect';
import { useSelector, useDispatch } from 'react-redux';
import { formatTime, formatText } from '../../helpers/format';
import { LoveIcon, AngryIcon, SadIcon, LikeIcon, SurpriseIcon, HeartIcon, CheckIcon } from '../../icons';
import API from '../../api/API';
import { setTouchingMess } from '../../slices/touchingMessSlice';
import ImgMess from './ImgMess';
import handleMessClickOutside from '../../helpers/handleMessClickOutside';

function Self({ mess }) {
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.currentUser);
    const user = useSelector(state => state.user);
    const [replyMess, setReplyMess] = useState({});
    const { messRef, showReact, setShowReact } = handleMessClickOutside(false);
    const touchingMess = useSelector(state => state.touchingMess);
    const isMobile = useSelector(state => state.isMobile);

    const calcTime = formatTime(mess.time);

    const handleClickReact = (reactIndex) => {
        console.log("Clicked");
        socket.emit("SendReact", { messId: mess._id, react: reactIndex, id: currentUser._id });
        setShowReact(false);
    }


    function handleMessClick() {
        setShowReact(!showReact);
        if (touchingMess.showEditPanel) {
            let action = setTouchingMess({ mess: {}, showEditPanel: !touchingMess.showEditPanel, self: false });
            dispatch(action);
        } else {
            let action = setTouchingMess({ mess, showEditPanel: true, self: true });
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
        <div className="w-full mb-8 flex flex-row-reverse">
            <div className={`relative flex justify-start items-end text-sm max-w-max ${mess.type !== 'image' && "self-mess-frame"}`}>

                <div className={`flex mr-2 flex-col items-end`}>
                    {mess.seen && <span className="text-gray-200 text-xs">
                        <CheckIcon className="w-3" />
                    </span>}
                    <span className="text-gray-500 text-xs">{calcTime}</span>
                </div>
                <div className={`absolute right-0 z-10 -top-10 flex flex-row items-end ${!showReact && "hidden"}`} ref={messRef}>
                    <div className={`flex mr-2 bg-secondary py-2 px-1 rounded-lg ${!showReact && "hidden"} overflow-hidden`}>
                        {
                            showReact &&
                            <>
                                <div onClick={() => handleClickReact("1")}><LoveIcon className="react-icon w-6 h-6 mx-1 hover:opacity-50 cursor-pointer" /></div>
                                <div onClick={() => handleClickReact("2")}><AngryIcon className="react-icon w-6 h-6 mx-1 hover:opacity-50 cursor-pointer" /></div>
                                <div onClick={() => handleClickReact("3")}><SadIcon className="react-icon w-6 h-6 mx-1 hover:opacity-50 cursor-pointer" /></div>
                                <div onClick={() => handleClickReact("4")}><SurpriseIcon className="react-icon w-6 h-6 mx-1 hover:opacity-50 cursor-pointer" /></div>
                                <div onClick={() => handleClickReact("5")}><HeartIcon className="react-icon w-6 h-6 mx-1 hover:opacity-50 cursor-pointer" /></div>
                                <div onClick={() => handleClickReact("6")}><LikeIcon className="react-icon w-6 h-6 mx-1 hover:opacity-50 cursor-pointer" /></div>
                            </>
                        }
                    </div>
                </div>

                <div className={`relative text-gray-800 leading-normal cursor-pointer bg-green-200 rounded-lg ${mess.type !== 'image' && "px-4 py-3"} m-0 `}
                    onClick={handleMessClick}
                    ref={messRef}
                >
                    {
                        mess.reply !== "" &&
                        <div className="bg-green-400 dark:bg-green-500 text-primary rounded-lg px-4 py-2 mb-2 opacity-70">
                            <div className="border-l-2 border-blue-600 pl-2">
                                <div className="flex items-center">
                                    <span className="font-bold">{replyMess.author === user.id ? "You" : currentUser.name}</span>
                                </div>
                                <div className={`text-primary opacity-75 italic truncate ${isMobile ? "w-52" : "max-w-md"}`}>{replyMess.content}</div>
                            </div>
                        </div>
                    }
                    {
                        mess.type === "image"
                            ?
                            <ImgMess img={mess.img} />
                            :
                            formatText(mess.content)
                    }
                    {
                        mess.react !== "" &&
                        <div className="absolute -bottom-5 right-0 block">
                            <div className="flex bg-green-200 p-0.5 border-2 dark:border-gray-700 border-white rounded-2xl" onClick={() => { handleClickReact(""); setShowReact(false) }}>
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
            </div>
        </div>
    )
}

export default Self;