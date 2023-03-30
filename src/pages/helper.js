export const dateFormatter = (dateInput) =>{
    var date = new Date(dateInput);

    var months_array = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // Get date, month, and year
    var day = date.getDate(); 
    var month = months_array[date.getMonth()];
    var year = date.getFullYear();

    return day + "/" +  month + "/" + year;
};

export const dateInputFormatter = (dateInput) =>{
    var date = new Date(dateInput);

    // Get date, month, and year
    var day = date.getDate(); 
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    return year + "-" + checkTime(month) + "-" + checkTime(day);
};

function checkTime(i)
{
    if(i<10)
    {
        i="0"+i;
    }
    return i;
}
