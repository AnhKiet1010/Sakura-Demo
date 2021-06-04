import moment from 'moment';

export const formatTime = (timeX) => {
    if(timeX && timeX !== "" && timeX !== undefined) {
        var time = new Date(timeX).toLocaleString("ja-JP");
    
        var toNow = moment(time).toNow();
        return toNow;
    } else {
        return timeX;
    }
}

export const formatText = (text) => {
    return text.split("\n").map(function(item, idx) {
        return (
            <span key={idx}>
                {item}
                <br/>
            </span>
         )
    })
}