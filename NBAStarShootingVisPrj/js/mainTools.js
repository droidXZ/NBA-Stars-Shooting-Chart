/* 通用工具 */
d3.json("json/16-17season.json",function(d){

  	console.log(d.resultSets[0].headers);
    starShootingChart(d);

    var data = getData(d,currentStarId);

  	drawShotFreByDis(getShotFreData(data));
    drawShotFGByDis(getShotFGData(data));
  	drawShotFreLR(data);
  	drawFieldGoalLR(data);

});

function starShootingChart(data){
  // svg固定宽高
  var width = 500,height = 500;
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
      court.setAttributeNS(null,"width","500px");
      court.setAttributeNS(null,"height","362px");
      document.getElementsByClassName('svg_SSC')[0].appendChild(court);
  svg.append("circle").attr("class","circleClass");//用于mouseover事件
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
      return xScale(d.loc_x);
    })
    .attr("y",function(d){
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

  var padding = 50;
	var SVG = d3.select(".shotFreByDis")
      				.append("svg")
      				.attr("width","100%")
      				.attr("height","100%");

  //获取当前DOM宽高
  var div = d3.select(".shotFreByDis");
  var width = div[0][0].offsetWidth;  //456
  var height = div[0][0].offsetHeight;  //400
  SVG.append("line").attr("class","lineClass1");//用于Mouseover事件
  // 设置比例尺
  var xScale = d3.scale.linear()
          .domain([0,30])
          .range([padding,width - padding]);
  var yScale = d3.scale.linear()
          .domain([0,0.25])
          .range([padding,height]);

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

  //添加一个提示框
  var tooltip = d3.select("body")
                  .append("div")
                  .attr("class","tooltip")
                  .style("opacity",0.0);

  circles.on("mouseover",function(d,i){
            /*
            鼠标移入时，
            （1）通过 selection.html() 来更改提示框的文字
            （2）通过更改样式 left 和 top 来设定提示框的位置
            （3）设定提示框的透明度为1.0（完全不透明）
            */

            tooltip.html("distance: " + i + "<br/>" + "Fre%: " + Math.round(d*100) + "%")
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY + 20) + "px")
            .style("opacity",1.0);

            //选中状态
            d3.select(this).attr("fill","Salmon")
                            .attr("stroke","DarkTurquoise")
                            .attr("stroke-width",3);
                            })
                            .on("mousemove",function(d){
                              /* 鼠标移动时，更改样式 left 和 top 来改变提示框的位置 */
                              tooltip.style("left", (d3.event.pageX) + "px")
                              .style("top", (d3.event.pageY + 20) + "px");
                            })
                            .on("mouseout",function(d){
                              /* 鼠标移出时，将透明度设定为0.0（完全透明）*/
                              tooltip.style("opacity",0.0);
                              d3.select(this).attr("fill","transparent")
                              .attr("stroke","none");
                            });

            SVG.on("mousemove",function(){
              var x = d3.event.offsetX;
              var y = d3.event.offsetY;
              if(x<=width-padding&&x>=padding&&y>=padding&&y<=height-padding){
                //每一段的长度
                var div = (width-2*padding)/31;
                LeftVsRightMouseover(Math.floor((x-padding)*2/div));
                }
              else{
                LeftVsRightMouseover(0);
              }
            })

  //绘制标题
  drawTitle(SVG,"Shot Frequency % by Distance");
  //绘制折线图
  drawLineChart(SVG,data,"Fre",xScale,yScale);
  //绘制坐标轴
	drawCoordinate(SVG,".shotFreByDis",30,25);
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
    el[el.length] = goalTimes[i] / shotTimes[i];
  }

  item.FG = el;
  goalPercentage.push(item);

  return goalPercentage;
}

