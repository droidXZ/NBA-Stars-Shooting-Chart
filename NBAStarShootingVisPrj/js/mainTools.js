/* 通用工具 */
// 调用加载json数据进行绘制

//tooltip提示框
  //添加一个提示框
  var tooltip1 = d3.select("body")
                  .append("div")
                  .attr("class","tooltip2")
                  .style("opacity",0.0);

  //添加一个提示框
  var tooltip2 = d3.select("body")
                  .append("div")
                  .attr("class","tooltip2")
                  .style("opacity",0.0);
  //添加一个提示框
  var tooltip3 = d3.select("body")
                  .append("div")
                  .attr("class","tooltip3")
                  .style("opacity",0.0);
  //添加一个提示框
  var tooltip4 = d3.select("body")
                  .append("div")
                  .attr("class","tooltip4")
                  .style("opacity",0.0);

//添加svg
var svg0,svg1,svg2,svg3,svg4;

var padding = 50;
  //获取当前DOM宽高
  var div = d3.select(".shotFreByDis");
  var width = div[0][0].offsetWidth;  //456
  var height = div[0][0].offsetHeight;  //400

function createSvg(){
  svg0 = d3.selectAll('.starShootingChart')
              .append('svg')
              .attr("class","svg_SSC")
              .attr("width",500)
              .attr("height",362)
              .attr("version",1.1)
              .attr("xmlns","http://www.w3.org/2000/svg");

  svg1 = d3.select(".shotFreByDis")
              .append("svg")
              .attr("width",width)
              .attr("height",height);
  svg2 = d3.select(".shotFGByDis")
              .append("svg")
              .attr("width",width)
              .attr("height",height);
  svg3 = d3.select(".shotFreLeftVsRight")
              .append("svg")
              .attr("width",width)
              .attr("height",height);
  svg4 = d3.select(".shotFGLeftVsRight")
              .append("svg")
              .attr("width",width)
              .attr("height",height);
}
//移除svg
function removeSvg(){
  d3.selectAll('svg')
    .remove();
}

function starShootingChart(data){
  // svg固定宽高
  var width = 500,height = 500;
  var xmlns = "http://www.w3.org/2000/svg";
  var version = 1.1;

  svg = svg0;
  //通过创建 xmlns向svg添加image图像
  var court = document.createElementNS(xmlns,"image");
      court.href.baseVal = "img/uipic/court.png";
      court.setAttributeNS(null,"x",0);
      court.setAttributeNS(null,"y",0);
      court.setAttributeNS(null,"width","500px");
      court.setAttributeNS(null,"height","362px");
      document.getElementsByClassName('svg_SSC')[0].appendChild(court);
  // 篮筐中心点(250,40);
  var dataset = getShotDetailData(data);

  // 定义比例尺
  var xScale = d3.scale.linear()
                       .domain([-250,250])
                       .range([0,500]);

  var yScale = d3.scale.linear()
                       .domain([0,320])
                       .range([40,360]);
  //定义坐标轴
  var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .ticks(8);
  var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("right")
                    .ticks(10);

  d3.selectAll(".svg_SSC")
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x",function(d){
      if(yScale(d.loc_y) <= 350)
        return xScale(d.loc_x);
    })
    .attr("y",function(d){
      if(yScale(d.loc_y) <=350)
        return yScale(d.loc_y);
    })
    .attr("width",8)
    .attr("height",8)
    .attr("fill",function(d){
      if(d.action_type === 0){
        return "rgba(83, 87, 161, 1)";
      }else {
        return "rgba(173, 42, 71, 1)";
      }
    })
    .on("click",function(d){
      d3.select(this)
        .attr("stroke-width",2)
        .attr("stroke","#05b80c");
      console.log(d.distance + "|" + d.loc_x + "|" +d.loc_y);
    })
    .on("mouseout",function(d){
      d3.select(this)
        .attr("stroke-width",0)
        .attr("stroke","rgba(255,255,255,0)");
    });

    svg.append("circle").attr("class","circleClass");//用于mouseover事件
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
function getShotFreData(data) {

	//统计每个距离出手次数
	var shotTimes = new Array(31);
	var shotPercentage = [];

  //初始化
	for (var i = shotTimes.length - 1; i >= 0; i--) {
		shotTimes[i] = 0;
	}
  //统计每个距离出手次数
  for(i = 0; i < data.length ; i++){
    shotTimes[data[i][16]]++;
  }

  var item = {};
  var el = [];
	//计算每个距离出手百分比
	for (i = 0; i <= 30; i++) {
		el[el.length] = shotTimes[i] / data.length;
	}
  item.Fre = el;
  shotPercentage.push(item);
	return shotPercentage;
}

