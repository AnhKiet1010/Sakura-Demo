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
import { useSwipeable } from 'react-swipeable';

import API from '../api/API';

import { ThemeContext } from '../components/themeContext';
import InfiniteScroll from '../components/InfiniteScroll';
import Loading from '../components/Loading';
import audio from "../assets/audio/like.wav";
import UploadPopup from '../components/UploadPopup';
import MessFilterPopup from '../components/MessFilterPopup';
import socket from '../helpers/socketConnect';
import { PlusIcon, MicIcon, MenuIcon, CancelIcon, SearchIcon, SmileIcon, StickerIcon, SendIcon, ReplyIcon, BackIcon, LoadingIcon, ZoomIcon } from '../icons';
import { setKeyword } from '../slices/keywordSlice';
import { setTyping } from '../slices/typingSlice';
import { setCurrentUser } from '../slices/currentUserSlice';
import { setListFriends } from '../slices/listFriendsSlice';
import { setListMessages } from '../slices/listMessagesSlice';
import { setIsMobile } from '../slices/isMobileSlice';
import { setTouchingMess } from '../slices/touchingMessSlice';
import handleEmojiClickOutside from '../helpers/handleEmojiClickOutside';
import handleProfileClickOutside from '../helpers/handleProfileClickOutside';
import handleEditPanelClickOutside from '../helpers/handleEditPanelClickOutside';
import ReplyPanel from '../components/ReplyPanel';
import ChatPageLeft from '../components/ChatPageLeft';
import ShowImg from '../components/ShowImg';

const envLimit = parseInt(process.env.REACT_APP_MESS_PER_LOAD);


