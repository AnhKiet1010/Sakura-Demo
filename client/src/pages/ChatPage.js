import React, { useEffect, useState, useContext } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { ToastContainer, toast } from 'react-toastify';
import Popup from "reactjs-popup";
import Aos from 'aos';
import 'reactjs-popup/dist/index.css';
import 'react-toastify/dist/ReactToastify.css';
import 'aos/dist/aos.css';
import { useDispatch, useSelector } from 'react-redux';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';

import API from '../api/API';

import { ThemeContext } from '../components/themeContext';
import InfiniteScroll from '../components/InfiniteScroll';
import Loading from '../components/Loading';
import audio from "../assets/audio/like.wav";
import UploadPopup from '../components/UploadPopup';
import MessFilterPopup from '../components/MessFilterPopup';
import socket from '../helpers/socketConnect';
import { PlusIcon, MicIcon, MenuIcon, CancelIcon, SearchIcon, SmileIcon, StickerIcon } from '../icons';
import { setKeyword } from '../slices/keywordSlice';
import { setCurrentUser } from '../slices/currentUserSlice';
import handleEmojiClickOutside from '../helpers/handleEmojiClickOutside';
import handleProfileClickOutside from '../helpers/handleProfileClickOutside';
import ReplyPanel from '../components/ReplyPanel';
import { onLogout } from '../helpers/auth';
import { useHistory } from 'react-router';
import ChatPageLeft from '../components/ChatPageLeft';

const envLimit = parseInt(process.env.REACT_APP_MESS_PER_LOAD);


