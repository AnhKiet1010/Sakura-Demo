import FriendItem from './FriendItem';


function ListFriends({listFriends, onFriendClick, currentUser}) {

    
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
                        lastTime={friend.friendData.lastTime}
                        active={currentUser.lineId === friend.friendData.lineId}
                        unReadMess={friend.unReadMess}
                        lastMess={friend.friendData.lastMess}
                    />
                );
            })
        }
        </>
    );
}

export default ListFriends;