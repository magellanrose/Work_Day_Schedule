// function to build time and save locally 
function buildScheduler(now) {
  const schedulerBox = document.querySelector('#schedulerBox');
  let startTime = dayjs().hour(9).minute(0);
  const endTime = dayjs().hour(17).minute(30);

  let obj = localStorage.getItem('eventTextObj');
  let objExists = false;

  if (obj) {
    objExists = true;
    eventTextStorage = JSON.parse(obj);
  } else {
    objExists = false;
    eventTextStorage = [];
  }

  var currentHour = now.hour();
  let hourOf = 0;
  while (startTime.isBefore(endTime)) {


    let outerDivClass;
    let eventText = "";

    if (startTime.hour() < currentHour) {
      outerDivClass = "past";
    } else if (startTime.hour() > currentHour) {
      outerDivClass = "future";
    } else {
      outerDivClass = "present";
    }
    if (!objExists) {
      newTextEntry = { "hour": hourOf, "eventText": "" };
      eventTextStorage.push(newTextEntry);
    } else {
      eventEntry = eventTextStorage[hourOf];
    }

    const outerDiv = document.createElement('div');

    const innerDiv = document.createElement('div');
    const textarea = document.createElement('textarea');
    const button = document.createElement('button');
    const saveI = document.createElement('i');

    outerDiv.classList.add('row', 'time-block', `${outerDivClass}`);

    innerDiv.classList.add('col-2', 'col-md-1', 'hour', 'text-center', 'py-3');
    innerDiv.innerText = startTime.format('h A');
    outerDiv.appendChild(innerDiv);

    textarea.classList.add('col-8', 'col-md-10', 'description');
    textarea.setAttribute("rows", "2");
    textarea.id = `textarea_hour${hourOf}`;

    
    if (objExists) {
      eventText = eventEntry.eventText;
    }
    textarea.textContent = eventText;

    outerDiv.appendChild(textarea);

    button.classList.add('btn', 'saveBtn', 'col-2', 'col-md-1');
    button.setAttribute('aria-label', 'save');
    button.id = `hour${hourOf}`
    button.addEventListener("click", saveEvent());

    saveI.classList.add('fas', 'fa-save');
    saveI.setAttribute('aria-hidden', 'true');
    button.appendChild(saveI);
    outerDiv.appendChild(button);
    schedulerBox.appendChild(outerDiv);


    startTime = startTime.add(1, 'hour');
    hourOf++;
  }

  if (!objExists) {
    localStorage.setItem('eventTextObj', JSON.stringify(eventTextStorage));
  }
}


// function to set the day 
function setDayText(now) {
  const dayText = document.querySelector('#currentDay');
  dayText.innerText = now.format('dddd MM/DD/YYYY');
}
// function to save textarea
function saveEvent() {
  return function (event) {
    let eventTextStorage = localStorage.getItem('eventTextObj');
    eventTextStorage = JSON.parse(eventTextStorage)

    let buttonHour = event;
    let buttonHourID = buttonHour.srcElement.id;

    let hourOf = parseInt(buttonHourID.replace('hour', ''), 10);



    let textareaID = `#textarea_${buttonHourID}`;
    let textarea = document.querySelector(textareaID);
    let eventEntry = eventTextStorage[hourOf];



    let eventTextValue = textarea.value;
    eventEntry.eventText = eventTextValue;

    eventTextStorage[hourOf] = eventEntry;


    localStorage.setItem('eventTextObj', JSON.stringify(eventTextStorage));


    displaySuccess()

  }
}
// function to display 
function displaySuccess() {
  const successBox = document.querySelector('#successBox')
  successBox.classList.remove('hidden')
  successBox.classList.add('unhidden')

  setTimeout(function () {
    successBox.classList.remove('unhidden')
    successBox.classList.add('hidden')
  }, 500);
}

$(function () {
  setDayText(dayjs());
  buildScheduler(dayjs());
});