//绘制ShotFrequenByDistance图
function drawShotFreByDis(data) {

  SVG = svg1;

  SVG.append("line").attr("class","lineClass1");//用于Mouseover事件
  // 设置比例尺
  var xScale = d3.scale.linear()
                        .domain([0,30])
                        .range([padding,width - padding]);
  var yScale = d3.scale.linear()
                        .domain([0,0.25])
                        .range([padding,height - padding]);

  var dataset = data[0].Fre;
  //绘制散点
  var circles = SVG.selectAll("circle")
                    .data(dataset)
                    .enter()
                    .append("circle")
                    .attr("r",5)
                    .attr("cx",function(d,i){
                      return xScale(i);
                    })
                    .attr("cy",function(d,i){
                      return height - yScale(d);
                    })
                    .attr("fill","transparent");

            SVG.on("mousemove",function(){
              var x = d3.event.offsetX;
              var y = d3.event.offsetY;
              if(x<=width-padding&&x>=padding&&y>=padding&&y<=height-padding){
                //每一段的长度
                var div = (width-2*padding)/31;
                var index = Math.floor((x-padding)*2/div);

                //显示提示框
                showTooltip(index,tooltip1,tooltip2,tooltip3,tooltip4);
                //显示选中的矩形
                LeftVsRightMouseover(index);
                }
              else{
                LeftVsRightMouseover(-1);
              }
              })
              .on("mouseout",function(){
                hideTooltip(tooltip1,tooltip2,tooltip3,tooltip4);
              });

  //绘制标题
  drawTitle(SVG,"Shot Frequency % by Distance");
  //绘制折线图
  drawLineChart(SVG,data,"Fre",xScale,yScale);
  //绘制坐标轴
	drawCoordinate(SVG,".shotFreByDis",0,30,0,25);
}

// 返回球员投篮命中率数据
function getShotFGData(data) {
  //出手次数
  var shotTimes = new Array(31);
  //命中次数
  var goalTimes = new Array(31);
  var goalPercentage = [];

  //初始化
  for (var i = goalTimes.length - 1; i >= 0; i--) {
    shotTimes[i] = 0;
    goalTimes[i] = 0;
  }

  //计算每个距离出手次数和命中次数
  for(i = 0; i < data.length ; i++){
    shotTimes[data[i][16]]++;
    if (data[i][10] == "Made Shot") {
      goalTimes[data[i][16]]++;
    }
  }

  var item = {};
  var el = [];
  //计算每个距离命中率
  for (i = 0; i <= 30; i++) {
    if(shotTimes[i] == 0){
      el[el.length] = 0;
    }else {
      el[el.length] = goalTimes[i] / shotTimes[i];
    }
  }

  item.FG = el;
  goalPercentage.push(item);

  return goalPercentage;
}

