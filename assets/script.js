var currentDayEl = $('#currentDay');
var currentDayFormatted = moment().format("dddd, MMMM Do YYYY");

var currentTimeEl = $('#currentTime');
var currentTimeFormatted = moment().format("h:mm:ss A")

currentDayEl.text(currentDayFormatted);
currentTimeEl.text(currentTimeFormatted);

var saveButtons = $('.save');
var textAreas = $('.input-area');

saveButtons.on('click', function(event) {
    var buttonClicked = $(event.target);
    var text = buttonClicked.parent().find('.input-area').val();
    var time = buttonClicked.parent().find('.time').text();
    var id = buttonClicked.parent().find('.input-area').attr('id');
    var timeObject = {
        time,
        text,
        id
    }
    addTimeToSavedContent(timeObject)
});

function addTimeToSavedContent(timeObject){
    var savedContent = JSON.parse(localStorage.getItem('savedContent'));
    
    if (savedContent != null) {
        savedContent = searchAndRemoveContent(savedContent, timeObject);
        savedContent.push({
            time: timeObject.time,
            text: timeObject.text,
            id: timeObject.id
        });
    }else {
        savedContent = [
            {
                time: timeObject.time,
                text: timeObject.text,
                id: timeObject.id
            }
        ]
    }
    console.log(savedContent);
    localStorage.setItem('savedContent', JSON.stringify(savedContent));
}

function searchAndRemoveContent(savedContent, timeObject) {
    var indexToRemove = -1;
       for (var i = 0; i < savedContent.length; i++) {
           if(savedContent[i].time === timeObject.time){
               indexToRemove = i;
           }
       } 

       if(indexToRemove > -1){
           savedContent.splice(indexToRemove, 1);
       }
       return savedContent;
}

function populateSchedule() {
    var savedContent = JSON.parse(localStorage.getItem('savedContent'));
    if (savedContent !=null) {
        for (var i = 0; i < savedContent.length; i++) {
            var content = savedContent[i];
            var textArea = $('#'+content.id);
            textArea.text(content.text);
        }
    }
}

function colorCodeSchedule() {
    console.log(textAreas);
    for (var i = 0; i < textAreas.length; i++){
        var textArea = $(textAreas[i]);
        var time = textArea.data('time');
        var textAreaTime = moment(time, "hh:mm A");
        var momentCurrentTime = moment().subtract(0, 'hours');
        var isBefore = textAreaTime.isBefore(momentCurrentTime);
        var isSameHour = momentCurrentTime.hour() === textAreaTime.hour();
        
        if(isSameHour) {
            textArea.removeClass('past')
            textArea.removeClass('future')
            textArea.addClass('present');
        }else if (isBefore) {
            textArea.removeClass('present')
            textArea.removeClass('future')
            textArea.addClass('past');
        } else {
            textArea.removeClass('present')
            textArea.removeClass('past')
            textArea.addClass('future');
        }
    }
}

function startInterval() {
    setInterval(function(){
        colorCodeSchedule();
    }, 60000)
}

populateSchedule();
colorCodeSchedule();
startInterval();


