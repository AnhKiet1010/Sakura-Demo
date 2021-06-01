import SelfMess from '../Messages/SelfMess';
import TextMess from '../Messages/TextMess';
import SelfImgMess from '../Messages/SelfImgMess';
import ImgMess from '../Messages/ImgMess';
import AudioMess from '../Messages/AudioMess';
import SelfVideoMess from '../Messages/SelfVideoMess';
import { useEffect } from 'react';

function ListMessages({ listMessages, currentUser, word, slideImages }) {

    return (
        <>
            {
                listMessages.map((mess, i) => {
                    let result = "";
                    if (mess.fromId === currentUser.lineId) {
                        if (mess.type === 'image') {
                            result = <ImgMess key={i} time={mess.time} images={mess.images} seen={mess.seen} avatar={currentUser.avatar} slideImages={slideImages} />
                        } else if (mess.type === 'audio') {
                            result = <AudioMess src={mess.link} key={i} avatar={currentUser.avatar} seen={mess.seen} time={mess.time} />
                        } else {
                            result = <TextMess key={i} word={word} avatar={currentUser.avatar} time={mess.time} text={mess.content} seen={mess.seen} messId={mess._id} react={mess.react} />
                        }
                    } else {
                        if (mess.type === 'image') {
                        result = <SelfImgMess key={i} time={mess.time} images={mess.images} seen={mess.seen} slideImages={slideImages} />
                        } else if (mess.type === 'video') {
                            result = <SelfVideoMess key={i} link={mess.link} seen={mess.seen} time={mess.time} />
                        } else {
                            result = <SelfMess key={i} word={word} text={mess.content} seen={mess.seen} time={mess.time} messId={mess._id} react={mess.react} />
                        }
                    }
                    return result;
                })
            }
        </>
    )
}

export default ListMessages;