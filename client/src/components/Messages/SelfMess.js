
import { useEffect, useState } from 'react';
import socket from '../../helpers/socketConnect';
import { formatTime, formatText } from '../../helpers/format';
import { LoveIcon, AngryIcon, SadIcon, LikeIcon, SurpriseIcon, HeartIcon, CheckIcon } from '../../icons';

function Self({ messId, text, seen, time, react }) {
    const [showReact, setShowReact] = useState(false);
    const [ currentReact, setCurrentReact] = useState("");

    const calcTime = formatTime(time);

    const handleClickReact = (reactIndex) => {
        socket.emit("SendReact", {messId, react: reactIndex});
        setShowReact(false);
    }

    useEffect(() => {
        setCurrentReact(react);
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
        <div className="w-full mb-8 flex flex-row-reverse">
            <div className="relative flex justify-start items-end text-sm cursor-pointer max-w-max"
                onMouseEnter={() => setShowReact(true)}
                onMouseLeave={() => setShowReact(false)}
            >

                <div className={`flex flex-col items-end ${showReact && "hidden"}`}>
                    {seen && <span className="text-gray-200 text-xs mx-2">
                            <CheckIcon className="w-3" />
                        </span>}
                    <span className="text-gray-500 text-xs mx-2">{calcTime}</span>
                </div>
                <div className={`flex mr-2 bg-secondary py-2 px-4 rounded-lg ${!showReact && "hidden"}`}>
                    <div onClick={() => handleClickReact("1")}><LoveIcon className="react-icon w-5 h-5 mx-1 hover:opacity-50 cursor-pointer" /></div>
                    <div onClick={() => handleClickReact("2")}><AngryIcon className="react-icon w-5 h-5 mx-1 hover:opacity-50 cursor-pointer" /></div>
                    <div onClick={() => handleClickReact("3")}><SadIcon className="react-icon w-5 h-5 mx-1 hover:opacity-50 cursor-pointer" /></div>
                    <div onClick={() => handleClickReact("4")}><SurpriseIcon className="react-icon w-5 h-5 mx-1 hover:opacity-50 cursor-pointer" /></div>
                    <div onClick={() => handleClickReact("5")}><HeartIcon className="react-icon w-5 h-5 mx-1 hover:opacity-50 cursor-pointer" /></div>
                    <div onClick={() => handleClickReact("6")}><LikeIcon className="react-icon w-5 h-5 mx-1 hover:opacity-50 cursor-pointer" /></div>
                </div>
                {
                    currentReact !== "" &&
                    <div className="absolute -bottom-5 right-0">
                        <div className="flex bg-green-200 p-0.5 border-2 dark:border-gray-700 border-white rounded-2xl"  onClick={() => handleClickReact("")}>
                            { currentReact === "1" && <LoveIcon className="react-icon w-4 h-4 mx-1 hover:opacity-50 cursor-pointer" />}
                            { currentReact === "2" && <AngryIcon className="react-icon w-4 h-4 mx-1 hover:opacity-50 cursor-pointer" />}
                            { currentReact === "3" && <SadIcon className="react-icon w-4 h-4 mx-1 hover:opacity-50 cursor-pointer" />}
                            { currentReact === "4" && <SurpriseIcon className="react-icon w-4 h-4 mx-1 hover:opacity-50 cursor-pointer" />}
                            { currentReact === "5" && <HeartIcon className="react-icon w-4 h-4 mx-1 hover:opacity-50 cursor-pointer" />}
                            { currentReact === "6" && <LikeIcon className="react-icon w-4 h-4 mx-1 hover:opacity-50 cursor-pointer" />}
                        </div>
                    </div>
                }

                <div className="text-gray-800 leading-normal bg-green-200 rounded-lg px-4 py-3 m-0 max-w-lg">
                    {formatText(text)}
                </div>
            </div>
        </div>
    )
}

export default Self;