function ChatPage() {
    const user = JSON.parse(localStorage.getItem('user'));
    const dispatch = useDispatch();
    const keyword = useSelector(state => state.keyword);
    const currentUser = useSelector(state => state.currentUser);
    const { theme, setTheme } = useContext(ThemeContext);
    const [listFriends, setListFriends] = useState([]);
    const [listMessages, setListMessages] = useState([]);
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
    const [word, setWord] = useState(keyword);
    const [listMessFilter, setListMessFilter] = useState([]);
    const [showListFilterMess, setShowListFilterMess] = useState(false);
    const messAudio = new Audio(audio);
    const [searchLimit, setSearchLimit] = useState(5);
    const [searchSkip, setSearchSkip] = useState(0);
    const [searchTotal, setSearchTotal] = useState(0);
    const [slideImages, setSlideImages] = useState([]);
    const {
        ref,
        isComponentVisible,
        setIsComponentVisible
    } = handleEmojiClickOutside(false);

    const {
        refProfile,
        showProfile,
        setShowProfile
    } = handleProfileClickOutside(false);
    const [showReplyPanel, setShowReplyPanel] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [replyMessId, setReplyMessId] = useState("");


    useEffect(() => {
        socket.on("UserSendMess", data => {
            if (currentUser.lineId !== data.id || data.id !== 'channel') {
                messAudio.play();
                changeData();
            }
        });

        socket.on("OnChangeListMessBySearch", data => {
            setListMessFilter(data.listMessFilter);
            setSearchTotal(data.searchTotal);
            console.log("listFilter", listMessFilter);
        });

        return () => {
            socket.off("UserSendMess");
            socket.off("OnChangeListMessBySearch");
        }
    });

    function handleWordChange(e) {
        setWord(e.target.value);
    }

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
    }

    async function updateListFriend() {
        await API.getListFriend({ userId: user.id })
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

    function handleSearchPress(e) {
        setWord(e.target.value);
        if (e.nativeEvent.keyCode === 13) {
            e.preventDefault();
            const action = setKeyword(e.target.value);
            dispatch(action);
            socket.emit('SearchMess', {
                text: e.target.value,
                skip: searchSkip,
                limit: searchLimit
            });
            setShowListFilterMess(true);
        }
    }

    function handleChangeSkipPrev() {
        setSearchSkip(searchSkip - searchLimit < 0 ? 0 : searchSkip - searchLimit);
        socket.emit('SearchMess', {
            text: word,
            skip: searchSkip - searchLimit < 0 ? 0 : searchSkip - searchLimit,
            limit: searchLimit
        });
    }

    function handleChangeSkipNext() {
        setSearchSkip(parseInt(searchSkip) + parseInt(searchLimit));
        socket.emit('SearchMess', {
            text: word,
            skip: parseInt(searchSkip) + parseInt(searchLimit),
            limit: searchLimit
        });
    }

    function handleChangeLimitSearch(e) {
        setSearchLimit(e.target.value);
        socket.emit('SearchMess', {
            text: word,
            skip: searchSkip,
            limit: e.target.value
        });
    }

    async function fetchMoreMess(to) {
        if (to === 'top') {
            console.log("fetchinggggg Top");
            setLoadingTop(true);
            setLimit(limit + envLimit);
        } else if (to === 'bot' && skip !== 0) {
            console.log("fetchinggggg Bot");
            setLoadingBottom(true);
            if (skip - envLimit > 0) {
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
        let action = setCurrentUser(user);
        dispatch(action);

    }

    function changeData() {
        setIsChangeData(!isChangeData);
    }

    function UpdateListImagesMess(id) {
        API.getImages({ id })
            .then((res) => {
                if (res.status === 200) {
                    setSlideImages(res.data.result);
                }
            });
    }

    useEffect(() => {
        updateListMess(currentUser.lineId, limit, skip);
        updateListFriend();
        UpdateListImagesMess(currentUser.lineId);
    }, [currentUser, isChangeData]);

    useEffect(() => {
        document.title = "Sakura Chat";
        setLoadingFr(true);
        setLimit(envLimit);
        updateListFriend();
        Aos.init({});
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
                type: "text",
                reply: replyMessId
            });
            setReply("");
            setShowReplyPanel(false);
            setReplyMessId("");
            setReplyText("");
        }
    }

    function onCloseSearchPopup() {
        setWord("");
        setShowListFilterMess(false);
        const action = setKeyword("");
        setSearchLimit(5);
        setSearchSkip(0);
        setSearchTotal(0);
        dispatch(action);
    }

    function addEmoji(e) {
        let emoji = e.native;
        setReply(reply + emoji);
    };

    function handleReply(messId, text) {
        setReplyText(text);
        setReplyMessId(messId);
        setShowReplyPanel(true);
    }

    function onCloseReplyPanel() {
        setShowReplyPanel(false);
        setReplyMessId("");
        setReplyText("");
    }

    return (
        <div className="relative font-sans antialiased h-screen w-full flex overflow-hidden">
            <ToastContainer preventDuplicates={true} />
            <ChatPageLeft
                setTheme={setTheme}
                isDark={isDark}
                loadingFr={loadingFr}
                listFriends={listFriends}
                onFriendClick={onFriendClick}
            
            />
            <MessFilterPopup
                showListFilterMess={showListFilterMess}
                onClose={onCloseSearchPopup}
                word={word}
                currentUser={currentUser}
                handleSearchPress={handleSearchPress}
                listMessFilter={listMessFilter}
                handleWordChange={handleWordChange}
                searchLimit={searchLimit}
                searchSkip={searchSkip}
                searchTotal={searchTotal}
                handleChangeLimitSearch={handleChangeLimitSearch}
                handleChangeSkipPrev={handleChangeSkipPrev}
                handleChangeSkipNext={handleChangeSkipNext}
            />
            {
                currentUser.name !== undefined ? <>
                    <div className={`relative flex-1 flex flex-col bg-primary w-full text-primary overflow-hidden`}>
                        <div className="border-b-2 dark:border-gray-500 bg-primary text-primary flex px-6 py-2 items-center flex-none">
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
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="dark:text-gray-800 appearance-none border border-grey text-primary rounded-lg pl-8 pr-4 py-2 focus:outline-none"
                                        onKeyDown={(e) => handleSearchPress(e)}
                                        onChange={handleWordChange}
                                        value={word} />
                                    <div className="absolute top-3 right-3 pl-3 flex items-center justify-center">
                                        <SearchIcon className="fill-current text-gray-500 h-4 w-4" />
                                    </div>
                                </div>
                            </div>
                            <button className={`text-xl ml-4 text-primary focus:outline-none -top-5 right-2 opacity-80 hover:opacity-100`} onClick={() => setShowProfile(true)}>
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
                                slideImages={slideImages}
                                handleReply={handleReply}
                            />
                        }

                        <div className="flex flex-col">
                            <div className="flex bg-gray-300 dark:bg-gray-500 justify-start px-4">
                                <Popup modal trigger={
                                    <div className="text-3xl text-primary p-2 focus:outline-none cursor-pointer">
                                        <PlusIcon className="h-7 w-7 block fill-current hover:text-secondary" />
                                    </div>
                                }>
                                    {close => <UploadPopup close={close} currentUser={currentUser} />}
                                </Popup>
                                <div className="relative text-3xl text-primary p-2 focus:outline-none flex justify-center items-center cursor-pointer" onClick={() => setIsComponentVisible(true)}>
                                    {
                                        isComponentVisible && <span ref={ref} className="absolute bottom-12 left-2">
                                            <Picker onSelect={addEmoji} />
                                        </span>
                                    }
                                    <SmileIcon className="fill-current h-5 w-5 block hover:text-secondary" />
                                </div>
                                <div className="text-3xl text-primary p-2 focus:outline-none flex justify-center items-center cursor-pointer">
                                    <StickerIcon className="fill-current h-5 w-5 block hover:text-secondary" />
                                </div>
                                <div className="text-3xl text-primary p-2 focus:outline-none flex justify-center items-center cursor-pointer">
                                    <MicIcon className="fill-current h-5 w-5 block hover:text-secondary" />
                                </div>
                            </div>
                            <div>
                                {
                                    showReplyPanel &&
                                    <ReplyPanel
                                        currentUser={currentUser}
                                        text={replyText}
                                        close={onCloseReplyPanel}
                                    />
                                }
                                <TextareaAutosize
                                    className="bg-primary text-primary w-full pl-8 pr-4 py-2 appearance-none focus:outline-none"
                                    minRows={4}
                                    placeholder={`Send message to ${currentUser.name}`}
                                    onKeyDown={(e) => handleKeyPress(e)} onChange={(e) => {
                                        setReply(e.target.value);
                                    }}
                                    value={reply}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={`absolute right-0 z-10 h-screen bg-primary text-primary border-l-2 dark:border-gray-500 flex-none w-72 lg:w-96 py-6 transform translate-x-full ${showProfile ? 'slide-in' : 'slide-out'}`} ref={refProfile}>
                        <div>
                            <div className="relative border-b-2 pb-8 flex flex-col items-center text-primary dark:border-gray-500">
                                <button className={`absolute text-xl text-primary p-2 focus:outline-none -top-3 right-3 opacity-80 hover:opacity-100`}
                                    onClick={() => setShowProfile(false)}>
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