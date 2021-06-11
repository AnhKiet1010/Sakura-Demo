import FriendItem from './FriendItem';
import { useSelector } from 'react-redux';

function ListFriends({onFriendClick}) {
    const listSearchFriends = useSelector(state => state.listSearchFriends);

    return (
        <>
        {
            listSearchFriends.map((friend, i) => {
                return (
                    <FriendItem
                        key={i}
                        last={i === listSearchFriends.length -1}
                        handleOnClick={() => onFriendClick(friend.friendData)}
                        name={friend.name}
                        avatar={friend.avatar}
                        online={friend.online}
                        frId={friend._id}
                    />
                );
            })
        }
        </>
    );
}

export default ListFriends;