

let stat = $("input[name='alert_stat']").val()

   if(stat != undefined && stat !="Welcome to Rabac"){
       alert(stat);
   }


function randomInt(min, max) {
    return Math.floor(Math.random() *(max - min)) + min;
}




function show_data(s){  
    const d  = JSON.parse(s);
    var x,y,z;
    [x,y,z] = d.data_0
    getChart1(x,y,z,0,"Heart Beat");
    [x,y,z] = d.data_1
    getChart1(x,y,z,1,"Pulse");
    [x,y,z] = d.data_2
    getChart1(x,y,z,2,"Sample Beat");
    
}


var yAxis = [[],[],[]]
var xAxis = [[],[],[]]
var avgVal = [[],[],[]]
var title = ['ECG_Data','Hear_Beat_Data','Chest_Data']
let simulation;
let n = [0,0,0];
let critical = [0,0,0];
let avg = [0,0,0];

let db1 = $("input[name='p_data']").val()
if(db1 != undefined)
    db1 = db1.split(",").map(x => +x*100)


function start(ind) { 
 
    
    yAxis[ind] = []
    xAxis[ind] = []
    avgVal[ind] = []

    yAxis[ind] = db1;

    critical[ind] = 0;
    n[ind]  = 0;
    avg[ind] = 0;
    Plotly.newPlot(`chart-rt-${ind}`,[{
        y:[db1[0]],
        type:'line',
        name: `${title[ind]}`
    },{
        y:[db1[0]],
        type:'line',
        name:  `Average ${title[ind]}`
    }],
    {
        title: `Patient ${title[ind]}` ,
        yaxis:{
            range: [-50,150]
        }
    });
    if(ind === 1)
    simulation1 = setInterval( function () {init(ind)},300);
    if(ind === 0)
    simulation0 = setInterval( function () {init(ind)},300);
    if(ind === 2)
    simulation2 = setInterval( function () {init(ind)},300);
}

function init(ind) {
    
    let s = avg[ind]*n[ind];
    n[ind]+=1;
   
    t = db1[n[ind]];
    
    if(t > 1.5*avg[ind]){
        critical[ind]+=1;
        $(`#stat_${ind}`)[0].innerHTML = "High"
        $(`#stat_${ind}`).css("color","red");
    }else if(t < .5*avg[ind]){
        $(`#stat_${ind}`)[0].innerHTML = "Low"
        $(`#stat_${ind}`).css("color","blue");
    }else{
        $(`#stat_${ind}`)[0].innerHTML = "Normal"
        $(`#stat_${ind}`).css("color","green");
    }

   
    s+=t;
    avg[ind]= s/n[ind];
    // console.log(avg[ind],n[ind]);
    xAxis[ind].push(n[ind]);
    
    avgVal[ind].push(avg[ind]);

    getChart2(ind,n[ind],t,avg[ind]);
}

function end(ind){
    if(ind === 0)
    clearInterval(simulation0);
    if(ind === 1)
    clearInterval(simulation1);
    if(ind === 2)
    clearInterval(simulation2);
    getChart1(xAxis[ind],yAxis[ind],avgVal[ind],ind);
}

function show(){
    var options = { year: 'numeric', month: 'long', day: 'numeric' };
    var d = new Date();
    var hrs = d.getHours();
    var min = d.getMinutes();
    hrs = hrs > "9" ? hrs : "0"+hrs;
    min = min > "9" ? min : "0"+min;
    d = d.toLocaleDateString("en-US",options)+ "_" + hrs + ':' + min;
    var obj1 = {
        data_0:[xAxis[0],yAxis[0],avgVal[0]],
        data_1:[xAxis[1],yAxis[1],avgVal[1]],
        data_2:[xAxis[2],yAxis[2],avgVal[2]],
    }
    $("input[name='date']").attr("value",d)
    $("input[name='data']").attr("value",JSON.stringify(obj1))
    
}


function getChart2(ind,n,t,avg){ 
    
    Plotly.extendTraces( `chart-rt-${ind}` ,{y : [[t], [avg]]}, [0,1])
        Plotly.relayout( `chart-rt-${ind}` ,{
            xaxis:{
                range:[n-30,n+30]
            },
        })  
}

function getChart1(x,y,average,ind){
  

    if(critical[ind] >= 5)
        alert( `Call Doctor for ${title[ind]}`);

    var ctx = document.getElementById(`chart2-${ind}`).getContext('2d');
    var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: x,
        datasets: [{
            label: `${title[ind]} of Patient`,
            data: y,
            fill:false,
            backgroundColor: 
                'rgba(255, 159, 64, 0.2)'
            ,
            borderColor:                
                'rgba(255, 159, 64, 1)'
            ,
            borderWidth: 1
        },{
            label:`Average ${title[ind]} of Patient`,
            data: average,
            fill:false,
            backgroundColor:'rgba(255, 159, 64, 0.2)',
            borderColor:'blue',
            borderWidth:1
        }]
    }
});
}


