const API_URL = 'http://litos.kiev.ua/naumovich/api/';

const refreshingPeriodInSec = 15;
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

const todayTemp = document.querySelector('.today-temp');
const weekTemp = document.querySelector('.week-temp');

const apiCommands = {
  GET_STATE: '',
  GET_TODAYS_LOG: '?today',
  GET_WEEK_LOG: '?week',
  SET_TEMP: '?temp=',
};

const MIN_GIVEN_TEMP = 5;
const MAX_GIVEN_TEMP = 10;
const GIVEN_TEMP_STEP = 0.2;


const heaterModes = [
  'Off &#128077;',
  'Eco &#127794;',
  'High &#128184;',
];

const state = {
  heaterParams: {},
  givenTemp: '',
  todayStates: [],
  weekStates: [],
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

const drawDay = (fileContent, target, message, timeInterval, tickFormatString) => {
  const OUTDOOR_COLOR = "gray";
  const ZERO_COLOR = "white";
  const FASMEB_COLOR = "darkblue";
  const RUSLAN_COLOR = "darkgreen";
  const POMP_COLOR = "orange";

  target.innerHTML = "<h3>" + message + "</h3>";

  const data = fileContent
                  .filter(data => data != '' )
                  .map(data=>{ 
                    const arr = data.split("|");  
                    return {
                      date: arr[0] + "T" + arr[1],
                      mode: arr[4],
                      outdoorTemp: arr[10],
                      ruslanTemp: arr[11],                
                      fasmebTemp: arr[12],
                      pompTemp: arr[14],
                    };
                });

  const parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%S");

  var margin = {top: 20, right: 20, bottom: 40, left: 50},
    width = document.body.clientWidth - margin.left - margin.right,
    height = 415 - margin.top - margin.bottom;

  // set the ranges
  var x = d3.scaleTime().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);

  // define the 1st line
  var valueline = d3.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.outdoorTemp); });
  
  var zeroTemp = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(0); });

  // define the 2nd line
  var valueline1 = d3.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.ruslanTemp); });

  // define the 3nd line
  var valueline2 = d3.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.fasmebTemp); });

  // define the 4nd line
  var valueline3 = d3.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.pompTemp); });    

  // append the svg obgect to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var svg = d3.select(target).append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .attr("class", "svg")
  .append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

  // format the data
  data.forEach(function(d) {
      const time = parseTime(d.date);
      //d.date = time.setHours(time.getHours()-1);
      d.date = time;
      d.outdoorTemp = +d.outdoorTemp;
      d.ruslanTemp = +d.ruslanTemp;
      d.fasmebTemp = +d.fasmebTemp;
      d.mode = +d.mode;
  });

  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([
    d3.min(data, function(d) { return Math.min(
      d.outdoorTemp, 
      d.ruslanTemp, 
      d.fasmebTemp,
      d.pompTemp
    ) - 2; }), 
    d3.max(data, function(d) { return Math.max(
      d.outdoorTemp, 
      d.ruslanTemp, 
      d.fasmebTemp,
      d.pompTemp
    ) + 5; })
  ]);

  // Add the valueline3 path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .style("stroke-dasharray", ("10,3"))
      .style("stroke", ZERO_COLOR)
      .attr("d", zeroTemp);

  // Add the valueline path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .style("stroke", OUTDOOR_COLOR)
      .attr("d", valueline);

  // Add the valueline3 path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .style("stroke", POMP_COLOR)
      .attr("d", valueline3);

  // Add the valueline1 path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .style("stroke", RUSLAN_COLOR)
      .attr("d", valueline1);

  // Add the valueline2 path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .style("stroke", FASMEB_COLOR)
      .attr("d", valueline2);

  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x)
      .ticks(d3.timeHour.every(timeInterval))
      .tickFormat(d3.timeFormat(tickFormatString)))
      .selectAll("text")	
        .style("text-anchor", "center")
        .attr("dx", "0em");

  // Add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y));

  svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left + 5)
  .attr("x",0 - (height / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("temperature,C"); 

  svg.append("text")             
  .attr("transform",
        "translate(" + (width/2) + " ," + 
                       (height + margin.top + 15) + ")")
  .style("text-anchor", "middle")
  .text("time");

  const startX = width - 100;
  const startY = 0;

  const legend = [
    [POMP_COLOR, "Heater"],
    [RUSLAN_COLOR, "Ruslan"],
    [FASMEB_COLOR, "Fasmeb"],
    [OUTDOOR_COLOR, "Outdoor"],
  ]

  legend.forEach((d, i) => {
    svg.append("circle").attr("cx",startX).attr("cy", startY + i*15).attr("r", 4).style("fill", d[0])
    svg.append("text")
       .attr("x", startX + 10)
       .attr("y", startY + i*15 + 4)
       .text(d[1])
       .style("font-size", "12px")
       .attr("alignment-baseline","middle")
  });
  
};

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

const getDayLog = (state)=> {
  fetch(API_URL + apiCommands.GET_TODAYS_LOG)
    .then(response => response.json())
    .then((json) => {
      const {records} = json;
      if (records.length) {
        state.todayStates = records;
        drawDay(state.todayStates, todayTemp, 'Last 24 hours temp:', ((document.body.clientWidth<400)?3:2),"%H:%M");
      };
      setTimeout(()=>getDayLog(state), refreshingAfterError*60*2*1000 );
    })
    .catch(function() {
      showInfo('<span style="color:red;">No connection to litos.kiev.ua!</span>');
      setTimeout(()=>getDayLog(state), refreshingAfterError*1000 );
    });
}

const getWeekLog = (state)=> {
  fetch(API_URL + apiCommands.GET_WEEK_LOG)
    .then(response => response.json())
    .then((json) => {
      const {records} = json;
      if (records.length) {
        state.weekStates = records;
        drawDay(state.weekStates, weekTemp, 'Last 7 days temp:', 24, "%d.%m");
      };
      setTimeout(()=>getWeekLog(state), refreshingAfterError*60*2*1000 );
    })
    .catch(function() {
      showInfo('<span style="color:red;">No connection to litos.kiev.ua!</span>');
      setTimeout(()=>getWeekLog(state), refreshingAfterError*1000 );
    });
}

window.addEventListener('resize',() => {
  drawDay(state.todayStates, todayTemp, 'Last 24 hours temp:', ((document.body.clientWidth<400)?3:2), "%H:%M");
  drawDay(state.weekStates, weekTemp, 'Last 7 days temp:', 24, "%d.%m");
});

document.addEventListener('DOMContentLoaded',() => {
  drawTempSetter(MIN_GIVEN_TEMP, MAX_GIVEN_TEMP, GIVEN_TEMP_STEP);
  getHeaterParams(state);
  givenTempSetter.addEventListener('change',({target}) => givenTempChangeHandler(target, state));
  getDayLog(state);
  getWeekLog(state);
});
