/*Start by setting up the canvas */
var margin = {t:50,r:50,b:50,l:50};
var width = $('.canvas').width() - margin.r - margin.l,
    height = $('.canvas').height() - margin.t - margin.b;

var canvas = d3.select('.canvas')
    .append('svg')
    .attr('width',width+margin.r+margin.l)
    .attr('height',height + margin.t + margin.b)
    .append('g')
    .attr('class','canvas')
    .attr('transform','translate('+margin.l+','+margin.t+')');

//Let's represent these three data arrays visually, using the enter/exit/update pattern

var circles1 = [
    {x:100, y:300, name:"red", r:50, color:"red"},
    {x:400, y:300, name:"blue", r:50, color:"blue"},
    {x:800, y:300, name:"green", r:50, color:"green"}
];

var circles2 = [
    {x:100, y:300, name:"red", r:80, color:"red"},
    {x:700, y:300, name:"green", r:100, color:"green"}
];

var circles3 = [
    {x:100, y:300, name:"red", r:50, color:"red"},
    {x:400, y:300, name:"blue", r:50, color:"blue"},
    {x:800, y:300, name:"green", r:50, color:"green"},
    {x:800, y:500, name:"purple", r:90, color:"purple"}
];

//First, let's use the enter/exit/update pattern to draw the first set of circles
//canvas.selectAll('circle').data()...