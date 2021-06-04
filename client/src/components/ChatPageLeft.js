
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ResizePanel from "react-resize-panel";
import Popup from "reactjs-popup";

import ListFriends from '../components/ListFriends';
import demoAvatar from '../icons/user.svg';
import { LightIcon, DarkIcon, SearchIcon, EditIcon, RecallIcon } from '../icons';
import Loading from './Loading';
import { onLogout } from '../helpers/auth';
import CLIENT from '../api/CLIENT';
import { useEffect, useState } from 'react';
import 'animate.css';

function ChatPageLeft({ setTheme, isDark, loadingFr, listFriends, onFriendClick }) {
    const history = useHistory();
    const [user, setUser] = useState({});
    const currentUser = useSelector(state => state.currentUser);
    const [showChangeAvatar, setShowChangeAvatar] = useState(false);
    const [dataChange, setDataChange] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [newUsername, setNewUsername] = useState("");
    const [editUsername, setEditUsername] = useState(false);
    const [uploadingUsername, setUploadingUsername] = useState(false);

    const handleChangeUsername = () => {
        if (newUsername !== user.name && newUsername !== "") {
            setUploadingUsername(true);
            const formData = new FormData();

            formData.append('name', newUsername);
            formData.append('id', user.id);

            CLIENT.update(formData)
                .then(res => {
                    const { status, data } = res.data;

                    if (status === 200) {
                        localStorage.setItem("user", JSON.stringify(data.userInfo));
                        setDataChange(!dataChange);
                        setUploadingUsername(false);
                        setEditUsername(false);
                    }

                }).catch(err => {
                    console.log(err);
                });
        }
    }


    const handleLogout = () => {
        onLogout();
        history.push('/login');
    }

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem("user")));
        setNewUsername(JSON.parse(localStorage.getItem("user")).name);
    }, [dataChange]);

    const handleAvatarChange = (e) => {

        if (e.target.files[0] !== undefined) {
            setUploadingAvatar(true);
            const formData = new FormData();

            formData.append("avatar", e.target.files[0]);
            formData.append('name', user.name);
            formData.append('id', user.id);

            CLIENT.update(formData)
                .then(res => {
                    const { status, data } = res.data;

                    if (status === 200) {
                        localStorage.setItem("user", JSON.stringify(data.userInfo));
                        setDataChange(!dataChange);
                        setUploadingAvatar(false);
                    }

                }).catch(err => {
                    console.log(err);
                });
        }
    }

    return (
        <ResizePanel direction="e" className="border-r-2">
            <div className="relative z-10 bg-primary text-primary flex-none w-72 min-w-full pb-6 hidden md:block border-r-2 dark:border-gray-500">
                <div>
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
                    <hr></hr>
                    <div className="flex flex-col my-3 items-center">
                        <div className="">
                            <div className="relative w-36 h-36 rounded-full mx-auto overflow-hidden">
                                <div className="cursor-pointer w-full h-full mx-auto"
                                    onMouseEnter={() => setShowChangeAvatar(true)}
                                    onMouseLeave={() => setShowChangeAvatar(false)}
                                >
                                    {
                                        !uploadingAvatar ?
                                            <img src={user.avatar ? user.avatar : demoAvatar} className="object-cover object-center w-full h-full visible transform-gpu rounded-full border border-gray-500 transition-all hover:scale-105 animate__animated animate__fadeIn animate__faster" />
                                            :
                                            <div className="object-cover bg-gray-400 object-center flex justify-center items-center w-full h-full transition-all">
                                                <span className="text-white opacity-75 block">
                                                    <i className="fas fa-circle-notch fa-spin fa-2x" />
                                                </span>
                                            </div>
                                    }
                                    {
                                        showChangeAvatar &&
                                        <label htmlFor="avatar" className="absolute w-full bottom-0 left-1/2 transform z-10 -translate-x-1/2 bg-gray-800 bg-opacity-50 cursor-pointer animate__animated animate__fadeIn animate__faster">
                                            <p className="text-xs text-center pb-4 pt-1 text-white">Upload Avatar</p>
                                        </label>
                                    }
                                </div>
                            </div>
                            <input type="file" name="avatar" id="avatar" className="hidden" onChange={handleAvatarChange} />
                        </div>
                        <div className="my-4 flex items-center justify-center w-full px-4">
                            {
                                !editUsername && <div className="relative text-primary text-2xl font-bold animate__animated animate__fadeIn animate__faster">
                                    {user.name}
                                    {
                                        !editUsername && <div className="absolute -right-5 top-0 ml-4 text-green-500 cursor-pointer hover:opacity-60" onClick={() => setEditUsername(true)}><EditIcon className="w-3 h-3 fill-current" /></div>
                                    }
                                </div>
                            }
                            {
                                editUsername &&
                                <div className="flex flex-col w-full">
                                    <input type="text" name="username" value={newUsername} className="w-full border text-gray-700 px-2 py-1 rounded-md focus:outline-none animate__animated animate__fadeIn animate__faster" placeholder="Input new username" onChange={(e) => {
                                        setNewUsername(e.target.value);
                                    }}
                                    />
                                    <div className="flex mt-2 mx-auto">
                                        <div
                                            className={`ml-2 text-green-500 bg-secondary rounded-md p-2 cursor-pointer hover:opacity-60 animate__animated animate__fadeIn animate__faster`}
                                            onClick={handleChangeUsername}>
                                            {
                                                !uploadingUsername ?
                                                    <EditIcon className={`w-4 h-4 fill-current ${newUsername === user.name || newUsername==="" && "opacity-50"}`} /> :
                                                    <div className={`w-4 h-4 fill-current flex items-center`}>
                                                        <span className="text-green-500 block">
                                                            <i className="fas fa-circle-notch fa-spin fa-x" />
                                                        </span>
                                                    </div>
                                            }
                                        </div>
                                        <div 
                                        className="ml-2 text-green-500 bg-secondary rounded-md p-2 cursor-pointer hover:opacity-60 animate__animated animate__fadeIn animate__faster" 
                                        onClick={() => {
                                            setEditUsername(false);
                                            setNewUsername(user.name);
                                        }}><RecallIcon className={`w-4 h-4 fill-current ${uploadingUsername && "opacity-50"}`} /></div>
                                    </div>
                                </div>
                            }
                        </div>
                        <p className="text-primary text-sm">{user.email}</p>
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
                    {loadingFr ? <Loading /> : <ListFriends onFriendClick={onFriendClick} />}
                </div>
                <button onClick={handleLogout} className="absolute bottom-10 inset-x-1/2 transform -translate-x-2/4 bg-gradient-to-b from-gray-400 to-gray-500  text-white font-bold py-2 px-4 rounded-lg uppercase text-sm  shadow-xl focus:outline-none">
                    Logout
                    </button>
            </div>
        </ResizePanel>
    )
}

export default ChatPageLeft;