/* 通用工具 */
d3.json("json/16-17season.json",function(d){

  	console.log(d.resultSets[0].headers);
    starShootingChart(d);
 	var data = getShotFreData(d,201565);
	// Derrick Rose  PLAY_ID:201565
  	ShotFrequenByDistance(data);
});

function starShootingChart(data){
  // svg固定宽高
  var width = 400,height=350;
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
      court.setAttributeNS(null,"x",0);
      court.setAttributeNS(null,"y",0);
      court.setAttributeNS(null,"height","290px");
      court.setAttributeNS(null,"width","400px");
      document.getElementsByClassName('svg_SSC')[0].appendChild(court);
}

// 获取球员投篮频率数据
function getShotFreData(data,player_id) {
	//记录当前player_id球员数据
	var dataset = [];
	//统计每个距离出手次数
	var shotTimes = new Array(30);
	var shotPercentage = new Array(30);
	for (var i = shotTimes.length - 1; i >= 0; i--) {
		shotTimes[i] = 0;
	}

	for(var i in data.resultSets[0].rowSet){
		if (data.resultSets[0].rowSet[i][3]==player_id) {
			dataset[dataset.length] = data.resultSets[0].rowSet[i];
			shotTimes[data.resultSets[0].rowSet[i][16]]++;
		}
	}

	var sum = 0;
	//计算每个距离出手百分比
	for (var i = shotPercentage.length - 1; i >= 0; i--) {
		shotPercentage[i] = shotTimes[i] / dataset.length;
		sum += shotPercentage[i];
	}

	// console.log(shotPercentage);
	return shotPercentage;
}

//绘制ShotFrequenByDistance图
function ShotFrequenByDistance(data) {

	var shotFreByDis = [];
	var top = "5%";
	var bottom = "85%";
	var left = "5%";
	var right = "85%";
	var SVG = d3.select(".shotFreByDis")
				.append("svg")
				.attr("width","100%")
				.attr("height","100%");

		// 绘制坐标轴
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
function drawCoordinate(className){
	var top = "5%";
	var bottom = "85%";
	var left = "5%";
	var right = "85%";
	var SVG = d3.select(className)
				.append("svg")
				.attr("width","100%")
				.attr("height","100%");

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
