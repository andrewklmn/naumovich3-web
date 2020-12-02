const API_URL = 'https://litos.kiev.ua/naumovich/api/';

const renterSection = document.querySelector('.renters-temp');
const fasmebTemp = renterSection.querySelector('.fasmeb-temp');
const ruslanTemp = renterSection.querySelector('.ruslan-temp');

const stateSection = document.querySelector('.state');
const pompIcon = stateSection.querySelector('.pomp-icon');
const pompTemp = stateSection.querySelector('.pomp-temp');
const heaterIcon = stateSection.querySelector('.heater-icon');
const heaterTemp = stateSection.querySelector('.heater-temp');
const outdoorTemp = stateSection.querySelector('.outdoor-temp');

const apiCommands = {
  GET_STATE: '',
  GET_TODAYS_LOG: '?today',
  GET_FULL_LOG: '?week',
  RUN_COMMAND: '?command=',
};

const heaterModes = {
  OFF: 0,
  ECO: 1,
  STANDART: 2,
}

const state = {
  heaterParams: {},
};

const state_indexes = 'configRAM|configROM|currentMode|out_s0|litos_s1|mebel_s2|hot_s3|back_s4|outdoorTemp|fasmebTemp|ruslanTemp|heaterTemp|pompTemp|pompOff|heaterOff'.split("|");

const getheaterParams = (state)=> {
  fetch(API_URL + apiCommands.GET_STATE)
    .then(response => response.json())
    .then((json) => {
      const {stateOfHeater} = json; 
      if (stateOfHeater != "Bad request") {
        const state_values = stateOfHeater.split('|');
        state_indexes.forEach((index_name, index)=>{
          state.heaterParams[index_name] = state_values[index];
        });  
        drawheaterParams(state);
      } else {
        showInfo(stateOfHeater)
      }
    })
    .catch(function() {
      showInfo('Network error');
    });
}

const formatTemp = (heaterParams, parameterName) => {
  return (heaterParams[parameterName] > 0) 
            ? '+' + heaterParams[parameterName]:heaterParams[parameterName];
}

const drawheaterParams = ({heaterParams})=> {
  fasmebTemp.innerHTML = formatTemp(heaterParams, 'fasmebTemp');
  ruslanTemp.innerHTML = formatTemp(heaterParams, 'ruslanTemp');
  pompTemp.innerHTML = formatTemp(heaterParams, 'pompTemp');
  heaterTemp.innerHTML = formatTemp(heaterParams, 'heaterTemp');
  outdoorTemp.innerHTML = formatTemp(heaterParams, 'outdoorTemp');

  if (heaterParams.pompOff == '0') {
    pompIcon.classList.add('on');
  } else {
    pompIcon.classList.remove('on');
  }
  
  if (heaterParams.heaterOff == '0') {
    heaterIcon.classList.add('on');
  } else {
    heaterIcon.classList.remove('on');
  }
}

const showInfo = (text)=> {
  console.log(text);
}

document.addEventListener('DOMContentLoaded',() => {
  
  getheaterParams(state);

});
