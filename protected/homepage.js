// $(document).ready(function() {
//     //select the POPUP FRAME and show it
//     $(".logo").hide().fadeIn(1000);
// });
var date = new Date();
var days = new Array(7);
days[0] = "Sunday";
days[1] = "Monday";
days[2] = "Tuesday";
days[3] = "Wednesday";
days[4] = "Thursday";
days[5] = "Friday";
days[6] = "Saturday";
days[7] = "Sunday";

var tday = new Date();
var day = tday.getDate();
var month = tday.getMonth() + 1;
var year = tday.getFullYear();

function formatday(day) {
    if (day < 10) {
        return '0' + day
    }
    return day;
}

if (month < 10) {
    month = '0' + month
}

tday = month + '/' + (formatday(day)) + '/' + year;
tomorrowday = day + 1;
tomorrow = month + '/' + (formatday(tomorrowday)) + '/' + year;

function getDayName() {
    $("#dayName").html(days[date.getDay()]);
};

function getCurrentDate() {
    $("#currentDate").html(tday);
};

function getTomorrowName() {
    $("#tomorrowName").html(days[date.getDay() + 1]);
}

function getTomorrowDate() {
    $("#tomorrowDate").html(tomorrow);
};

/*DUmonthy Data to populate dashboard*/

var text = ["Monday", [12546, 'xyz1', '250mg', '9:00 AM', 'Yes'],
    [02546, 'xyz2', '100mg', '9:00 PM', 'No'],
    [02546, 'xyz3', '50mg', '3:00 PM', 'No']
];


/*adays anotehr time conatiner to the AdayMedi page*/
function adayAnotherTime() {
    $("#time").append($(".timecontainer").html());
};
/*scrolls the right arrow as the window scrolls*/
$(window).scroll(function() {
    $('#rightArrow').css({
        'top': $(this).scrollTop() + 250 //Why this 15, because in the CSS, we have set left 15, so as we scroll, we would want this to remain at 15px left
    });
});