function ChatPage() {
    const user = JSON.parse(localStorage.getItem('user'));
    const dispatch = useDispatch();
    const keyword = useSelector(state => state.keyword);
    const currentUser = useSelector(state => state.currentUser);
    const isMobile = useSelector(state => state.isMobile);
    const { theme, setTheme } = useContext(ThemeContext);
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
    const {
        panelRef
    } = handleEditPanelClickOutside();
    const [showReplyPanel, setShowReplyPanel] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [replyMessId, setReplyMessId] = useState("");
    const [showLeft, setShowLeft] = useState(true);
    const touchingMess = useSelector(state => state.touchingMess);
    const [uploadingImageMess, setUploadingImageMess] = useState(false);
    const [showSearchInput, setShowSearchInput] = useState(false);


    useEffect(() => {
        socket.on("UserSendMessToChangeData", (data) => {
            changeData();
        });

        socket.on("UserSendMessToUser", () => {
            messAudio.play();
            changeData();
        });

        socket.on("OnChangeListMessBySearch", data => {
            setListMessFilter(data.listMessFilter);
            setSearchTotal(data.searchTotal);
            console.log("listFilter", listMessFilter);
        });

        socket.on("UserStateChange", () => {
            changeData();
        });

        socket.on("ChangeMessStatusToSeen", (data) => {
            if (data.id === currentUser._id) {
                updateListMess();
            }
        });

        socket.on("SetStartTyping", (data) => {
            const action = setTyping({
                state: true,
                id: data.id
            });
            dispatch(action);
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 768) {
                setShowLeft(true);
                let action = setIsMobile(false);
                dispatch(action);
                setShowSearchInput(true);
            } else {
                let action = setIsMobile(true);
                dispatch(action);
                setShowSearchInput(false);
            }
        });

        socket.on("SetEndTyping", (data) => {
            const action = setTyping({
                state: false,
                id: ""
            });
            dispatch(action);
        });

        socket.on("UserDeleteMess", () => {
            changeData();
            let action = setTouchingMess({ messId: "", showEditPanel: false, self: false, text: "" });
            dispatch(action);
        });

        socket.on("UserRecallMess", () => {
            changeData();
        });

        return () => {
            socket.off("UserSendMessToChangeData");
            socket.off("UserSendMessToUser");
            socket.off("OnChangeListMessBySearch");
            socket.off("UserStateChange");
            socket.off("ChangeMessStatusToSeen");
            socket.off("SetStartTyping");
            socket.off("SetEndTyping");
            socket.off("UserDeleteMess");
            socket.off("UserRecallMess");
        }
    });

    function handleWordChange(e) {
        setWord(e.target.value);
    }

    function isDark() {
        return theme === "dark";
    }

    function updateListMess() {
        const body = { frId: currentUser._id, userId: user.id, limit, skip };
        API.getListMessages(body)
            .then(res => {
                const { listMess, hasMoreTop, hasMoreBot } = res.data.data;
                let action = setListMessages(listMess);
                dispatch(action);
                console.log('updating list mess', res.data.data);
                setHasMoreTop(hasMoreTop);
                setHasMoreBot(hasMoreBot);
            });
        setLoadingMess(false);
    }

    function updateListFriend() {
        API.getListFriend({ userId: user.id })
            .then(res => {
                if (res.data.error) {
                    toast.error(res.data.message);
                } else {
                    let action = setListFriends(res.data.data.listFriends);
                    dispatch(action);
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

    const onFriendClick = (friend) => {
        setLoadingMess(true);
        setLimit(envLimit);
        setHasMoreTop(true);
        setHasMoreBot(false);
        if (window.innerWidth <= 768) {
            setShowLeft(false);
        }
        let action = setCurrentUser(friend);
        socket.emit("UserSeenMess", { ofId: friend._id, fromId: user.id });
        dispatch(action);
    }

    function changeData() {
        setIsChangeData(!isChangeData);
    }

    function UpdateListImagesMess(fromId, toId) {
        API.getImages({ fromId, toId })
            .then((res) => {
                if (res.status === 200) {
                    setSlideImages(res.data.result);
                }
            });
    }

    useEffect(() => {
        updateListFriend();
        updateListMess();
        UpdateListImagesMess(currentUser._id, user.id);
    }, [currentUser, isChangeData]);

    useEffect(() => {
        document.title = "Sakura Chat";
        setLoadingFr(true);
        setLimit(envLimit);
        updateListFriend();
        Aos.init({});
        socket.emit("UserOnline", { id: user.id });
    }, []);


    function handleKeyPress(e) {
        if (e.nativeEvent.shiftKey) {
            if (e.nativeEvent.keyCode === 13) {
                return;
            }
        } else if (e.nativeEvent.keyCode === 13) {
            e.preventDefault();
            socket.emit("ChannelSendMess", {
                fromId: user.id,
                toId: currentUser._id,
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

    function handleSendMessClick(e) {
        e.preventDefault();
        socket.emit("ChannelSendMess", {
            fromId: user.id,
            toId: currentUser._id,
            content: reply,
            type: "text",
            reply: replyMessId
        });
        setReply("");
        setShowReplyPanel(false);
        setReplyMessId("");
        setReplyText("");
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

    function handleReply() {
        setReplyText(touchingMess.mess.content);
        setReplyMessId(touchingMess.mess._id);
        setShowReplyPanel(true);
        let action = setTouchingMess({ mess: touchingMess.mess, showEditPanel: false, self: touchingMess.self });
        dispatch(action);
    }

    function onCloseReplyPanel() {
        setShowReplyPanel(false);
        setReplyMessId("");
        setReplyText("");
        let action = setTouchingMess({ mess: {}, showEditPanel: false, self: false });
        dispatch(action);
    }

    function onFocusInput() {
        socket.emit("UserStartTyping", { fromId: user.id, toId: currentUser._id });
    }

    function onBlurInput() {
        socket.emit("UserEndTyping", { fromId: user.id, toId: currentUser._id });
    }

    function handleRecallMess() {
        socket.emit("UserRecallMess", { messId: touchingMess.mess._id, toId: currentUser._id, fromId: user.id });
    }

    function handleBackButton() {
        let action = setTouchingMess({ mess: {}, showEditPanel: false, self: false });
        dispatch(action);
    }

    function handleDeleteMess() {
        socket.emit("UserDeleteMess", { messId: touchingMess.mess._id, toId: currentUser._id, fromId: user.id });
    }

    const handlers = useSwipeable({
        onSwipedLeft: (eventData) => {
            // console.log("User Swiped Left!");
            if (window.innerWidth <= 768) {
                if (showLeft) {
                    setShowLeft(false);
                } else {
                    setShowProfile(true);
                }
            }
        },
        onSwipedRight: (eventData) => {
            // console.log("User Swiped Right!");
            if (window.innerWidth <= 768) {
                if (showProfile) {
                    setShowProfile(false);
                } else {
                    setShowLeft(true);
                }
            }
        },
    });

    const handleImageSendInMobile = (e) => {
        if (e.target.files !== undefined) {
            setUploadingImageMess(true);
            console.log('files', e.target.files);
            const formData = new FormData();

            for (let i = 0; i < e.target.files.length; i++) {
                formData.append("files", e.target.files[i]);
            }
            formData.append("toId", currentUser._id);
            formData.append("fromId", user.id);
            formData.append("type", 'image');

            API.sendMessage(formData)
                .then(res => {
                    console.log('res', res);
                    setUploadingImageMess(false);
                }).catch(err => {
                    console.log('loi', err);
                })
        }
    }

    return (
        <div className="relative font-sans antialiased h-screen w-full flex overflow-hidden" {...handlers}>
            <ToastContainer preventDuplicates={true} />
            <ChatPageLeft
                setTheme={setTheme}
                isDark={isDark}
                loadingFr={loadingFr}
                onFriendClick={onFriendClick}
                showLeft={showLeft}
                setShowLeft={setShowLeft}
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
                    <div className={`flex-1 flex flex-col justify-center bg-primary w-full h-screen text-primary`}>
                        <div className="w-full border-b-2 dark:border-gray-500 bg-primary text-primary flex px-6 items-center flex-none h-24 z-10">
                            <div className={`flex absolute items-center ${showSearchInput && "hidden"}`}>
                                <div className="mr-2 w-16 h-16 relative flex justify-center items-center rounded-full bg-gray-500 text-xl">
                                    <img src={currentUser.avatar} className={`rounded-full ${currentUser.online && "border border-green-500"} w-full h-full object-cover`} alt="avatar" />
                                    {currentUser.online && <div className="absolute right-1 top-1 w-3 h-3 rounded-full bg-green-500 border" />}
                                </div>
                                <div className="flex flex-col">
                                    <span className=" text-lg font-bold mb-1">{currentUser.name}</span>
                                    <span className="text-xs  opacity-60 truncate">{currentUser.email}</span>
                                </div>
                            </div>
                            <div className="ml-auto">
                                <div className={`relative appearance-none ${!showSearchInput && "hidden"} animate__animated animate__fadeInRight`}>
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
                                <SearchIcon className={`fill-current text-secondary h-5 w-5 block ${showSearchInput && "hidden"} cursor-pointer`} onClick={() => setShowSearchInput(true)} />
                            </div>
                            <button className={`text-xl ml-4 text-primary focus:outline-none opacity-80 hover:opacity-100`}
                                onClick={() => setShowProfile(true)}
                            >
                                <MenuIcon className="fill-current h-6 w-6 block text-secondary bg-primary hover:text-primary" />
                            </button>
                        </div>

                        {
                            loadingMess ? <Loading /> : <InfiniteScroll
                                loading={false}
                                fetchMoreMess={fetchMoreMess}
                                hasMoreTop={hasMoreTop}
                                hasMoreBot={hasMoreBot}
                                currentUser={currentUser}
                                word={word}
                                limit={limit}
                                loadingBottom={loadingBottom}
                                loadingTop={loadingTop}
                                slideImages={slideImages}
                            />
                        }

                        {
                            !touchingMess.showEditPanel ?
                                <div className="flex flex-col w-full animate__animated animate__fadeIn">
                                    <div className="flex bg-gray-300 dark:bg-gray-500 justify-start">
                                        {
                                            !isMobile
                                                ?
                                                <Popup modal trigger={
                                                    <div className="text-3xl text-secondary p-2 ml-2 focus:outline-none cursor-pointer">
                                                        <PlusIcon className="h-6 w-6 block hover:text-primary" />
                                                    </div>
                                                }>
                                                    {close => <UploadPopup close={close} currentUser={currentUser} />}
                                                </Popup>
                                                :
                                                <>
                                                    <label htmlFor="hidden-input" className="text-3xl text-secondary p-2 ml-2 focus:outline-none cursor-pointer flex items-center">
                                                        {
                                                            uploadingImageMess ?
                                                                <LoadingIcon className="animate-spin spin-slow h-5 w-5 block hover:text-primary fill-current" />
                                                                :
                                                                <PlusIcon className="h-6 w-6 block hover:text-primary" />
                                                        }
                                                    </label>
                                                    <input id="hidden-input" type="file" multiple className="hidden"
                                                        name="files" capture onChange={handleImageSendInMobile} />
                                                </>
                                        }
                                        <div className="relative text-3xl text-secondary p-2 focus:outline-none flex justify-center items-center cursor-pointer" onClick={() => setIsComponentVisible(true)}>
                                            {
                                                isComponentVisible && <span ref={ref} className="absolute bottom-12 -left-8">
                                                    <Picker onSelect={addEmoji} />
                                                </span>
                                            }
                                            <SmileIcon className="h-6 w-6 block hover:text-primary" />
                                        </div>
                                        <div className="text-3xl text-secondary p-2 focus:outline-none flex justify-center items-center cursor-pointer">
                                            <StickerIcon className="h-6 w-6 block hover:text-primary" />
                                        </div>
                                        <div className="text-2xl text-secondary p-2 focus:outline-none flex justify-center items-center cursor-pointer">
                                            <MicIcon className="h-6 w-6 block hover:text-primary" />
                                        </div>
                                    </div>
                                    <div className="relative">
                                        {
                                            showReplyPanel &&
                                            <ReplyPanel
                                                text={replyText}
                                                close={onCloseReplyPanel}
                                            />
                                        }
                                        <TextareaAutosize
                                            className="bg-primary text-primary w-full pl-4 pr-24 text-left py-2 appearance-none focus:outline-none"
                                            minRows={3}
                                            placeholder={`Press「Enter」to send message to ${currentUser.name}`}
                                            onKeyDown={(e) => handleKeyPress(e)} onChange={(e) => {
                                                setReply(e.target.value);
                                            }}
                                            value={reply}
                                            onFocus={onFocusInput}
                                            onBlur={onBlurInput}
                                            autoFocus={false}
                                        />
                                        <button type="button" onClick={handleSendMessClick} className="absolute transform translate-y-1/2 z-10 right-5 inline-flex items-center justify-center rounded-full h-12 w-12 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none">
                                            <SendIcon />
                                        </button>

                                    </div>
                                </div>
                                :
                                <div className={`flex justify-between items-center bg-secondary px-6 animate__animated animate__slideInUp animate__faster`} style={{ height: '134px' }} ref={panelRef}>
                                    <div className="flex flex-col items-center hover:opacity-60 cursor-pointer" onClick={handleReply}>
                                        <ReplyIcon className="fill-current w-5 h-5 text-secondary" />
                                        Reply
                                    </div>

                                    <div className="flex flex-col items-center hover:opacity-60 cursor-pointer" onClick={handleBackButton}>
                                        <BackIcon className="fill-current w-5 h-5 text-secondary" />
                                        Back
                                    </div>
                                    {
                                        touchingMess.mess.type === 'image' &&
                                        <Popup className="my-slide-popup" modal trigger={
                                            <div className="flex flex-col items-center hover:opacity-60 cursor-pointer">
                                                <ZoomIcon className="fill-current w-5 h-5 text-secondary" />
                                                    Zoom
                                                </div>
                                        }>
                                            {close => {
                                                return !isMobile ? <ShowImg slideImages={slideImages} onClose={close} currentImg={touchingMess.mess.img} />
                                                : <img src={touchingMess.mess.img} alt="img" />
                                            }}
                                        </Popup>
                                    }
                                    {
                                        touchingMess.self &&
                                        <Popup modal className="my-delete-popup" onClose={() => {
                                            let action = setTouchingMess({ mess: {}, showEditPanel: false, self: false });
                                            dispatch(action);
                                        }} trigger={
                                            <div className="flex flex-col items-center hover:opacity-60 cursor-pointer">
                                                <CancelIcon className="fill-current w-5 h-5 text-secondary" />
                                                Delete
                                            </div>
                                        }>
                                            {
                                                close => {
                                                    return <div className="flex items-center p-4 justify-between rounded-2xl bg-primary" ref={panelRef}>
                                                        <div className="flex items-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 rounded-2xl p-3 border border-red-100 text-red-400 bg-red-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            <div className="flex flex-col ml-3">
                                                                <div className="font-medium leading-none text-primary">Delete This Message ?</div>
                                                            </div>
                                                        </div>
                                                        <button
                                                            className="flex-no-shrink bg-red-500 px-5 ml-4 py-2 text-sm shadow-sm hover:opacity-90 focus:outline-none font-medium tracking-wider border-2 border-red-500 text-white rounded-full"
                                                            onClick={() => handleDeleteMess()}
                                                        >Delete</button>
                                                    </div>
                                                }
                                            }
                                        </Popup>
                                    }

                                </div>
                        }


                    </div>

                    <div className={`absolute right-0 z-10 h-screen bg-primary text-primary border-l-2 dark:border-gray-500 flex-none w-full md:w-72 lg:w-96 py-6 transform translate-x-full ${showProfile ? 'slide-in' : 'slide-out'}`} ref={refProfile}>
                        <div>
                            <div className="relative border-b-2 pb-8 flex flex-col items-center text-primary dark:border-gray-500">
                                <button className={`absolute text-xl text-primary p-2 focus:outline-none -top-3 right-3 opacity-80 hover:opacity-100`}
                                    onClick={() => setShowProfile(false)}>
                                    <CancelIcon className="fill-current h-6 w-6 block text-primary bg-primary hover:text-secondary" />
                                </button>
                                <img src={currentUser.avatar} alt="avatar" className="rounded-full w-60 h-60 object-cover" />
                                <p className="text-3xl my-3 text-center">{currentUser.name}</p>
                                <p className="text-xl text-center">No pain no gain</p>
                            </div>
                            <div className="flex justify-between items-center px-6 py-2">
                                <div className="">Notes <span className="dark:text-gray-500 text-gray-400">0</span></div>
                                <Popup modal trigger={
                                    <button className="text-3xl text-primary p-2 focus:outline-none text-green-400">
                                        <PlusIcon className="h-7 w-7 block hover:text-secondary" />
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