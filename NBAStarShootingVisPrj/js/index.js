
/*   index首页js    */
  // 当前默认的球星和球星Id 检索可通过名称 绘制均通过Id进行查找数据
  var currentStar = "Russell Westbrook",
      currentStarId = 201566;
  // 判断点击change按钮次数，只加载一次列表
  var clickTimes = 0;
  bindStarData();
  document.getElementsByClassName('buttonBox')[0].onclick = function(){
    document.getElementsByClassName('selectPlayer')[0].style.display = 'block';
    // 绑定搜索框球星列表
    if(clickTimes === 0){
      bindSerachImg();
      clickTimes++;
    }
    //通过点击图片更改当前currentId
    d3.selectAll(".starPicSelect")
      .on("click",function(d){
        alert(d3.select(this));
        var cDiv = d3.select(this);
        console.log(cDiv);
        //取得点击图片的球星ID和name
        var idStr = cDiv[0][0].firstChild.getAttribute("src"),
            nameStr = cDiv[0][0].lastChild.innerHTML;
        idStr = idStr.slice(11);
        idStr = idStr.substr(0,idStr.indexOf('.'));

        changeCurrentStar(idStr,nameStr);
        //点击切换球星后 隐藏选择框

        document.getElementsByClassName('selectPlayer')[0].style.display = 'none';
        resetSerachPic();
      });
    // 点击搜索 进行搜索
    document.getElementById("serachButton").onclick = function(){
      var serachStr = document.getElementById("inputV").value.toLowerCase();
      var cDivBox = document.getElementsByClassName("starPicSelect");
      for(var i in cDivBox){
        var idStr = cDivBox[i].firstChild.getAttribute("src"),
            nameStr = cDivBox[i].lastChild.innerHTML;
        idStr = idStr.slice(11);
        idStr = idStr.substr(0,idStr.indexOf('.'));
        if(serachStr == nameStr.toLowerCase() || serachStr == idStr){
          continue;
        }else {
          cDivBox[i].style.display = "none";
        }
      }
    }
  }

  document.getElementById('hideButton').onclick = function(){
    document.getElementsByClassName('selectPlayer')[0].style.display = 'none';
    resetSerachPic();
}

  // 绑定球星数据。
  function bindStarData(){
    d3.json("json/nbaStarData2016-2017.json",function(data){
      var dataSet = data.resultSet.rowSet;
      console.log(dataSet);
      var starPic = document.getElementById('starPic'),
          starTeamLogo = document.getElementById('teamLogo'),
          starName = document.getElementById('starName'),
          starDatas = document.getElementsByClassName('starData');
      console.log(starDatas);
      for(var i in dataSet){
        if(dataSet[i][0] == currentStarId){
          starPic.setAttribute("src","img/player/" + currentStarId + ".png");
          starTeamLogo.setAttribute("src","img/teamlogo/" + dataSet[i][3] + "_logo.svg");
          starName.innerHTML = currentStar;
          // 绑定场次 上场时间 得分篮板助攻等...为方便就不在循环处理
          starDatas[0].innerText = dataSet[i][4];
          starDatas[1].innerText = dataSet[i][5];
          starDatas[2].innerText = dataSet[i][22];
          starDatas[3].innerText = dataSet[i][17];
          starDatas[4].innerText = dataSet[i][18];
          starDatas[5].innerText = dataSet[i][19];
          starDatas[6].innerText = dataSet[i][20];
        }
      }
    });
  }
//将球星数据库中的数据绑定到serachStarPicBox中去
 function bindSerachImg(){
   d3.json("json/nbaStarData2016-2017.json",function(data){
     console.log(data.resultSet.headers);
     var dataSet = data.resultSet.rowSet;
     var box = document.getElementsByClassName("serachStarPicBox")[0];
     for(var i in dataSet){
      var cDiv = document.createElement("div");
          cDiv.className = "starPicSelect";
      var cImg = document.createElement("img");
          cImg.src = "img/player/" + dataSet[i][0] + ".png";
      var cSpan = document.createElement("span");
      var cText = document.createTextNode(dataSet[i][2]);
          cSpan.appendChild(cText);
      cDiv.appendChild(cImg);
      cDiv.appendChild(cSpan);
      box.appendChild(cDiv);
     }
   });
 }

  // 重置选择球星框盒子元素
  function resetSerachPic(){
    var cDivBox = document.getElementsByClassName("starPicSelect");
    for(var i in cDivBox){
        cDivBox[i].style.display = "block";
    }
  }

  //改变当前球星id和球星名称
  function changeCurrentStar(idStr,nameStr){
    currentStar = nameStr;
    currentStarId = Number(idStr);
    // 在下面调用绘制函数更改当前的信息及图片
    bindStarData();
    loadDataToDraw();
  }
