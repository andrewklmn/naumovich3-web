const API_URL = 'https://litos.kiev.ua/naumovich/api/';

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
  heaterParameters: {},
};

const state_indexes = 'config_ram|config_rom|mode|out_s0|litos_s1|mebel_s2|hot_s3|back_s4|out_t0|litos_t1|mebel_t2|hot_t3|back_t4|pomp_OFF|heater_OFF'.split("|");

const getHeaterParameters = (state)=> {
  fetch(API_URL + apiCommands.GET_STATE)
    .then(response => response.json())
    .then((json) => {
      const {stateOfHeater} = json; 
      if (stateOfHeater != "Bad request") {
        const state_values = stateOfHeater.split('|');
        state_indexes.forEach((index_name, index)=>{
          state.heaterParameters[index_name] = state_values[index];
        });  
        drawHeaterParameters(state);
      } else {
        showInfo(stateOfHeater)
      }
    })
    .catch(function() {
      console.log('Fetch error');
    });
}

const drawHeaterParameters = ({heaterParameters})=> {
  console.log(heaterParameters);
}

const showInfo = (text)=> {
  console.log(text);
}

document.addEventListener('DOMContentLoaded',() => {
  
  getHeaterParameters(state);

});
