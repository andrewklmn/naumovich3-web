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
const loaderImage = document.querySelector('.loader');
const givenTempSetter = document.querySelector('.given-temp');
const info = document.querySelector('.info');

const apiCommands = {
  GET_STATE: '',
  GET_TODAYS_LOG: '?today',
  GET_FULL_LOG: '?week',
  SET_TEMP: '?temp=',
};

const MIN_GIVEN_TEMP = 5;
const MAX_GIVEN_TEMP = 10;
const GIVEN_TEMP_STEP = 0.2;


const heaterModes = [
  'Off',
  'Eco',
  'High',
];

const state = {
  heaterParams: {},
  givenTemp: '',
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
  state.givenTemp = givenTempSetter.value = temp;  
  givenTempSetter.disabled = false;
  givenTempSetter.classList.remove('loading');
  loaderImage.classList.add('hidden');
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

const getHeaterParams = (state)=> {
  showInfo('<span style="color:white;">ping</span>');
  loaderImage.classList.remove('hidden');

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
        if (!givenTempSetter.classList.contains('loading')) setGivenTemp(givenTemp);
        showInfo('pong');
        clearInfo();
        setTimeout(()=>getHeaterParams(state), refreshingPeriodInSec*1000 );
      } else {
        showInfo(stateOfHeater);
        setTimeout(()=>getHeaterParams(state), refreshingAfterError*1000 );
      }
      loaderImage.classList.add('hidden');
    })
    .catch(function() {
      showInfo('<span style="color:red;">Network error!</span>');
      loaderImage.classList.add('hidden');
      setTimeout(()=>getHeaterParams(state), refreshingAfterError*1000 );      
    });
}

const givenTempChangeHandler = (target, state) => {
  const {givenTemp} = state;
  if(target.value != ''
      && target.value != givenTemp ) {

    givenTempSetter.classList.add('loading');
    givenTempSetter.disabled = true;

    postNewTemp(target.value, state);
  }
}

const postNewTemp = (temp, state) => {
  loaderImage.classList.remove('hidden');
  
  fetch(API_URL + apiCommands.SET_TEMP + temp)
    .then(response => response.json())
    .then((json) => {
      const {givenTemp} = json; 
      setGivenTemp(givenTemp);
      if (givenTemp != temp) {
        showInfo("<span style='color:red;'>Can't set this temp!</span>");
      };
      loaderImage.classList.add('hidden');
    })
    .catch(function() {
      showInfo('<span style="color:red;">Network error!</span>');
      loaderImage.classList.add('hidden');
    });
};

document.addEventListener('DOMContentLoaded',() => {
  drawTempSetter(MIN_GIVEN_TEMP, MAX_GIVEN_TEMP, GIVEN_TEMP_STEP);
  getHeaterParams(state);
  givenTempSetter.addEventListener('change',({target}) => givenTempChangeHandler(target, state));
});
