
/*   index首页js    */
  // 当前默认的球星和球星Id 检索可通过名称 绘制均通过Id进行查找数据
  var currentStar = "Russell Westbrook",
      currentStarId = 201566;

  document.getElementsByClassName('buttonBox')[0].onclick = function(){
    document.getElementsByClassName('selectPlayer')[0].style.display = 'block';
    bindSerachImg();
    //通过点击图片更改当前currentId
    // var starPics = document.getElementsByClassName('starPicSelect');
    // for(var i in starPics){
    //   starPics[i].onclick = function(i){
    //     alert(i);
    //   }
    // }
    d3.selectAll(".starPicSelect")
      .on("click",function(d){
        alert(d3.select(this));
      });
    // console.log(starPics);
  }
  document.getElementById('hideButton').onclick = function(){
    document.getElementsByClassName('selectPlayer')[0].style.display = 'none';
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

  function changeCurrentStar(){
    console.log(1);
  }
