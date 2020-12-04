const API_URL = 'http://litos.kiev.ua/naumovich/api/';

const refreshingPeriodInSec = 10;
const refreshingAfterError = 1;

const renterSection = document.querySelector('.renters-temp');
const fasmebTemp = renterSection.querySelector('.fasmeb-temp');
const ruslanTemp = renterSection.querySelector('.ruslan-temp');

const stateSection = document.querySelector('.state');
const pompIcon = stateSection.querySelector('.pomp-icon');
const pompTemp = stateSection.querySelector('.pomp-temp');
const heaterIcon = stateSection.querySelector('.heater-icon');
const heaterTemp = stateSection.querySelector('.heater-temp');
const outdoorTemp = stateSection.querySelector('.outdoor-temp');

const modeValue = document.querySelector('.mode-value');
const givenTempSetter = document.querySelector('.given-temp');
const info = document.querySelector('.info');

const apiCommands = {
  GET_STATE: '',
  GET_TODAYS_LOG: '?today',
  GET_FULL_LOG: '?week',
  RUN_COMMAND: '?command=',
};

const MIN_GIVEN_TEMP = 5;
const MAX_GIVEN_TEMP = 10;
const GIVEN_TEMP_STEP = 0.2;


const heaterModes = [
  'Off',
  'Eco',
  'Std',
];

const state = {
  heaterParams: {},
};

const state_indexes = 'configRAM|configROM|currentMode|out_s0|litos_s1|mebel_s2|hot_s3|back_s4|outdoorTemp|ruslanTemp|fasmebTemp|heaterTemp|pompTemp|pompOff|heaterOff'.split("|");

const showInfo = (text)=> {
  info.innerHTML = text;
}

const clearInfo = () => {
  setTimeout(()=>{
    info.innerHTML = '';
  }, 2000);
}

const formatTemp = (heaterParams, parameterName) => {
  return (heaterParams[parameterName] > 0) 
            ? '+' + heaterParams[parameterName]:heaterParams[parameterName];
}

const setGivenTemp = (temp) => {
  //let tempOptions = givenTempSetter.querySelectorAll('option');
  givenTempSetter.value = temp;  
  givenTempSetter.disabled = false;
}

const drawheaterParams = ({heaterParams})=> {
  fasmebTemp.innerHTML = formatTemp(heaterParams, 'fasmebTemp');
  ruslanTemp.innerHTML = formatTemp(heaterParams, 'ruslanTemp');
  pompTemp.innerHTML = formatTemp(heaterParams, 'pompTemp');
  heaterTemp.innerHTML = formatTemp(heaterParams, 'heaterTemp');
  outdoorTemp.innerHTML = formatTemp(heaterParams, 'outdoorTemp');
  modeValue.innerHTML = heaterModes[heaterParams.currentMode];

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

const drawTempSetter = (min, max, step) => {
  for (let i=min; i<=max; i+=step ) {
    const val = Math.round(i*10)/10;
    const option = document.createElement('option');
    option.value = val;
    option.innerHTML = val;
    givenTempSetter.appendChild(option);
  }
}

const getheaterParams = (state)=> {
  showInfo('<span style="color:white;">ping</span>');
  fetch(API_URL + apiCommands.GET_STATE)
    .then(response => response.json())
    .then((json) => {
      const {stateOfHeater, givenTemp} = json; 
      if (stateOfHeater!=null 
            && stateOfHeater != "Bad request"
            && stateOfHeater != "T") {
        const state_values = stateOfHeater.split('|');
        state_indexes.forEach((index_name, index)=>{
          state.heaterParams[index_name] = state_values[index];
        });  
        drawheaterParams(state);
        setGivenTemp(givenTemp);
        showInfo('pong');
        clearInfo();
        setTimeout(()=>getheaterParams(state), refreshingPeriodInSec*1000 );
      } else {
        showInfo(stateOfHeater);
        setTimeout(()=>getheaterParams(state), refreshingAfterError*1000 );
      }
    })
    .catch(function() {
      showInfo('<span style="color:red;">Network error!</span>');
      setTimeout(()=>getheaterParams(state), refreshingAfterError*1000 );
    });
}

const givenTempChangeHandler = (target) => {
  if(target.value != '') {
    console.log(target.value);
  }
}

document.addEventListener('DOMContentLoaded',() => {
  drawTempSetter(MIN_GIVEN_TEMP, MAX_GIVEN_TEMP, GIVEN_TEMP_STEP);
  getheaterParams(state);
  givenTempSetter.addEventListener('click',({target}) => givenTempChangeHandler(target));
});
