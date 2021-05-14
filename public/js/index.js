

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
 getChart1(x,y,z,0,"Heart");
 [x,y,z] = d.data_1
 getChart1(x,y,z,1,"Pulse");
 [x,y,z] = d.data_2
 getChart1(x,y,z,2,"Chest");
 
}


var yAxis = [[],[],[]]
var xAxis = [[],[],[]]
var avgVal = [[],[],[]]
var title = ['ECG_Data','Heart_Beat_Data','Chest_Data']
let simulation;
let n = [0,0,0];
let critical = [0,0,0];
let avg = [0,0,0];
let temp = [[],[],[]]
let sm = [0,0,0]
let max = [0,0,0]
let min = [0,0,0]

let db1 = JSON.parse($("input[name='p_data']").val())



function start(ind) { 

 if(db1 != undefined)
 temp[ind] = db1[ind].split(",").map(x => +x*100)

 

 yAxis[ind] = []
 xAxis[ind] = []
 avgVal[ind] = []

 yAxis[ind] = temp[ind];

 max[ind]  = temp[ind][0];
 min[ind] = temp[ind][0]
 critical[ind] = 0;
 n[ind]  = 0;
 avg[ind] = 0;
 Plotly.newPlot(`chart-rt-${ind}`,[{
     y:[temp[ind][0]],
     type:'line',
     name: `${title[ind]}`
 },{
     y:[temp[ind][0]],
     type:'line',
     name:  `Average ${title[ind]}`
 }],
 {
     title: `Patient ${title[ind]}` ,
     yaxis:{
         range: [0,300]
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



 t = temp[ind][n[ind]];


 max[ind] = Math.max(max[ind],t);
 min[ind] = Math.min(min[ind],t);

 if(n[ind] <= 50){
    sm[ind]+=t;
}else{
    sm[ind]-=temp[ind][n[ind]-50];
}

if(critical[ind] >= 5){
    end(ind);
    alert( `Call Doctor for ${title[ind]}`);
}

 
if(n[ind] >= 4){
    if(Math.abs(temp[ind][n[ind]-1] - temp[ind][n[ind]-2]) >= 0.7*(max[ind]-min[ind])){
        critical[ind]+=1;

        $(`#stat_${ind}`)[0].innerHTML = "Abrupt"
        $(`#stat_${ind}`).css("color","orange");
    }else if(t > temp[ind][n[ind]-1] && temp[ind][n[ind]-1] > temp[ind][n[ind]-2]){
        $(`#stat_${ind}`)[0].innerHTML = "Incremental"
        $(`#stat_${ind}`).css("color","green");
    }else if(t < temp[ind][n[ind]-1] && temp[ind][n[ind]-1] < temp[ind][n[ind]-2]){
       $(`#stat_${ind}`)[0].innerHTML = "Decremental"
       $(`#stat_${ind}`).css("color","green");
   }else{
        $(`#stat_${ind}`)[0].innerHTML = "Recurring"
        $(`#stat_${ind}`).css("color","yellow");
    }
}else{
    $(`#stat_${ind}`)[0].innerHTML = "Collecting Data..."
    $(`#stat_${ind}`).css("color","blue");
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


