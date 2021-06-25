

import Popup from "reactjs-popup";
import UploadPopup from '../UploadPopup';
import { EditIcon, BackIcon, PlusIcon, CancelIcon } from '../../icons';
import { useRef, useState } from "react";
import handleEditNameClickOutside from '../../helpers/handleEditNameClickOutside';
import CLIENT from '../../api/CLIENT';
import { useSelector } from "react-redux";

function Profile({ refProfile, showProfile, setShowProfile }) {

    const [showChangeAvatar, setShowChangeAvatar] = useState(false);
    const [dataChange, setDataChange] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const { inputUsernameRef, editUsername, setEditUsername, newUsername, setNewUsername } = handleEditNameClickOutside(false);
    const [uploadingUsername, setUploadingUsername] = useState(false);
    const user = useSelector(state => state.user);
    const currentUser = useSelector(state => state.currentUser);

    const useFocus = () => {
        const htmlElRef = useRef(null)
        const setFocus = () => { htmlElRef.current && htmlElRef.current.focus() }

        return [htmlElRef, setFocus];
    }

    const [inputRef, setInputFocus] = useFocus();

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

    return (
        <div className={`absolute right-0 z-20 h-screen bg-primary text-primary border-l-2 dark:border-gray-500 flex-none w-full md:w-72 lg:w-96 py-6 transform translate-x-full ${showProfile ? 'slide-in' : 'slide-out'}`} ref={refProfile}>
            <div>
                <div className="relative border-b-2 pb-8 flex flex-col items-center text-primary dark:border-gray-500">
                    <button className={`absolute text-xl text-primary p-2 focus:outline-none -top-3 right-3 opacity-80 hover:opacity-100`}>
                        <CancelIcon className="fill-current h-6 w-6 block text-primary bg-primary hover:text-secondary" />
                    </button>

                    <div className="relative flex flex-col my-3 items-center">
                        <div className="">
                            <div className="relative w-36 h-36 rounded-full mx-auto overflow-hidden">
                                <div className="cursor-pointer w-full h-full mx-auto"
                                    onMouseEnter={() => setShowChangeAvatar(true)}
                                    onMouseLeave={() => setShowChangeAvatar(false)}
                                >
                                    {
                                        !uploadingAvatar ?
                                            <img alt="avatar" src={user.avatar} className="object-cover object-center w-full h-full visible transform-gpu rounded-full transition-all hover:scale-105 animate__animated animate__fadeIn animate__faster" />
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
                                        !editUsername && <div className="absolute -right-5 top-0 ml-4 text-green-500 cursor-pointer hover:opacity-60"
                                            onClick={() => {
                                                setEditUsername(true);
                                                setInputFocus();
                                            }}
                                        ><EditIcon className="w-3 h-3 fill-current" /></div>
                                    }
                                </div>
                            }
                            {
                                editUsername &&
                                <div className="flex flex-col w-full" ref={inputUsernameRef}>
                                    <input
                                        type="text"
                                        name="username"
                                        value={newUsername}
                                        className="text-center bg-primary text-primary w-full text-2xl font-bold text-gray-700 px-2 py-1 focus:outline-none animate__animated animate__fadeIn animate__faster"
                                        placeholder="Input new username"
                                        onChange={(e) => {
                                            setNewUsername(e.target.value);
                                        }}
                                        autoFocus
                                        ref={inputRef}
                                    />
                                    <div className="flex mt-2 mx-auto">
                                        <div
                                            className={`ml-2 text-green-500 bg-secondary rounded-md p-2 cursor-pointer hover:opacity-60 animate__animated animate__fadeIn animate__faster`}
                                            onClick={handleChangeUsername}>
                                            {
                                                !uploadingUsername ?
                                                    <EditIcon className={`w-4 h-4 fill-current ${(newUsername === user.name || newUsername === "") && "opacity-50"}`} /> :
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
                                            }}><BackIcon className={`w-4 h-4 fill-current ${uploadingUsername && "opacity-50"}`} /></div>
                                    </div>
                                </div>
                            }
                        </div>
                        <p className="text-primary text-sm">{user.email}</p>
                    </div>
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
    )
}

export default Profile;