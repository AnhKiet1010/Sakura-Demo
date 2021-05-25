import moment from 'moment';

export const formatTime = (timeX) => {
    var time = new Date(timeX).toLocaleString("ja-JP");
    var calcTime = "";
    var now = moment();
    var past = moment.parseZone(time);

    if(now.diff(past, 'days') < 1) {
        calcTime = moment.parseZone(time).format("HH:mm A");
    } else if(now.diff(past, 'days') >= 1 && now.diff(past, 'days') < 2) {
        calcTime = "A day ago";
    } else {
        calcTime = moment.parseZone(time).format("YYYY-MM-DD");
    }

    // var toNow = moment(time).toNow(true);
    return calcTime;
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