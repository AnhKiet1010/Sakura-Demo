import FriendItem from './FriendItem';
import { useSelector } from 'react-redux';

function ListFriends({onFriendClick}) {
    const listFriends = useSelector(state => state.listFriends);

    return (
        <>
        {
            listFriends.map((friend, i) => {
                return (
                    <FriendItem
                        key={i}
                        handleOnClick={() => onFriendClick(friend.friendData)}
                        name={friend.friendData.name}
                        avatar={friend.friendData.avatar}
                        // lastTime={`${(new Date(friend.friendData.lastTime)).getHours()}:${(new Date(friend.friendData.lastTime).getMinutes())}`}
                        lastTime={friend.friendData.lastActivity}
                        unReadMess={friend.unReadCount}
                        lastMess={friend.conver.lastMess}
                        online={friend.friendData.online}
                        frId={friend.friendData._id}
                    />
                );
            })
        }
        </>
    );
}

export default ListFriends;