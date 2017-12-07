/* 通用工具 */
d3.json("json/16-17season.json",function(d){

  	console.log(d.resultSets[0].headers);
    starShootingChart(d);
    
    var data = getData(d,currentStarId);

  	drawShotFreByDis(getShotFreData(data));
    drawShotFGByDis(getShotFGData(data));
  	drawShotFreLR(data);
  	drawFieldGoalLR(data);

  	//getGoalByDistance(getData(d,201565));
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
  svg.append("circle").attr("class","circleClass");//用于mouseover事件
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
  
  var linePath=d3.svg.line()//创建一个直线生成器
                      .x(function(d,i){
                        return xScale(i) - padding;
                      })
                      .y(function(d){
                        return height - yScale(d) - padding;
                      })
                      // .interpolate("basis");//插值模式

  //绘制折线图
  SVG.selectAll("path")
    .data(data)
    .enter()
    .append("path")
    .attr("transform","translate("+padding+","+padding+")")
    .attr("d",function(d){
      return linePath(d.Fre);//返回线段生成器得到的路径  
    })
    .attr("fill","none")
    .attr("stroke-width",3)
    .attr("stroke","Salmon");

  var dataset = data[0].Fre;
  console.log(data[0]);
  console.log(dataset);
  //绘制散点
  SVG.selectAll("circle")
      .data(dataset)
      .enter()
      .append("circle")
      .attr("r","3")
      .attr("cx",function(d,i){
        return xScale(i);
      })
      .attr("cy",function(d,i){
        return height - yScale(d);
      })
      // .attr("fill","transparent");

  //绘制坐标轴
	drawCoordinate(SVG,".shotFreByDis",30,0.25);
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
  var linePath=d3.svg.line()//创建一个直线生成器
                      .x(function(d,i){
                        return xScale(i) - padding;
                      })
                      .y(function(d){
                        return height - yScale(d) - padding;
                      })
                      // .interpolate("basis");//插值模式
  //绘制折线图
  SVG.selectAll("path")
    .data(data)
    .enter()
    .append("path")
    .attr("transform","translate("+padding+","+padding+")")
    .attr("d",function(d){
      return linePath(d.FG);//返回线段生成器得到的路径  
    })
    .attr("fill","none")
    .attr("stroke-width",3)
    .attr("stroke","Salmon");

  var dataset = data[0].FG;
  //绘制散点
  SVG.selectAll("circle")
      .data(dataset)
      .enter()
      .append("circle")
      .attr("r",3)
      .attr("cx",function(d,i){
        return xScale(i);
      })
      .attr("cy",function(d,i){
        return height - yScale(d);
      })
      // .attr("fill","transparent");

  //绘制坐标轴
  drawCoordinate(SVG,'.shotFGByDis',30,1);
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
			.attr("height",div)
			.on("mouseover",function(data,index){
				LeftVsRightMouseover(index);
			})
			.on("mouseout",function(d,i){
				LeftVsRightMouseover(-1);//恢复原色
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
	drawCoordinate(svg,".shotFGLeftVsRight");
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
			.on("mouseover",function(data,index){
				LeftVsRightMouseover(index);
			})
			.on("mouseout",function(d,i){
				LeftVsRightMouseover(-1);//恢复原色
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
	SvgMouseover(Math.floor(index/2));
}
function SvgMouseover(distance){
	var padding = 50;
	var divSvg = d3.select(".shotFreLeftVsRight");
    var width = divSvg[0][0].offsetWidth;  //456
    var height = divSvg[0][0].offsetHeight;  //400
    var divH = (height-2*padding)/31; 
    var divW = (width-2*padding)/31; 
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
			.attr("y2",width-padding)
			.attr('stroke-width', '1')
			.attr("stroke","gray");
	d3.selectAll(".circleClass")
			.attr("cx",270)
			.attr("cy",40)
			.attr("r",9*distance);
}
