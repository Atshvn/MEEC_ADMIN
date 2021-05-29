export const FormatDateJson = (date, key = 0) => {
    if(date === undefined){
        let data = 'N/A'
        return data;
    }
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear(),
        h = d.getHours(),
        m = d.getMinutes(),
        s = d.getSeconds(),
        f= d.getMilliseconds();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    if (key === 0)
        return [year, month, day].join('-') + 'T' + [h, m, s].join(':') + '.' + f + 'Z';
    else 
        return [year, month, day].join('-');
}