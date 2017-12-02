/* 通用工具 */
d3.json("json/16-17season.json",function(d){

  	console.log(d.resultSets[0].headers);
    starShootingChart(d);
 	  var data = getShotFreData(d,currentStarId);
	// Derrick Rose  PLAY_ID:201565
  	ShotFrequenByDistance(data);
});

function starShootingChart(data){
  // svg固定宽高
  var width = 520,height = 450;
  var xmlns = "http://www.w3.org/2000/svg";
  var version = 1.1;
  var svg = d3.selectAll('.starShootingChart')
              .append('svg')
              .attr("class","svg_SSC")
              .attr("width",width)
              .attr("height",height)
              .attr("version",version)
              .attr("xmlns",xmlns);

  //通过创建 xmlns向svg添加image图像
  var court = document.createElementNS(xmlns,"image");
      court.href.baseVal = "img/uipic/court.png";
      court.setAttributeNS(null,"x",20);
      court.setAttributeNS(null,"y",0);
      court.setAttributeNS(null,"width","500px");
      court.setAttributeNS(null,"height","362px");
      document.getElementsByClassName('svg_SSC')[0].appendChild(court);

  // 篮筐中心点(250,40);
  var dataset = getShotDetailData(data);

  // 定义比例尺
  var xScale = d3.scale.linear()
                       .domain([-250,250])
                       .range([20,width]);

  var yScale = d3.scale.linear()
                       .domain([0,470])
                       .range([40,522]);
  //定义坐标轴
  var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .ticks(8);
  var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("right")
                    .ticks(10);
 //绘制坐标轴
  /*d3.selectAll(".svg_SSC")
    .append("g")
    .attr("class","axis")
    .call(xAxis)
    .attr("transfrom","translate(20, " + width - 20 +")")
    .append("text")
    .text("x轴")
    .attr("transfrom","translate(" + width - 20 + ",20)");

    d3.selectAll(".svg_SSC")
      .append("g")
      .attr("class","axis")
      .call(yAxis)
      .attr("transfrom","translate(0, " + height +")")
      .append("text")
      .text("y轴")
      .attr("transfrom","translate(" + height + ",0)");*/

  d3.selectAll(".svg_SSC")
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x",function(d){
      return xScale(d.loc_x);
    })
    .attr("y",function(d){
      return yScale(d.loc_y);
    })
    .attr("width",8)
    .attr("height",8)
    .attr("fill",function(d){
      if(d.action_type === 0){
        return "#66fff6";
      }else {
        return "#F40000";
      }
    })
    .on("mouseover",function(d){
      d3.select(this)
        .attr("stroke-width",2)
        .attr("stroke","#05b80c");
    })
    .on("mouseout",function(d){
      d3.select(this)
        .attr("stroke-width",0)
        .attr("stroke","rgba(255,255,255,0)");
    });
}

//获取球员投篮命中与否 距离 位置。
function getShotDetailData(data){
  //处理数据
  var curentStarShotData = [];
  for(var i in data.resultSets[0].rowSet){
    if(data.resultSets[0].rowSet[i][3] == currentStarId){
      var el = {};
      if(data.resultSets[0].rowSet[i][10] === "Missed Shot"){
        el.action_type = 0;
      }else {
        el.action_type = 1;
      }
      // el.action_type = data.resultSets[0].rowSet[i][10],
      el.distance = data.resultSets[0].rowSet[i][16],
      el.loc_x = data.resultSets[0].rowSet[i][17],
      el.loc_y = data.resultSets[0].rowSet[i][18];
      curentStarShotData.push(el);
    }
  }
  // 得到当前投篮位置 距离 命中与否、
  console.log(curentStarShotData);
  return curentStarShotData;
}

// 返回球员投篮频率数据
function getShotFreData(data,player_id) {
	//记录当前player_id球员数据
	var dataset = getData(data,player_id);
	//统计每个距离出手次数
	var shotTimes = new Array(30);
	var shotPercentage = new Array(30);

  //初始化
	for (var i = shotTimes.length - 1; i >= 0; i--) {
		shotTimes[i] = 0;
	}
  //统计每个距离出手次数
  for(i = 0; i < dataset.length ; i++){
    shotTimes[data.resultSets[0].rowSet[i][16]]++;
  }
	//计算每个距离出手百分比
	for (i = shotPercentage.length - 1; i >= 0; i--) {
		shotPercentage[i] = shotTimes[i] / dataset.length;
	}
	return shotPercentage;
}

//绘制ShotFrequenByDistance图
function ShotFrequenByDistance(data) {

	var top = "5%";
	var bottom = "85%";
	var left = "5%";
	var right = "85%";
	var SVG = d3.select(".shotFreByDis")
				.append("svg")
				.attr("width","100%")
				.attr("height","100%");

	drawCoordinate(SVG,".shotFreByDis")

  //获取当前DOM宽高
	var div = document.getElementById("shotFreByDis");
	var width = div.offsetWidth;	//456
	var height = div.offsetHeight;	//300
	console.log(width*top);

	// 设置比例尺
	var xScale = d3.scale.linear()
					.domain([1,30])
					.range([width*0.1,width - width*0.1]);
	var yScale = d3.scale.linear()
					.domain([0,0.25])
					.range([50,height]);

	//绘制散点
	var circles = SVG.selectAll("circle")
					.data(data)
					.enter()
					.append("circle");

	circles.attr("cx",function (d,i) {
				return xScale(i);
			})
			.attr("cy",function (d,i){
				return height - yScale(d);
			})
			.attr("r","5")
			.attr("fill","Salmon");
}

//绘制坐标
function drawCoordinate(SVG,className){
	var top = "5%";
	var bottom = "85%";
	var left = "5%";
	var right = "85%";

		SVG.append("line")
			.attr("x1",left)
			.attr("y1",left)
			.attr("x2",left)
			.attr("y2",bottom)
			.attr('stroke-width', '1')
			.attr("stroke","black");
		SVG.append("line")
			.attr("x1",left)
			.attr("y1",bottom)
			.attr("x2",right)
			.attr("y2",right)
			.attr('stroke-width', '1')
			.attr("stroke","black");
}

//获取当前ID球员投篮数据
function getData(data,player_id){
  var dataset = [];

  for(var i in data.resultSets[0].rowSet){
    if (data.resultSets[0].rowSet[i][3]==player_id) {
      dataset[dataset.length] = data.resultSets[0].rowSet[i];
    }
  }
  return dataset;
}