//绘制球员各距离命中率图像
function drawShotFGByDis(data){
  //获取当前DOM宽高
  var div = d3.select(".shotFGByDis");
  var width = div[0][0].offsetWidth;  //456
  var height = div[0][0].offsetHeight;  //400
  var padding = 50;

  var SVG = d3.select(".shotFGByDis")
              .append("svg")
              .attr("width","100%")
              .attr("height","100%");

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

  var lines = SVG.selectAll("line")
                  .data(dataset)
                  .enter()
                  .append("line")
                  .attr("x1",function(d,i){
                    return xScale(i);
                  })
                  .attr("y1",padding)
                  .attr("x2",function(d,i){
                    return xScale(i);
                  })
                  .attr("y2",height - padding)
                  .attr('stroke-width', 10)
                  .attr("stroke","transparent")
                  .attr("opacity",0.5);

  //添加一个提示框
  var tooltip = d3.select("body")
                  .append("div")
                  .attr("class","tooltip")
                  .style("opacity",0.0);

  circles.on("mouseover",function(d,i){
      /*
      鼠标移入时，
      （1）通过 selection.html() 来更改提示框的文字
      （2）通过更改样式 left 和 top 来设定提示框的位置
      （3）设定提示框的透明度为1.0（完全不透明）
      */
      tooltip.html("distance: " + i + "<br/>" + "FG%: " + Math.round(d*100) + "%")
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY + 20) + "px")
              .style("opacity",1.0);
      //选中状态
      d3.select(this).attr("fill","Salmon")
                      .attr("stroke","DarkTurquoise")
                      .attr("stroke-width",3);
        //选中点 X 坐标
        //d3.select(this)[0][0].cx.animVal.value

        var x = d3.select(this)[0][0].cx.animVal.value;
        d3.selectAll(".lineClass1")
                  .attr("x1",x)
                  .attr("y1",height-padding)
                  .attr("x2",x)
                  .attr("y2",padding)
                  .attr('stroke-width', '1')
                  .attr("stroke","gray");
      })
      .on("mousemove",function(d){
        /* 鼠标移动时，更改样式 left 和 top 来改变提示框的位置 */
        tooltip.style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY + 20) + "px");
      })
      .on("mouseout",function(d){
        /* 鼠标移出时，将透明度设定为0.0（完全透明）*/
        tooltip.style("opacity",0.0);
        d3.select(this).attr("fill","transparent")
                        .attr("stroke","none");
        });

    lines.on("mouseover",function(d,i){
      tooltip.html("distance: " + i + "<br/>" + "FG%: " + Math.round(d*100) + "%")
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY + 20) + "px")
              .style("opacity",0.8);
       // d3.select(this).attr("stroke","gray");
    })
    .on("mouseout",function(d){
        /* 鼠标移出时，将透明度设定为0.0（完全透明）*/
        tooltip.style("opacity",0.0);
    });

    SVG.on("mousemove",function(){
      var x = d3.event.offsetX;
      var y = d3.event.offsetY;
      if(x<=width-padding&&x>=padding&&y>=padding&&y<=height-padding){
        //每一块的长度
        var div = (width-2*padding)/31;
        LeftVsRightMouseover(Math.floor((x-padding)*2/div));
        }
      else{
        LeftVsRightMouseover(0);
      }
    });

  //绘制标题
  drawTitle(SVG,"Field Goal % by Distance");
  //绘制折线图
  drawLineChart(SVG,data,"FG",xScale,yScale);
  //绘制坐标轴
  drawCoordinate(SVG,'.shotFGByDis',30,100);
}

