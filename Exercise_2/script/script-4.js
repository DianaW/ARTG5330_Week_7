/* Allow interaction */

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

//Scales
var scaleX = d3.scale.log().range([0,width]),
    scaleY = d3.scale.log().range([height,0]),
    scaleR = d3.scale.sqrt().range([10,50]);

//Axis generator
var axisX = d3.svg.axis()
    .orient('bottom')
    .tickSize(-height,0)
    .scale(scaleX);
var axisY = d3.svg.axis()
    .orient('left')
    .tickSize(-width,0)
    .scale(scaleY);


/* Acquire and parse data */

var data1995, data2010;
//d3.csv('data/world_bank_1995_gdp_co2.csv', parse, dataLoaded);

queue()
    .defer(d3.csv,"data/world_bank_1995_gdp_co2.csv",parse)
    .defer(d3.csv,"data/world_bank_2010_gdp_co2.csv",parse)
    .await(dataLoaded);


function dataLoaded(err,rows0,rows1){

    data1995 = rows0;
    data2010 = rows1;

    //Let's draw 2010 first
    //determine max and min
    scaleX.domain(  d3.extent(data2010,function(d){ return d.gdpPerCap; }));
    scaleY.domain( d3.extent(data2010, function(d){ return d.co2PerCap; }));
    scaleR.domain( d3.extent(data2010, function(d){ return d.co2Total; } ));

    //Draw axes
    canvas.append('g')
        .attr('transform','translate(0,'+height+')')
        .attr('class','axis x')
        .call(axisX);

    canvas.append('g')
        .attr('class','axis y')
        .call(axisY);

    draw(data2010);


    //Allow interaction
    //Why do we place it here?
    $('.btn-group .dropdown-menu .year').on('click',function(e){
        e.preventDefault();
        var year = $(this).data('year');

        if(year == 1995){

        }else if(year == 2010){

        }
    });

}

function draw(data){
    var nodes = canvas.selectAll('.node')
        .data(data, function(d){ return d.cCode});

    var nodesEnter = nodes.enter()
        .append('g')
        .attr('class','node')
        .attr('transform',function(d){
            return 'translate(' + scaleX(d.gdpPerCap) + ',' + scaleY(d.co2PerCap) + ')';
        });
    nodesEnter
        .append('circle')
        .attr('r',0);
    nodesEnter
        .append('text')
        .text(function(d){
            return d.cCode;
        })
        .attr('text-anchor','middle');

    var nodesExit = nodes.exit();

    nodes
        .transition()
        .duration(200)
        .attr('transform',function(d){
            return 'translate(' + scaleX(d.gdpPerCap) + ',' + scaleY(d.co2PerCap) + ')';
        })
        .select('circle')
        .attr('r',function(d){
            return scaleR(d.co2Total);
        });

}

function parse(row){
    //@param row is each unparsed row from the dataset

    var parsedRow = {
      cName: row['Country Name'],
      cCode: row['Country Code'],
      gdpPerCap: +row["GDP per capita, PPP (constant 2011 international $)"],
      co2PerCap: +row["CO2 emissions (metric tons per capita)"],
      co2Total: +row["CO2 emissions (kt)"]
    };

    if( parsedRow.gdpPerCap && parsedRow.co2PerCap && parsedRow.co2Total){
        return parsedRow;
    }
    else{
        return;
    }
}