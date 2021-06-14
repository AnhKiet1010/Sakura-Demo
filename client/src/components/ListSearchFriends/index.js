import FriendItem from './FriendItem';
import { useSelector } from 'react-redux';

function ListFriends({onFriendClick}) {
    const listSearchFriends = useSelector(state => state.listSearchFriends);

    return (
        <>
        {
            listSearchFriends.length > 0 ?
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
            }) : <div className="text-center text-sm italic opacity-70">No Friends Match</div>
        }
        </>
    );
}

export default ListFriends;