//绘制折线图
function drawLineChart(SVG,data,dataName,xScale,yScale){

  var padding = 50;
  var height = 400;

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
function drawCoordinate(SVG,className,xMax,yMax){
	//获取当前DOM宽高
  var div = d3.select(className);
  var width = div[0][0].offsetWidth;  //456
  var height = div[0][0].offsetHeight;  //400
  var padding = 50;

  // 设置比例尺
  xScale = d3.scale.linear()
          .domain([0,xMax])
          .range([0,width - padding*2]);
  yScale = d3.scale.linear()
          .domain([yMax,0])
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
	var padding = 50;
	var divSvg = d3.select(".shotFreLeftVsRight");
    var width = divSvg[0][0].offsetWidth;  //456
    var height = divSvg[0][0].offsetHeight;  //400

	var mid = width/2;
	var div = (height-2*padding)/31;
	var svg = d3.select(".shotFreLeftVsRight")
				.append("svg")
				.attr("width","100%")
				.attr("height","100%");
  //绘制标题
  drawTitle(svg,"Shot Frequency:Left Side vs. Right Side");
  //绘制坐标轴
	drawCoordinate(svg,".shotFreLeftVsRight");
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
				if(i % 2 === 0) return "#0f0";
				else return "#00f";})
		    .attr("x", function(d,i){
		    	if(i%2 === 0)return mid-divW*shotData[i];
		    	else return mid;})
			.attr("y", function(d,i) {
				if(i%2 === 0) return height-padding-div*(i/2+1);
				else return height-padding-div*((i-1)/2+1);})
			.attr("width", function(d,i) {return divW*shotData[i];})
			.attr("height",div);
	svg.on("mousemove",function(){
		var x = d3.event.offsetX;
		var y = d3.event.offsetY;
		if(x<=width-padding&&x>=padding&&y>=padding&&y<=height-padding){
			LeftVsRightMouseover(Math.floor((height-padding-y)*2/div));
		}
		else{
			// LeftVsRightMouseover(0);
		}
	})

}

/**
 * 绘制左右对比的命中率图
 */
function drawFieldGoalLR(data){
	var padding = 50;
	var divSvg = d3.select(".shotFreLeftVsRight");
    var width = divSvg[0][0].offsetWidth;  //456
    var height = divSvg[0][0].offsetHeight;  //400
	var mid = width/2;
	var div = (height-2*padding)/31;
	var svg = d3.select(".shotFGLeftVsRight")
				.append("svg")
				.attr("width","100%")
				.attr("height","100%");
  //绘制标题
  drawTitle(svg,"Field Goal%:Left Side vs. Right Side");
  //绘制坐标轴
	drawCoordinate(svg,".shotFGLeftVsRight",1,30);
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
		shotData.push(dataset[i].goal_left/dataset[i].shot_left);
		shotData.push(dataset[i].goal_right/dataset[i].shot_right);
	}
	var divW = (mid-padding)/100;
	svg.selectAll("rect")
			.data(shotData)
			.enter()
			.append("rect")
			.attr("fill", function(d,i){
				if(i % 2 === 0) return "#0f0";
				else return "#00f";})
		    .attr("x", function(d,i){
		    	if(i%2 === 0)return mid-divW*shotData[i]*100;
		    	else return mid;})
			.attr("y", function(d,i) {
				if(i%2 === 0) return height-padding-div*(i/2+1);
				else return height-padding-div*((i-1)/2+1);})
			.attr("width", function(d,i) {return divW*shotData[i]*100;})
			.attr("height",div)

	svg.on("mousemove",function(){
		var x = d3.event.offsetX;
		var y = d3.event.offsetY;
		if(x<=width-padding&&x>=padding&&y>=padding&&y<=height-padding){
			LeftVsRightMouseover(Math.floor((height-padding-y)*2/div));
		}
		else{
			LeftVsRightMouseover(0);
		}
	})

}

/**
 * 左右对比矩形变色效果
 * @param {Object} index 点击的index  index/2是 distance
 */
function LeftVsRightMouseover(index){
	d3.select(".shotFreLeftVsRight").selectAll("rect").attr("fill",function(d,i){
		if(Math.floor(index/2)===Math.floor(i/2))return "orange";
		else if(i%2==0) return "#0f0";
		else return "#00f";
	});
	d3.select(".shotFGLeftVsRight").selectAll("rect").attr("fill",function(d,i){
		if(Math.floor(index/2)===Math.floor(i/2))return "orange";
		else if(i%2==0) return "#0f0";
		else return "#00f";
	});
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

	SvgMouseover(Math.floor(index/2));
}

function SvgMouseover(distance){
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
