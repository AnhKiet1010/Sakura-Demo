import React, { useEffect, useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import TextareaAutosize from 'react-textarea-autosize';
import InfiniteScroll from "react-infinite-scroll-component";
import { ToastContainer, toast } from 'react-toastify';
import Popup from "reactjs-popup";
import 'reactjs-popup/dist/index.css';
import 'react-toastify/dist/ReactToastify.css';

import API from '../api/API';

import { ThemeContext } from '../components/themeContext';
import ListFriends from '../components/ListFriends';
import ListMessages from '../components/ListMessages';
import audio from "../assets/audio/like.wav";
import UploadPopup from '../components/UploadPopup';


function ChatPage() {
    const { theme, setTheme } = React.useContext(ThemeContext);
    const socket = useSelector((state) => state.socket.value);
    const [listFriends, setListFriends] = useState([]);
    const [listMessages, setListMessages] = useState([]);
    const [currentUser, setCurrentUser] = useState({});
    const [reply, setReply] = useState("");
    const [isChangeData, setIsChangeData] = useState(false);
    const [skip, setSkip] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const messAudio = new Audio(audio);

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
                console.log(res.data);
                if (res.data.error) {
                    toast.error(res.data.message);
                } else {
                    setListFriends(res.data.data.listFriends);
                }
            }).catch(err => {
                console.log(err);
            })
    }

    function fetchMoreMess() {
        console.log('fetching....');
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
        updateListFriend();
        setLoading(false);
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

    return (
        <div className="font-sans antialiased h-screen flex">
            <ToastContainer />
            <div className="bg-primary text-primary border-r-2 flex-none w-24 p-6 hidden md:block">
                <div className="cursor-pointer mb-4">
                    <div className="bg-primary text-primary h-12 w-12 flex items-center justify-center text-black text-2xl font-semibold rounded-lg mb-1 overflow-hidden">
                        <img src="https://pickaface.net/gallery/avatar/unr_random_180410_1905_z1exb.png" alt="avatar" />
                    </div>
                    <div className="text-center text-white opacity-50 text-sm">⌘1</div>
                </div>
                <div className="cursor-pointer mb-4">
                    <div className="bg-indigo-400 opacity-25 h-12 w-12 flex items-center justify-center text-black text-2xl font-semibold rounded-lg mb-1 overflow-hidden">
                        L
                    </div>
                    <div className="text-center text-white opacity-50 text-sm">⌘2</div>
                </div>
                <div className="cursor-pointer">
                    <div className="bg-primary text-primary opacity-25 h-12 w-12 flex items-center justify-center text-black text-2xl font-semibold rounded-lg mb-1 overflow-hidden">
                        <svg className="fill-current h-10 w-10 block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M16 10c0 .553-.048 1-.601 1H11v4.399c0 .552-.447.601-1 .601-.553 0-1-.049-1-.601V11H4.601C4.049 11 4 10.553 4 10c0-.553.049-1 .601-1H9V4.601C9 4.048 9.447 4 10 4c.553 0 1 .048 1 .601V9h4.399c.553 0 .601.447.601 1z" /></svg>
                    </div>
                </div>
            </div>
            <div className="bg-primary text-primary flex-none w-64 pb-6 hidden md:block border-r-2">
                <div className=" border-indigo-400 mb-2 mt-3 px-4 flex justify-between items-center">
                    <div className="flex-auto">
                        <h1 className="font-semibold text-xl leading-tight mb-1 truncate">Sakura Chat</h1>
                        <div className="flex items-center mb-2">
                            <span className="bg-green-400 rounded-full block w-2 h-2 mr-2" />
                            <span className=" opacity-50 text-sm">Admin</span>
                        </div>
                    </div>
                    <div>
                        {/* <svg className="h-6 w-6 fill-current text-gray-800 opacity-25" viewBox="0 0 20 20">
                            <path d="M14 8a4 4 0 1 0-8 0v7h8V8zM8.027 2.332A6.003 6.003 0 0 0 4 8v6l-3 2v1h18v-1l-3-2V8a6.003 6.003 0 0 0-4.027-5.668 2 2 0 1 0-3.945 0zM12 18a2 2 0 1 1-4 0h4z" fillRule="evenodd" />
                        </svg> */}
                        <label htmlFor="toogleA" className="flex items-center cursor-pointer">
                            {/* toggle */}
                            <div className="relative">
                                <input id="toogleA" type="checkbox" className="sr-only" onChange={e => setTheme(e.target.checked ? "dark" : "light")} checked={isDark()} />
                                <div className="w-10 h-4 bg-gray-400 rounded-full shadow-inner" />
                                <div className="dot absolute w-6 h-6 p-1 bg-primary text-primary rounded-full shadow -left-1 -top-1 transition flex items-center justify-center">
                                    {isDark() && <svg height="20px" viewBox="-27 0 511 511.73851" fill="#fff" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="m425.140625 423.144531c-40.308594 12.300781-83.300781 12.761719-123.859375 1.332031-93.660156-27.097656-158.761719-112.015624-160.617188-209.496093-.511718-83.15625 45.367188-159.664063 118.957032-198.382813 3.507812-1.949218 5.269531-6.015625 4.289062-9.90625-.980468-3.890625-4.453125-6.6367185-8.464844-6.691406-71.25.25-139.238281 29.898438-187.898437 81.941406-95.777344 103.503906-88.453125 271.386719 17.566406 365.054688 51.355469 45.085937 118.363281 68.1875 186.589844 64.324218 36.921875-2.292968 72.910156-12.574218 105.472656-30.125 20.878907-11.625 39.957031-26.222656 56.628907-43.34375 2.835937-2.84375 3.394531-7.246093 1.355468-10.707031-2.039062-3.460937-6.160156-5.105469-10.019531-4zm0 0" /><path d="m392.300781 132.199219c0-34.128907-23.714843-61.792969-52.964843-61.792969-29.253907 0-52.964844 27.664062-52.964844 61.792969 0 34.125 23.710937 61.792969 52.964844 61.792969 29.25 0 52.964843-27.667969 52.964843-61.792969zm0 0" /><path d="m457.878906 233.714844c0-26.816406-18.632812-48.550782-41.617187-48.550782s-41.617188 21.734376-41.617188 48.550782c0 26.8125 18.632813 48.550781 41.617188 48.550781s41.617187-21.738281 41.617187-48.550781zm0 0" /></svg>}
                                    {!isDark() && <svg height="20px" viewBox="-32 0 511 512" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="m394.3125 256c0 94.257812-76.410156 170.667969-170.667969 170.667969-94.253906 0-170.664062-76.410157-170.664062-170.667969s76.410156-170.667969 170.664062-170.667969c94.257813 0 170.667969 76.410157 170.667969 170.667969zm0 0" fill="#ffd54f" /><g fill="#ffc107"><path d="m223.644531 69.332031c-8.832031 0-16-7.167969-16-16v-37.332031c0-8.832031 7.167969-16 16-16s16 7.167969 16 16v37.332031c0 8.832031-7.167969 16-16 16zm0 0" /><path d="m48.113281 170.667969c-2.410156 0-4.882812-.535157-7.1875-1.730469l-31.617187-16c-7.894532-3.988281-11.050782-13.609375-7.0625-21.503906 4.011718-7.847656 13.65625-11.09375 21.507812-7.039063l31.613282 16c7.894531 3.988281 11.050781 13.609375 7.0625 21.503907-2.835938 5.566406-8.46875 8.769531-14.316407 8.769531zm0 0" /><path d="m16.519531 389.332031c-5.84375 0-11.476562-3.199219-14.292969-8.765625-3.988281-7.894531-.832031-17.515625 7.0625-21.503906l31.613282-16c7.894531-4.054688 17.515625-.832031 21.503906 7.039062 3.992188 7.894532.832031 17.515626-7.058594 21.503907l-31.617187 16c-2.304688 1.195312-4.777344 1.726562-7.210938 1.726562zm0 0" /><path d="m223.644531 512c-8.832031 0-16-7.167969-16-16v-37.332031c0-8.832031 7.167969-16 16-16s16 7.167969 16 16v37.332031c0 8.832031-7.167969 16-16 16zm0 0" /><path d="m430.769531 389.332031c-2.429687 0-4.882812-.53125-7.210937-1.726562l-31.613282-16c-7.894531-3.988281-11.050781-13.609375-7.0625-21.503907 4.011719-7.871093 13.632813-11.09375 21.503907-7.039062l31.617187 16c7.890625 3.988281 11.050782 13.609375 7.058594 21.503906-2.816406 5.566406-8.445312 8.765625-14.292969 8.765625zm0 0" /><path d="m399.175781 170.667969c-5.84375 0-11.476562-3.203125-14.292969-8.769531-3.988281-7.894532-.832031-17.515626 7.0625-21.503907l31.613282-16c7.894531-4.054687 17.515625-.832031 21.503906 7.039063 3.992188 7.894531.832031 17.515625-7.058594 21.503906l-31.617187 16c-2.324219 1.195312-4.800781 1.730469-7.210938 1.730469zm0 0" /></g></svg>}
                                </div>
                            </div>
                        </label>
                    </div>
                </div>

                <div className="mb-8">
                    <div className="px-4 mb-2 text-white flex justify-between items-center">
                        <div className="relative">
                            <input type="text" placeholder="Search..." className="border border-grey rounded-lg pl-8 pr-4 py-2 text-gray-600 focus:outline-none" />
                            <div className="absolute top-3 right-3 pl-3 flex items-center justify-center">
                                <svg className="fill-current text-gray-500 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <ListFriends listFriends={listFriends} currentUser={currentUser} onFriendClick={onFriendClick} />
                </div>
            </div>

            {
                currentUser.name !== undefined ? <div className="flex-1 flex flex-col bg-primary text-primary overflow-hidden">
                    <div className="border-b bg-primary text-primary flex px-6 py-2 items-center flex-none">
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
                                <input type="search" placeholder="Search" className="appearance-none border border-grey rounded-lg pl-8 pr-4 py-2 focus:outline-none" />
                                <div className="absolute top-3 right-3 pl-3 flex items-center justify-center">
                                    <svg className="fill-current text-gray-500 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="px-6 pb-4 pt-10 flex-1 flex flex-col-reverse overflow-y-scroll h-full" id="scrollableDiv">
                        {
                            !loading && <InfiniteScroll
                                dataLength={listMessages.length}
                                next={fetchMoreMess}
                                style={{ display: "flex", flexDirection: 'column-reverse', overflow: 'hidden' }}
                                inverse={hasMore}
                                hasMore={hasMore}
                                scrollableTarget="scrollableDiv"
                                loader={
                                    <span className="text-primary opacity-75 mt-2 mb-8 mx-auto block relative w-0 h-0">
                                        <i className="fas fa-circle-notch fa-spin fa-2x" />
                                    </span>
                                }
                                endMessage={
                                    <div className="flex my-8 items-center text-center">
                                        <hr className="border-gray-300 border-1 w-full rounded-md" />
                                        <label className="block font-medium text-sm text-primary w-full">
                                            Yay! You have seen it all
            </label>
                                        <hr className="border-gray-300 border-1 w-full rounded-md" />
                                    </div>
                                }
                            >
                                <ListMessages listMessages={listMessages} currentUser={currentUser} />
                            </InfiniteScroll>
                        }
                    </div>
                    <div className="flex flex-col">
                        <div className="flex bg-gray-300 dark:bg-gray-500 justify-start">
                            <Popup modal trigger={
                                <button className="text-3xl text-primary p-2 focus:outline-none">
                                    <svg className="fill-current h-6 w-6 block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M16 10c0 .553-.048 1-.601 1H11v4.399c0 .552-.447.601-1 .601-.553 0-1-.049-1-.601V11H4.601C4.049 11 4 10.553 4 10c0-.553.049-1 .601-1H9V4.601C9 4.048 9.447 4 10 4c.553 0 1 .048 1 .601V9h4.399c.553 0 .601.447.601 1z" /></svg>
                                </button>
                            }>
                                {close => <UploadPopup close={close} currentUser={currentUser} />}
                            </Popup>
                            <button className="text-3xl text-primary p-2 focus:outline-none">
                                <svg className="fill-current h-5 w-5 block" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 435.2 435.2" style={{ enableBackground: 'new 0 0 435.2 435.2' }} xmlSpace="preserve">
                                    <g>
                                        <g>
                                            <path d="M356.864,224.768c0-8.704-6.656-15.36-15.36-15.36s-15.36,6.656-15.36,15.36c0,59.904-48.64,108.544-108.544,108.544
			c-59.904,0-108.544-48.64-108.544-108.544c0-8.704-6.656-15.36-15.36-15.36c-8.704,0-15.36,6.656-15.36,15.36
			c0,71.168,53.248,131.072,123.904,138.752v40.96h-55.808c-8.704,0-15.36,6.656-15.36,15.36s6.656,15.36,15.36,15.36h142.336
			c8.704,0,15.36-6.656,15.36-15.36s-6.656-15.36-15.36-15.36H232.96v-40.96C303.616,355.84,356.864,295.936,356.864,224.768z" />
                                        </g>
                                    </g>
                                    <g>
                                        <g>
                                            <path d="M217.6,0c-47.104,0-85.504,38.4-85.504,85.504v138.752c0,47.616,38.4,85.504,85.504,86.016
			c47.104,0,85.504-38.4,85.504-85.504V85.504C303.104,38.4,264.704,0,217.6,0z" />
                                        </g>
                                    </g>
                                </svg>

                            </button>
                        </div>
                        <TextareaAutosize
                            className="bg-primary text-primary w-full px-4 py-2 appearance-none focus:outline-none"
                            minRows={4}
                            placeholder={`Send message to ${currentUser.name}`}
                            onKeyDown={(e) => handleKeyPress(e)} onChange={(e) => {
                                setReply(e.target.value);
                            }}
                            value={reply}
                        />
                    </div>
                </div> :
                    <div className="bg-primary text-primary w-full h-full flex justify-center items-center">
                        <p className="text-3xl text-gray-400">Click a chat to start talking!</p>
                    </div>
            }
        </div>
    )
}

export default ChatPage;