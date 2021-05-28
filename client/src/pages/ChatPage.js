import React, { useEffect, useState, useContext } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { ToastContainer, toast } from 'react-toastify';
import Popup from "reactjs-popup";
import 'reactjs-popup/dist/index.css';
import 'react-toastify/dist/ReactToastify.css';
import ResizePanel from "react-resize-panel";

import API from '../api/API';

import { ThemeContext } from '../components/themeContext';
import InfiniteScroll from '../components/InfiniteScroll';
import ListFriends from '../components/ListFriends';
import Loading from '../components/Loading';
import audio from "../assets/audio/like.wav";
import UploadPopup from '../components/UploadPopup';
import socket from '../helpers/socketConnect';
import { LightIcon, DarkIcon, PlusIcon, MicIcon, MenuIcon, CancelIcon, SearchIcon } from '../icons';

const envLimit = parseInt(process.env.REACT_APP_MESS_PER_LOAD);


function ChatPage() {
    const { theme, setTheme } = useContext(ThemeContext);
    const [listFriends, setListFriends] = useState([]);
    const [listMessages, setListMessages] = useState([]);
    const [currentUser, setCurrentUser] = useState({});
    const [reply, setReply] = useState("");
    const [loadingBottom, setLoadingBottom] = useState(false);
    const [loadingTop, setLoadingTop] = useState(false);
    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(envLimit);
    const [hasMoreTop, setHasMoreTop] = useState(true);
    const [hasMoreBot, setHasMoreBot] = useState(true);
    const [loadingMess, setLoadingMess] = useState(false);
    const [loadingFr, setLoadingFr] = useState(false);
    const [isChangeData, setIsChangeData] = useState(false);
    const [profileHide, setProfileHide] = useState(true);
    const [word, setWord] = useState("");
    const [dataIndex, setDataIndex] = useState([]);
    const messAudio = new Audio(audio);

    useEffect(() => {
        socket.on("UserSendMess", data => {
            if (currentUser.lineId !== data.id || data.id !== 'channel') {
                messAudio.play();
                changeData();
            }
            return false;
        });

        socket.on("OnChangeListMessBySearch", data => {
            console.log("listIndex", data.listIndex);
            setDataIndex(data.listIndex);
            if (data.listIndex.length > 0) {
                setSkip(data.listIndex[0]);
                changeData();
            }
        });

        return () => {
            socket.off("UserSendMess");
            socket.off("OnChangeListMessBySearch");
        }
    });


    function isDark() {
        return theme === "dark";
    }

    async function updateListMess(id, limit, skip) {
        const body = { id, limit, skip };
        await API.getListMessages(body)
            .then(res => {
                console.log(res.data.data);
                const { listMess, hasMoreTop, hasMoreBot } = res.data.data;
                setListMessages(listMess);
                setHasMoreTop(hasMoreTop);
                setHasMoreBot(hasMoreBot);
            });
        setLoadingMess(false);
        setLoadingBottom(false);
        setLoadingTop(false);
    }

    async function updateListFriend() {
        await API.getListFriend()
            .then(res => {
                if (res.data.error) {
                    toast.error(res.data.message);
                } else {
                    setListFriends(res.data.data.listFriends);
                }
            }).catch(err => {
                console.log(err);
            })
        setLoadingFr(false);
    }

    function onMessSearch(e) {
        setWord(e.target.value);
        socket.emit('SearchMess', e.target.value);
    }

    async function fetchMoreMess(to) {
        if (to === 'top') {
            console.log("fetchinggggg Top");
            setLoadingTop(true);
            setLimit(limit + envLimit);
        } else if (to === 'bot' && skip !== 0) {
            console.log("fetchinggggg Bot");
            setLoadingBottom(true);
            if(skip - envLimit > 0) {
                setSkip(skip - envLimit);
            } else {
                setSkip(0);
            }
        }
        changeData();
    }

    const onFriendClick = (user) => {
        setLoadingMess(true);
        setLimit(envLimit);
        setHasMoreTop(true);
        setHasMoreBot(false);
        setCurrentUser(user);
    }

    function changeData() {
        setIsChangeData(!isChangeData);
    }

    useEffect(() => {
        updateListMess(currentUser.lineId, limit, skip);
        updateListFriend();
    }, [currentUser, isChangeData]);

    useEffect(() => {
        document.title = "Sakura Chat";
        setLoadingFr(true);
        setLimit(envLimit);
        updateListFriend();
    }, []);


    function handleKeyPress(e) {
        if (e.nativeEvent.shiftKey) {
            if (e.nativeEvent.keyCode === 13) {
                return;
            }
        } else if (e.nativeEvent.keyCode === 13) {
            e.preventDefault();
            socket.emit("ChannelSendMess", {
                toId: currentUser.lineId,
                content: reply,
                type: "text"
            });
            setReply("");
        }
    }

    function onHideProfile() {
        setProfileHide(!profileHide);
    }

    return (
        <div className="font-sans antialiased h-screen w-full flex">
            <ToastContainer />
            <ResizePanel direction="e" className="border-r-2">
                <div className="relative z-10 bg-primary text-primary flex-none w-72 min-w-full pb-6 hidden md:block border-r-2 dark:border-gray-500">
                    <div className="mb-4 mt-3 px-4 flex justify-between items-center">
                        <div className="flex-auto">
                            <h1 className="font-semibold text-2xl leading-tight mb-1 truncate">Sakura Chat</h1>
                        </div>
                        <div>
                            <label htmlFor="toogleA" className="flex items-center cursor-pointer">
                                <div className="relative w-full">
                                    <input id="toogleA" type="checkbox" className="sr-only" onChange={e => setTheme(e.target.checked ? "dark" : "light")} checked={isDark()} />
                                    <div className="w-10 h-4 bg-gray-400 rounded-full shadow-inner" />
                                    <div className="dot absolute w-6 h-6 p-1 bg-primary text-primary rounded-full shadow -left-1 -top-1 transition flex items-center justify-center">
                                        {isDark() && <DarkIcon />}
                                        {!isDark() && <LightIcon />}
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="px-4 mb-2 text-white flex justify-between items-center">
                            <div className="relative w-full">
                                <input type="text" placeholder="Search..." className="border w-full border-grey rounded-lg pl-8 pr-4 py-2 text-gray-600 focus:outline-none" />
                                <div className="absolute top-3 right-3 pl-3 flex items-center justify-center">
                                    <SearchIcon className="fill-current text-gray-500 h-4 w-4" />
                                </div>
                            </div>
                        </div>
                        {loadingFr ? <Loading /> : <ListFriends listFriends={listFriends} currentUser={currentUser} onFriendClick={onFriendClick} />}
                    </div>
                </div>
            </ResizePanel>

            {
                currentUser.name !== undefined ? <>
                    <div className="flex-1 flex flex-col bg-primary w-full text-primary overflow-hidden">
                        <div className="border-b-2 bg-primary text-primary flex px-6 py-2 items-center flex-none">
                            <div className="flex items-center">
                                <div className="m-1 mr-2 w-16 h-16 relative flex justify-center items-center rounded-full bg-gray-500 text-xl">
                                    <img src={currentUser.avatar} className="rounded-full" alt="avatar" />
                                    {/* <div className="absolute right-0.5 top-0.5 w-2.5 h-2.5 rounded-full bg-green-500" /> */}
                                </div>
                                <div className="flex flex-col">
                                    <span className=" text-lg font-bold mb-1">{currentUser.name}</span>
                                    <span className="text-xs  opacity-60 truncate">{currentUser.email}</span>
                                </div>
                            </div>
                            <div className="ml-auto hidden md:block">
                                <div className="relative appearance-none">
                                    <input type="text" onChange={onMessSearch} placeholder="Search..." className="dark:text-gray-800 appearance-none border border-grey text-primary rounded-lg pl-8 pr-4 py-2 focus:outline-none" />
                                    <div className="absolute top-3 right-3 pl-3 flex items-center justify-center">
                                        <SearchIcon className="fill-current text-gray-500 h-4 w-4" />
                                    </div>
                                </div>
                            </div>
                            <button className={`text-xl ml-4 text-primary focus:outline-none -top-5 right-2 opacity-80 ${profileHide ? "hidden" : ""} hover:opacity-100`} onClick={onHideProfile}>
                                <MenuIcon className="fill-current h-6 w-6 block text-primary bg-primary hover:text-secondary" />
                            </button>
                        </div>

                        {
                            loadingMess ? <Loading /> : <InfiniteScroll
                                loading={false}
                                listMessages={listMessages}
                                fetchMoreMess={fetchMoreMess}
                                hasMoreTop={hasMoreTop}
                                hasMoreBot={hasMoreBot}
                                currentUser={currentUser}
                                word={word}
                                skip={skip}
                                loadingBottom={loadingBottom}
                                loadingTop={loadingTop}
                            />
                        }

                        <div className="flex flex-col">
                            <div className="flex bg-gray-300 dark:bg-gray-500 justify-start px-4">
                                <Popup modal trigger={
                                    <button className="text-3xl text-primary p-2 focus:outline-none">
                                        <PlusIcon className="h-7 w-7 block fill-current hover:text-secondary" />
                                    </button>
                                }>
                                    {close => <UploadPopup close={close} currentUser={currentUser} />}
                                </Popup>
                                <button className="text-3xl text-primary p-2 focus:outline-none">
                                    <MicIcon className="fill-current h-5 w-5 block hover:text-secondary" />
                                </button>
                            </div>
                            <TextareaAutosize
                                className="bg-primary text-primary w-full px-6 py-2 appearance-none focus:outline-none"
                                minRows={4}
                                placeholder={`Send message to ${currentUser.name}`}
                                onKeyDown={(e) => handleKeyPress(e)} onChange={(e) => {
                                    setReply(e.target.value);
                                }}
                                value={reply}
                            />
                        </div>
                    </div>

                    <div className={`bg-primary text-primary border-l-2 dark:border-gray-500 flex-none w-72 lg:w-96 py-6 ${profileHide ? "" : "hidden"}`}>
                        <div>
                            <div className="relative border-b-2 pb-8 flex flex-col items-center text-primary dark:border-gray-500">
                                <button className={`absolute text-xl text-primary p-2 focus:outline-none -top-3 right-3 ${profileHide ? "" : "hidden"} opacity-80 hover:opacity-100`}
                                    onClick={onHideProfile}>
                                    <CancelIcon className="fill-current h-6 w-6 block text-primary bg-primary hover:text-secondary" />
                                </button>
                                <img src={currentUser.avatar} alt="avatar" className="rounded-full w-60" />
                                <p className="text-3xl my-3 text-center">{currentUser.name}</p>
                                <p className="text-xl text-center">No pain no gain</p>
                            </div>
                            <div className="flex justify-between items-center px-6 py-2">
                                <div className="">Notes <span className="dark:text-gray-500 text-gray-400">0</span></div>
                                <Popup modal trigger={
                                    <button className="text-3xl text-primary p-2 focus:outline-none text-green-400">
                                        <PlusIcon className="h-7 w-7 block fill-current hover:text-secondary" />
                                    </button>
                                }>
                                    {close => <UploadPopup close={close} currentUser={currentUser} />}
                                </Popup>
                            </div>
                        </div>
                    </div>

                </> :
                    <div className="bg-primary text-primary w-full h-full flex justify-center items-center">
                        <p className="text-3xl text-gray-400">Click a chat to start talking!</p>
                    </div>
            }

        </div>
    )
}

export default ChatPage;