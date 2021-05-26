import moment from 'moment';

export const formatTime = (timeX) => {
    var time = new Date(timeX).toLocaleString("ja-JP");

    var toNow = moment(time).toNow();
    return toNow;
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