//绘制球员各距离命中率图像
function drawShotFGByDis(data){
  SVG = svg2;

// 设置比例尺
  var xScale = d3.scale.linear()
          .domain([0,30])
          .range([padding,width - padding]);
  var yScale = d3.scale.linear()
          .domain([0,1])
          .range([padding,height - padding]);
  SVG.append("line").attr("class","lineClass1");//用于Mouseover事件

  var dataset = data[0].FG;

  //绘制散点
  var circles = SVG.selectAll("circle")
                    .data(dataset)
                    .enter()
                    .append("circle")
                    .attr("r",5)
                    .attr("cx",function(d,i){
                      return xScale(i);
                    })
                    .attr("cy",function(d,i){
                      return height - yScale(d);
                    })
                    .attr("fill","transparent");

  //添加一个提示框
  var tooltip = d3.select("body")
                  .append("div")
                  .attr("class","tooltip")
                  .style("opacity",0.0);

    SVG.on("mousemove",function(d,i){
      var x = d3.event.offsetX;
      var y = d3.event.offsetY;

      if(x<=width-padding&&x>=padding&&y>=padding&&y<=height-padding){
        //每一块的长度
        var div = (width-2*padding)/31;

        var index = (x-padding)*2/div;

        //显示提示框
        showTooltip(index,tooltip1,tooltip2,tooltip3,tooltip4);

        LeftVsRightMouseover(Math.floor((x-padding)*2/div));
        }
      else{
        LeftVsRightMouseover(-1);
      }
    })
    .on("mouseout",function(){
      hideTooltip(tooltip1,tooltip2,tooltip3,tooltip4);
    });

  //绘制标题
  drawTitle(SVG,"Field Goal % by Distance");
  //绘制折线图
  drawLineChart(SVG,data,"FG",xScale,yScale);
  //绘制坐标轴
  drawCoordinate(SVG,'.shotFGByDis',0,30,0,100);
}

//绘制折线图
function drawLineChart(SVG,data,dataName,xScale,yScale){

  var div = d3.select(".shotFGByDis");
  var width = div[0][0].offsetWidth;  //456
  var height = div[0][0].offsetHeight;  //400
  var padding = 50;

  var linePath=d3.svg.line()//创建一个直线生成器
                      .x(function(d,i){
                        return xScale(i) - padding;
                      })
                      .y(function(d){
                        return height - yScale(d) - padding;
                      });

  SVG.selectAll("path")
      .data(data)
      .enter()
      .append("path")
      .attr("transform","translate("+padding+","+padding+")")
      .attr("d",function(d){
        return linePath(d[dataName]);//返回线段生成器得到的路径
      })
      .attr("fill","none")
      .attr("stroke-width",2)
      .attr("stroke","Salmon");
}

