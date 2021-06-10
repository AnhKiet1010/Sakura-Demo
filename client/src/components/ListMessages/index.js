import { useSelector } from 'react-redux';

import SelfMess from '../Messages/SelfMess';
import TextMess from '../Messages/TextMess';
import AudioMess from '../Messages/AudioMess';
import RecallMess from '../Messages/RecallMess';
import SelfVideoMess from '../Messages/SelfVideoMess';
import SelfRecallMess from '../Messages/SelfRecallMess';
import { useEffect, useState } from 'react';
import socket from '../../helpers/socketConnect';
import { setListMessages } from '../../slices/listMessagesSlice';
import { setTouchingMess } from '../../slices/touchingMessSlice';
import { useDispatch } from 'react-redux';

function ListMessages({ currentUser, slideImages }) {
    const listMessages = useSelector(state => state.listMessages);
    const [lm, setLm] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {

        socket.on("ChangeReact", data => {
            const { messChange } = data;
            let index = listMessages.findIndex(ele => ele._id === messChange._id);
            if (index !== -1) {
                const newListMess = [...listMessages.slice(0, index), { ...messChange }, ...listMessages.slice(index + 1)];
                const action = setListMessages(newListMess);
                dispatch(action);
                setLm(newListMess);
                
                let action1 = setTouchingMess({ mess: {}, showEditPanel: false, self: false });
                dispatch(action1);
            }
        });

        return () => {
            socket.off("ChangeReact");
        }

    });

    useEffect(() => {
        setLm(listMessages);
    }, [listMessages]);

    return (
        <>
            {
                lm.map((mess, i) => {
                    let result = "";
                    if (mess.author === currentUser._id) {
                        if(mess.recall) {
                            result = <RecallMess avatar={currentUser.avatar} key={i} />
                        } else if (mess.type === 'audio') {
                            result = <AudioMess src={mess.link} key={i} avatar={currentUser.avatar} seen={mess.seen} time={mess.time} />
                        } else {
                            result = <TextMess
                                key={i}
                                avatar={currentUser.avatar}
                                mess={mess}
                                slideImages={slideImages}
                            />
                        }
                    } else {
                        if(mess.recall) {
                            result = <SelfRecallMess key={i} />
                        } else if (mess.type === 'video') {
                            result = <SelfVideoMess key={i} link={mess.link} seen={mess.seen} time={mess.time} />
                        } else {
                            result = <SelfMess
                                key={i}
                                mess={mess}
                                slideImages={slideImages}
                            />
                        }
                    }
                    return result;
                })
            }
        </>
    )
}

export default ListMessages;