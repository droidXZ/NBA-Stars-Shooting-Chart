
/*   index首页js    */
  // 当前默认的球星和球星Id 检索可通过名称 绘制均通过Id进行查找数据
  var currentStar = "Russell Westbrook",
      currentStarId = 201566;
  bindSerachImg();
  document.getElementsByClassName('buttonBox')[0].onclick = function(){
    document.getElementsByClassName('selectPlayer')[0].style.display = 'block';

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
    console.log(currentStar);
    console.log(currentStarId);
    // 在下面调用绘制函数更改当前的信息及图片
  }