//绘制坐标
function drawCoordinate(SVG,className,xMin,xMax,yMin,yMax){
	//获取当前DOM宽高
  var div = d3.select(className);
  var width = div[0][0].offsetWidth;  //456
  var height = div[0][0].offsetHeight;  //400
  var padding = 50;

  // 设置比例尺
  xScale = d3.scale.linear()
          .domain([xMin,xMax])
          .range([0,width - padding*2]);
  yScale = d3.scale.linear()
          .domain([yMax,yMin])
          .range([0,height - padding*2]);

  var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(6);
  var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .ticks(5);

  SVG.append("g")
      .attr("class","axis")
      .attr("transform","translate(" + padding +"," + (height - padding) + ")")
      .call(xAxis);

  SVG.append("g")
      .attr("class","axis")
      .attr("transform","translate(" + padding +","+ padding +")")
      .call(yAxis);
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

//绘制标题
function drawTitle(SVG,title){
  var padding = 50;

  SVG.append("text")
      .attr("x",padding)
      .attr("y",padding/2)
      .attr("font-size",18)
      .attr("font-family","微软雅黑")
      .text(title);
}

//显示当前选中
function showCurSelectedpPoint(index){

  //添加一个提示框
  var tooltip = d3.select("body")
                  .append("div")
                  .attr("class","tooltip")
                  .style("opacity",0.0);


  d3.select(".shotFGByDis")
    .selectAll("circle")
    .attr("fill",function(d,i){
      if(index/2 >= i && index/2 < i + 1) return "Salmon";
      else return "transparent";
    })
    .attr("stroke",function(d,i){
      if(index/2 >= i && index/2 < i + 1) return "DarkTurquoise";
      else return "transparent";
    })
    .attr("stroke-width",3);

  d3.select(".shotFreByDis")
    .selectAll("circle")
    .attr("fill",function(d,i){
      if(index/2 >= i && index/2 < i + 1) return "Salmon";
      else return "transparent";
    })
    .attr("stroke",function(d,i){
      if(index/2 >= i && index/2 < i + 1) return "DarkTurquoise";
      else return "transparent";
    })
    .attr("stroke-width",3);
}

// var text = d3.select(".shotFreByDis")
//               .append("text")

function showTooltip(index,tooltip1,tooltip2,tooltip3,tooltip4){
  var left,top;
  var yScale = d3.scale.linear()
                       .domain([0,0.25])
                       .range([padding,height - padding]);
  d3.select(".shotFreByDis")
    .selectAll("circle")
    .attr("",function(d,i){
      if(index/2 >= i && index/2 < i + 1){
        if (i<=24) {
          left = 15 * i;
        }
        else{
          left = 15 * i - 100;
        }
        tooltip1.html("distance: " + i + "ft" + "<br/>" + "Fre %: " + Math.round(d*100) + "%")
                .style("left", (810 + left) + "px")
                .style("top", (120 + 400 - yScale(d)) + "px")
                .style("opacity",0.8);
      }
  })
  yScale = d3.scale.linear()
                       .domain([0,1])
                       .range([padding,height - padding]);
  d3.select(".shotFGByDis")
    .selectAll("circle")
    .attr("",function(d,i){
      if(index/2 >= i && index/2 < i + 1){
        if (i<=24) {
          left = 15 * i;
        }
        else{
          left = 15 * i - 100;
        }
        tooltip2.html("distance: " + i + "ft" + "<br/>" + "FG %: " + Math.round(d*100) + "%")
                .style("left", (810 + left) + "px")
                .style("top", (520 + 400 - yScale(d)) + "px")
                .style("opacity",0.8);
      }
    })

  var data = [];
  d3.select(".shotFreLeftVsRight")
    .selectAll("rect")
    .attr("",function(d,i){
      data[data.length] = d;
    })
    .attr("",function(d,i){
      if(index/2 >= i && index/2 < i + 1){
          if (i<=24) {
            top = 9.67741935483871 * i;
          }
          else{
            top = 9.67741935483871 * i - 50;
          }
          leftData = Math.round(data[i*2]);
          rightData = Math.round(data[i*2+1]);

          tooltip3.html("distance: " + i + "ft" + "<br/>" +
                      "left " + "Fre : " + leftData + "%" + "<br/>" +
                      "right " + "Fre : " + rightData + "%")
                .style("left", (1660) + "px")
                .style("top", (410 - top) + "px")
                .style("opacity",0.8);
      }
  })

  d3.select(".shotFreLeftVsRight")
    .selectAll("rect")
    .attr("",function(d,i){
      data[data.length] = d;
    })
    .attr("",function(d,i){
      if(index/2 >= i && index/2 < i + 1){
          if (i<=24) {
            top = 9.67741935483871 * i;
          }
          else{
            top = 9.67741935483871 * i - 50;
          }
          leftData = Math.round(data[i*2]);
          rightData = Math.round(data[i*2+1]);

          tooltip4.html("distance: " + i + "ft" + "<br/>" +
                      "left " + "FG %: " + leftData + "%" + "<br/>" +
                      "right " + "FG %: " + rightData + "%")
                .style("left", (1660) + "px")
                .style("top", (810 - top) + "px")
                .style("opacity",0.8);
      }
  })
}

//隐藏tooltip提示框
function hideTooltip(tooltip1,tooltip2,tooltip3,tooltip4){

  tooltip1.style("opacity",0.0);
  tooltip2.style("opacity",0.0);
  tooltip3.style("opacity",0.0);
  tooltip4.style("opacity",0.0);

}

/*******************************************************************************************************/

/**
 * 得到每个距离下的左右 投篮数和进球数
 * data id筛选后的数据
 * shot_right 右边的投篮数
 * goal_right 右边的命中数
 * shot_left  左边的投篮数
 * goal_left  左边的命中数
 */
function getGoalByDistance(data){
	var shotRight = new Array(31);
	var shotLeft = new Array(31);
	var goalRight = new Array(31);
	var goalLeft = new Array(31);
	for(var i=0;i<=30;i++) {
		shotRight[i] = 0;
		goalRight[i] = 0;
		shotLeft[i] = 0;
		goalLeft[i] = 0;
	}
	var len = data.length;
	for(i = 0;i<len;i++){
		var distance = data[i][16];
		var x = data[i][17];

		if(distance>30) continue;
		if(x<0){
			shotLeft[distance]++;
			if(!(data[i][10] === "Missed Shot")){
				goalLeft[distance]++;
			}
		}
		else{
			shotRight[distance]++;
			if(!(data[i][10] === "Missed Shot")){
				goalRight[distance]++;
			}
		}
	}
	var resData = [];
	for(i=0;i<=30;i++){
		var e = {};
		e.shot_right =  shotRight[i];
		e.goal_right =  goalRight[i];
		e.shot_left =  shotLeft[i];
		e.goal_left =  goalLeft[i];
		resData.push(e);
	}
	return resData;
}

/**
 * 绘制左右对比的投篮频率图
 */
function drawShotFreLR(data){

	var mid = width/2;
	var div = (height-2*padding)/31;
  svg = svg3;
  //绘制标题
  drawTitle(svg,"Shot Frequency:Left Side vs. Right Side");
  //绘制坐标轴
	drawCoordinate(svg,".shotFreLeftVsRight",100,100,0,30);
	svg.append("line")
			.attr("x1",mid)
			.attr("y1",padding)
			.attr("x2",mid)
			.attr("y2",height-padding)
			.attr('stroke-width', '1')
			.attr("stroke","gray");
	svg.append("line").attr("class","lineClass2");
	svg.append("line").attr("class","lineClass");
	var dataset = getGoalByDistance(data);
	var maxShot = 0;
	var shotData = [];
	for(i=0;i<=30;i++){
		shotData.push(dataset[i].shot_left);
		shotData.push(dataset[i].shot_right);
		if(maxShot<dataset[i].shot_left) maxShot = dataset[i].shot_left;
		if(maxShot<dataset[i].shot_right) maxShot = dataset[i].shot_right;
	}
	var divW;
	if(maxShot<100) divW = (mid-padding)/100;
	else divW = (mid-padding)/maxShot;

	svg.selectAll("rect")
			.data(shotData)
			.enter()
			.append("rect")
			.attr("fill", function(d,i){
				if(i % 2 === 0) return "rgba(117, 205, 117, 0.6)";
				else return "rgba(187, 139, 230, 0.6)";})
		  .attr("x", function(d,i){
		    	if(i%2 === 0)return mid-divW*shotData[i];
		    	else return mid;})
			.attr("y", function(d,i) {
				if(i%2 === 0) return height-padding-div*(i/2+1);
				else return height-padding-div*((i-1)/2+1);})
			.attr("width", function(d,i) {return divW*shotData[i];})
			.attr("height",div);
	drawLineChartLR(svg,shotData,mid,divW,height,div);
	drawFlag(svg,div);
	drawScaleLR(svg,mid,height,divW*100,100);
  //添加一个提示框
  var tooltip = d3.select("body")
                  .append("div")
                  .attr("class","tooltip")
                  .style("opacity",0.0);

	svg.on("mousemove",function(){
		var x = d3.event.offsetX;
		var y = d3.event.offsetY;
    var index = Math.floor((height-padding-y)*2/div);
		if(x<=width-padding&&x>=padding&&y>=padding&&y<=height-padding){
      showTooltip(index,tooltip1,tooltip2,tooltip3,tooltip4);
			LeftVsRightMouseover(index);
		}
		else{
			LeftVsRightMouseover(-1);
		}
	})
  .on("mouseout",function(){
    hideTooltip(tooltip1,tooltip2,tooltip3,tooltip4);
  });
}

/**
 * 绘制左右对比的命中率图
 */
function drawFieldGoalLR(data){

	var mid = width/2;
	var div = (height-2*padding)/31;
	svg = svg4;

  //绘制标题
  drawTitle(svg,"Field Goal%:Left Side vs. Right Side");
  //绘制坐标轴
	drawCoordinate(svg,".shotFGLeftVsRight",0,0,0,30);
	svg.append("line")
			.attr("x1",mid)
			.attr("y1",padding)
			.attr("x2",mid)
			.attr("y2",height-padding)
			.attr('stroke-width', '1')
			.attr("stroke","gray");
	svg.append("line").attr("class","lineClass2");
	var dataset = getGoalByDistance(data);
	var shotData = [];
	for(i=0;i<=30;i++){
    if(dataset[i].shot_left!=0)
		  shotData.push(dataset[i].goal_left/dataset[i].shot_left);
    else shotData.push(0);
    if(dataset[i].shot_right!=0)
		  shotData.push(dataset[i].goal_right/dataset[i].shot_right);
    else shotData.push(0);
	}
	var divW = (mid-padding)/100;

	svg.selectAll("rect")
			.data(shotData)
			.enter()
			.append("rect")
			.attr("fill", function(d,i){
				if(i % 2 === 0) return "rgba(117, 205, 117, 0.6)";
				else return "rgba(187, 139, 230, 0.6)";})
		    .attr("x", function(d,i){
		    	if(i%2 === 0)return mid-divW*shotData[i]*100;
		    	else return mid;})
			.attr("y", function(d,i) {
				if(i%2 === 0) return height-padding-div*(i/2+1);
				else return height-padding-div*((i-1)/2+1);})
			.attr("width", function(d,i) {return divW*shotData[i]*100;})
			.attr("height",div)

	drawLineChartLR(svg,shotData,mid,divW*100,height,div);
	drawFlag(svg,div);
  drawScaleLR(svg,mid,height,divW*50,0.5);
	svg.on("mousemove",function(d,i){
		var x = d3.event.offsetX;
		var y = d3.event.offsetY;
		if(x<=width-padding&&x>=padding&&y>=padding&&y<=height-padding){

      var index = Math.floor((height-padding-y)*2/div);
      //添加提示框
      showTooltip(index,tooltip1,tooltip2,tooltip3,tooltip4);
			LeftVsRightMouseover(index);
		}
		else{
			LeftVsRightMouseover(-1);
      hideTooltip(tooltip1,tooltip2,tooltip3,tooltip4);
		}
	})
  .on("mouseout",function(){

  });

}

/**
 * 刻度
 */
function drawScaleLR(svg,mid,height,len,num){
	var padding = 50;
	svg.append("line").attr("x1",mid-len).attr("x2",mid-len)
								    .attr("y1",height-padding).attr("y2",height-padding+6)
								    .attr("stroke","black").attr("shape-rendering","crispEdges");
	svg.append("text").text(num.toString()).attr("x",mid-len-15).attr("y",height-padding+20).attr("font-weight","bold");
	svg.append("line").attr("x1",mid).attr("x2",mid)
								    .attr("y1",height-padding).attr("y2",height-padding+6)
								    .attr("stroke","black").attr("shape-rendering","crispEdges");
	svg.append("text").text("0").attr("x",mid-5).attr("y",height-padding+20).attr("font-weight","bold");
	svg.append("line").attr("x1",mid+len).attr("x2",mid+len)
								    .attr("y1",height-padding).attr("y2",height-padding+6)
								    .attr("stroke","black").attr("shape-rendering","crispEdges");
  svg.append("text").text(num.toString()).attr("x",mid+len-15).attr("y",height-padding+20).attr("font-weight","bold");
}

/**
 * 绘制flag
 */
function drawFlag(svg,div){
	var padding = 50;
	svg.append("rect")
	   .attr("fill","none")
	   .attr("x",padding+20)
	   .attr("y",padding)
	   .attr("width",div+2)
	   .attr("height",div+2)
	   .attr("fill","none")
       .attr("stroke","rgba(110, 200, 110, 1)")
       .attr("stroke-width",2);
    svg.append("text")
    	.text("Left")
	   .attr("x",padding+div+30)
	   .attr("y",padding+div+2);

	svg.append("rect")
	   .attr("fill","none")
	   .attr("x",padding+80)
	   .attr("y",padding)
	   .attr("width",div+2)
	   .attr("height",div+2)
	   .attr("fill","none")
       .attr("stroke","rgba(180, 130, 220, 1)")
       .attr("stroke-width",2);
    svg.append("text")
    	.text("Right")
	   .attr("x",padding+div+90)
	   .attr("y",padding+div+2);
}

/**
 * 绘制左右对比的折线图
 */
function drawLineChartLR(svg,dataset,mid,divW,height,div){
	var padding = 50;
	var pre,now;
	pre = mid+(dataset[1]-dataset[0])*divW;

	for(var i =2 ;i<dataset.length;i=i+2){
		now = mid+(dataset[i+1]-dataset[i])*divW;
		if((pre>mid&&now<mid)||(pre<mid&&now>mid)){
			svg.append("line")
			.attr("x1",pre)
			.attr("y1",height - padding - (i/2-1)*div)
			.attr("x2",mid)
			.attr("y2",height - padding - (i/2-0.5)*div)
			.attr('stroke-width', '2')
			.attr("stroke",function(){
				if(pre<mid) return "rgba(117, 205, 117, 1)";
				else return "rgba(187, 139, 230, 1)";
			});
			svg.append("line")
			.attr("x1",mid)
			.attr("y1",height - padding - (i/2-0.5)*div)
			.attr("x2",now)
			.attr("y2",height - padding - i/2*div)
			.attr('stroke-width', '2')
			.attr("stroke",function(){
				if(now<mid) return "rgba(117, 205, 117, 1)";
				else return "rgba(187, 139, 230, 1)";
			});
		}
		else {
			svg.append("line")
			.attr("x1",pre)
			.attr("y1",height - padding - (i/2-1)*div)
			.attr("x2",now)
			.attr("y2",height - padding - i/2*div)
			.attr('stroke-width', '2')
			.attr("stroke",function(){
				if(now<mid||pre<mid) return "rgba(117, 205, 117, 1)";
				else return "rgba(187, 139, 230, 1)";
			});
		}
		pre = now;
	}

}

/**
 * 左右对比矩形变色效果
 * @param {Object} index 点击的index  index/2是 distance
 */
function LeftVsRightMouseover(index){
	d3.select(".shotFreLeftVsRight").selectAll("rect").attr("fill",function(d,i){
		if(Math.floor(index/2)===Math.floor(i/2) && i%2 == 0) return "rgba(117, 205, 117, 1)";
    else if(Math.floor(index/2)===Math.floor(i/2) && i%2 == 1) return "rgba(187, 139, 230, 1)";
		else if(i%2==0) return "rgba(117, 205, 117, 0.6)";
		else return "rgba(187, 139, 230, 0.6)";
	});
	d3.select(".shotFGLeftVsRight").selectAll("rect").attr("fill",function(d,i){
    if(Math.floor(index/2)===Math.floor(i/2) && i%2 == 0) return "rgba(117, 205, 117, 1)";
    else if(Math.floor(index/2)===Math.floor(i/2) && i%2 == 1) return "rgba(187, 139, 230, 1)";
		else if(i%2==0) return "rgba(117, 205, 117, 0.6)";
		else return "rgba(187, 139, 230, 0.6)";
	});
	showCurSelectedpPoint(index);
	SvgMouseover(Math.floor(index/2));
}

function SvgMouseover(distance){
	if(distance===-1) distance = 0;
	var padding = 50;
	var divSvg = d3.select(".shotFreLeftVsRight");
    var width = divSvg[0][0].offsetWidth;  //456
    var height = divSvg[0][0].offsetHeight;  //400
    var divH = (height-2*padding)/31;
    var divW = (width-2*padding)/30;
    d3.selectAll(".lineClass2")
      .attr("x1",padding)
			.attr("y1",height-padding-divH*distance)
			.attr("x2",width-padding)
			.attr("y2",height-padding-divH*distance)
			.attr('stroke-width', '1')
			.attr("stroke","gray");
	d3.selectAll(".lineClass1")
      .attr("x1",padding+divW*distance)
			.attr("y1",padding)
			.attr("x2",padding+divW*distance)
			.attr("y2",height-padding)
			.attr('stroke-width', '1')
			.attr("stroke","gray");
	d3.selectAll(".circleClass")
			.attr("cx",250)
			.attr("cy",48.5)
			.attr("r",10*distance)
      .attr("fill","none")
      .attr("stroke","#c3c1c8")
      .attr("stroke-width",5);
}

function loadDataToDraw(){
  d3.json("json/16-17season.json",function(d){

      console.log(d.resultSets[0].headers);
      starShootingChart(d);

      var data = getData(d,currentStarId);

      drawShotFreByDis(getShotFreData(data));
      drawShotFGByDis(getShotFGData(data));
      drawShotFreLR(data);
      drawFieldGoalLR(data);

  });
}

//创建svg
createSvg();
//加载数据绘制
loadDataToDraw();
// 绑定搜索框球星列表
bindSerachImg();
