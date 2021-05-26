import React, { useEffect, useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import TextareaAutosize from 'react-textarea-autosize';
import InfiniteScroll from "react-infinite-scroll-component";
import { ToastContainer, toast } from 'react-toastify';
import Popup from "reactjs-popup";
import 'reactjs-popup/dist/index.css';
import 'react-toastify/dist/ReactToastify.css';
import ResizePanel from "react-resize-panel";
import Scroll from 'react-scroll';

import API from '../api/API';

import { ThemeContext } from '../components/themeContext';
import ListFriends from '../components/ListFriends';
import ListMessages from '../components/ListMessages';
import audio from "../assets/audio/like.wav";
import UploadPopup from '../components/UploadPopup';
import { LightIcon, DarkIcon, PlusIcon, MicIcon, MenuIcon, CancelIcon, SearchIcon } from '../icons';
import LoadingImg from '../icons/loading.gif';


function ChatPage() {
    const { theme, setTheme } = useContext(ThemeContext);
    const socket = useSelector((state) => state.socket.value);
    const [listFriends, setListFriends] = useState([]);
    const [listMessages, setListMessages] = useState([]);
    const [currentUser, setCurrentUser] = useState({});
    const [reply, setReply] = useState("");
    const [isChangeData, setIsChangeData] = useState(false);
    const [skip, setSkip] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [profileHide, setProfileHide] = useState(true);
    const [word, setWord] = useState("");
    const messAudio = new Audio(audio);

    const Element = Scroll.Element;
    const scroller = Scroll.scroller;

    socket.on("UserSendMess", data => {
        if (currentUser.lineId !== data.id || data.id !== 'channel') {
            messAudio.play();
            setIsChangeData(!isChangeData);
        }
    });

    function isDark() {
        return theme === "dark";
    }

    function updateListMess(id, skip) {
        const body = { id, skip };
        API.getListMessages(body)
            .then(res => {
                console.log(res.data.data);
                const { listMess, hasMore } = res.data.data;
                setListMessages(listMess);
                setHasMore(hasMore);
            });
    }

    function updateListFriend() {
        API.getListFriend()
            .then(res => {
                if (res.data.error) {
                    toast.error(res.data.message);
                } else {
                    setListFriends(res.data.data.listFriends);
                }
            }).catch(err => {
                console.log(err);
            })
    }

    function onMessSearch(e) {
        const timeOutId = setTimeout(() => {
            setWord(e.target.value);
            socket.emit('SearchMess', word)
        }, 500);
        return () => clearTimeout(timeOutId);
    }

    function fetchMoreMess() {
        setSkip(skip + 1);
        setIsChangeData(!isChangeData);
    }

    const onFriendClick = (user) => {
        setLoading(true);
        setSkip(1);
        setHasMore(true);
        setCurrentUser(user);
    }

    useEffect(() => {
        document.title = "Sakura Chat";
        updateListFriend();
        setLoading(false);
        scroller.scrollTo('endMessage', {
            duration: 1500,
            delay: 100,
            smooth: true,
            containerId: '',
            offset: 50, // Scrolls to element + 50 pixels down the page
        });
        updateListMess(currentUser.lineId, skip);
    }, [currentUser, isChangeData]);

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
                        <ListFriends listFriends={listFriends} currentUser={currentUser} onFriendClick={onFriendClick} />
                    </div>
                </div>
            </ResizePanel>

            {
                currentUser.name !== undefined ? <>
                    <div className="flex-1 flex flex-col bg-primary w-full text-primary overflow-hidden">
                        <div className="border-b-2 bg-primary text-primary flex border-r-2 px-6 py-2 items-center flex-none dark:border-gray-500">
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
                                    <input type="search" onChange={onMessSearch} placeholder="Search" className="appearance-none border border-grey rounded-lg pl-8 pr-4 py-2 focus:outline-none" />
                                    <div className="absolute top-3 right-3 pl-3 flex items-center justify-center">
                                        <SearchIcon className="fill-current text-gray-500 h-4 w-4" />
                                    </div>
                                </div>
                            </div>
                            <button className={`text-xl ml-4 text-primary focus:outline-none -top-5 right-2 opacity-80 ${profileHide ? "hidden" : ""} hover:opacity-100`} onClick={onHideProfile}>
                                <MenuIcon className="fill-current h-6 w-6 block text-primary bg-primary hover:text-secondary" />
                            </button>
                        </div>
                        <div className="pr-6 pl-8 pb-4 pt-10 flex-1 flex flex-col-reverse overflow-y-scroll h-full border-r-2 dark:border-gray-500" id="scrollableDiv">
                            {
                                !loading && <InfiniteScroll
                                    dataLength={listMessages.length}
                                    next={fetchMoreMess}
                                    style={{ display: "flex", flexDirection: 'column-reverse', overflow: 'hidden' }}
                                    inverse={hasMore}
                                    hasMore={hasMore}
                                    scrollableTarget="scrollableDiv"
                                    loader={
                                        <span className="text-primary opacity-75 mt-2 mb-8 mx-auto block relative w-10 h-6">
                                            <img src={LoadingImg} />
                                        </span>
                                    }
                                    endMessage={
                                        <div className={`flex my-8 items-center text-center ${skip === 1 ? "hidden" : ""}`}>
                                            <hr className="border-gray-300 border-1 w-full rounded-md" />
                                            <label className="block font-medium text-sm text-primary w-full">
                                                Yay! You have seen it all
            </label>
                                            <hr className="border-gray-300 border-1 w-full rounded-md" />
                                        </div>
                                    }
                                >
                                    {word.length === 0 && <Element name="endMessage"></Element>}
                                    <ListMessages listMessages={listMessages} currentUser={currentUser} word={word} />
                                </InfiniteScroll>
                            }
                        </div>
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
                                className="bg-primary text-primary w-full border-r-2 px-6 py-2 appearance-none focus:outline-none dark:border-gray-500"
                                minRows={4}
                                placeholder={`Send message to ${currentUser.name}`}
                                onKeyDown={(e) => handleKeyPress(e)} onChange={(e) => {
                                    setReply(e.target.value);
                                }}
                                value={reply}
                            />
                        </div>
                    </div>

                    <div className={`bg-primary text-primary flex-none w-72 lg:w-96 py-6 ${profileHide ? "" : "hidden"}`}>
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