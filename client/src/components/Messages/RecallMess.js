
function RecallMess(currentUser) {
    return <div className="flex items-start mb-8 text-sm">
        <img src={currentUser.avatar} className="w-10 h-10 rounded-full mr-3 object-cover" alt="avatar" />
        <div className="relative flex items-end">
            <div className="relative text-gray-800 leading-normal bg-gray-200 dark:bg-gray-300 rounded-lg px-4 py-3 m-0 max-w-lg opacity-60 dark:opacity-80">
                <div className="italic">Message has been recovered</div>
            </div>
        </div>
    </div>
};

export default RecallMess;