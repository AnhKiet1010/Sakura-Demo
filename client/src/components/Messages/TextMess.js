import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { formatTime, formatText } from '../../helpers/format';
import socket from '../../helpers/socketConnect';
import { LoveIcon, AngryIcon, SadIcon, LikeIcon, SurpriseIcon, HeartIcon, CheckIcon, ReplyLeftIcon, EditIcon, RecallIcon, MoreIcon, CancelIcon } from '../../icons';
import API from '../../api/API';

function TypeText({ messId, avatar, seen, time, text, react, handleReply, reply }) {
    const [showReact, setShowReact] = useState(false);
    const [currentReact, setCurrentReact] = useState("");
    const [replyMess, setReplyMess] = useState({});
    const currentUser = useSelector(state => state.currentUser);
    const [onHoverReaction, setOnHoverReaction] = useState(false);

    const calcTime = formatTime(time);

    const handleClickReact = (reactIndex) => {
        socket.emit("SendReact", { messId, react: reactIndex });
        setShowReact(false);
    }

    useEffect(async () => {
        setCurrentReact(react);

        if (reply && reply !== "") {
            console.log("reply", reply);
            await API.messagesDetail({ id: reply })
                .then(res => {
                    console.log("result", res);
                    setReplyMess(res.data.data.mess);
                });
        }
    }, [messId]);

    useEffect(() => {

        socket.on("ChangeReact", data => {
            console.log('data', data);
            setCurrentReact(data.react);
        });

        return () => {
            socket.off("ChangeReact");
        }
    });

    return (
        <div className="flex items-start mb-8 text-sm">
            <img src={avatar} className="w-10 h-10 rounded-full mr-3" alt="avatar" />
            <div className="relative flex items-end text-mess-frame"
                onMouseEnter={() => setShowReact(true)}
                onMouseLeave={() => { setShowReact(false); setOnHoverReaction(false) }}
            >
                <div className="relative text-gray-800 leading-normal bg-gray-200 dark:bg-gray-300 rounded-lg px-4 py-3 m-0 max-w-lg">
                    {
                        reply !== "" &&
                        <div className="bg-gray-300 dark:bg-gray-400 text-primary rounded-lg px-6 py-2 mb-2">
                            <div className="border-l-2 border-blue-600 pl-2">
                                <div className="flex items-center">
                                    Reply to <span className="font-bold mx-2">{currentUser.name}</span>
                                </div>
                                <div className="text-primary opacity-75">{replyMess.content}</div>
                            </div>
                        </div>
                    }
                    {formatText(text)}
                    {
                        currentReact !== "" && <div className="absolute -bottom-5 right-0" onClick={() => handleClickReact("")}>
                            <div className="flex bg-gray-200 p-0.5 border-2 dark:border-gray-700 border-white rounded-full">
                                {currentReact === "1" && <LoveIcon className="react-icon w-4 h-4 mx-1 hover:opacity-50 cursor-pointer" />}
                                {currentReact === "2" && <AngryIcon className="react-icon w-4 h-4 mx-1 hover:opacity-50 cursor-pointer" />}
                                {currentReact === "3" && <SadIcon className="react-icon w-4 h-4 mx-1 hover:opacity-50 cursor-pointer" />}
                                {currentReact === "4" && <SurpriseIcon className="react-icon w-4 h-4 mx-1 hover:opacity-50 cursor-pointer" />}
                                {currentReact === "5" && <HeartIcon className="react-icon w-4 h-4 mx-1 hover:opacity-50 cursor-pointer" />}
                                {currentReact === "6" && <LikeIcon className="react-icon w-4 h-4 mx-1 hover:opacity-50 cursor-pointer" />}
                            </div>
                        </div>
                    }
                    {
                        showReact &&
                        <div className="absolute -top-2 -right-2">
                            <div className=" bg-red-500 p-1 rounded-full w-5 h-5 flex items-center justify-center text-white" onClick={() => handleClickReact("")}>
                                <CancelIcon className="react-icon w-2 h-2 hover:opacity-50 cursor-pointer fill-current" />
                            </div>
                        </div>
                    }
                </div>
                <div className={`flex ${!showReact && "hidden"}`}>
                    <div className={`flex ml-2 bg-secondary py-2 px-1 rounded-lg overflow-hidden`}>
                        <div onClick={() => setOnHoverReaction(!onHoverReaction)}>
                            {
                                onHoverReaction ?
                                    <CancelIcon className="react-icon w-5 h-5 mx-1 fill-current hover:text-blue-500 cursor-pointer" />
                                    :
                                    <MoreIcon className="react-icon w-5 h-5 mx-1 hover:text-blue-500 cursor-pointer" />
                            }
                        </div>
                        {
                            onHoverReaction &&
                            <>
                                <div onClick={() => handleClickReact("1")}><LoveIcon className="react-icon w-5 h-5 mx-1 hover:opacity-50 cursor-pointer" /></div>
                                <div onClick={() => handleClickReact("2")}><AngryIcon className="react-icon w-5 h-5 mx-1 hover:opacity-50 cursor-pointer" /></div>
                                <div onClick={() => handleClickReact("3")}><SadIcon className="react-icon w-5 h-5 mx-1 hover:opacity-50 cursor-pointer" /></div>
                                <div onClick={() => handleClickReact("4")}><SurpriseIcon className="react-icon w-5 h-5 mx-1 hover:opacity-50 cursor-pointer" /></div>
                                <div onClick={() => handleClickReact("5")}><HeartIcon className="react-icon w-5 h-5 mx-1 hover:opacity-50 cursor-pointer" /></div>
                                <div onClick={() => handleClickReact("6")}><LikeIcon className="react-icon w-5 h-5 mx-1 hover:opacity-50 cursor-pointer" /></div>
                            </>
                        }
                    </div>
                    <div className="ml-2">
                        <div className={`bg-secondary rounded-lg text-3xl text-primary p-2 focus:outline-none cursor-pointer`} onClick={() => handleReply(messId, text)}>
                            <ReplyLeftIcon className="react-icon fill-current h-5 w-5 block hover:text-blue-500" />
                        </div>
                    </div>
                    <div className="ml-2">
                        <div className={`bg-secondary rounded-lg text-3xl text-primary p-2 focus:outline-none cursor-pointer`} onClick={() => handleReply(messId, text)}>
                            <EditIcon className="react-icon fill-current h-5 w-5 block hover:text-blue-500" />
                        </div>
                    </div>
                    <div className="ml-2">
                        <div className={`bg-secondary rounded-lg text-3xl text-primary p-2 focus:outline-none cursor-pointer`} onClick={() => handleReply(messId, text)}>
                            <RecallIcon className="react-icon fill-current h-5 w-5 block hover:text-blue-500" />
                        </div>
                    </div>
                </div>
                <div className={`flex flex-col items-start ${showReact && "hidden"}`}>
                    {seen && <span className="text-gray-200 text-xs mx-2">
                        <CheckIcon className="w-3" />
                    </span>}
                    <span className="text-gray-500 text-xs mx-2">{calcTime}</span>
                </div>
            </div>
        </div>
    );
}

export default TypeText;