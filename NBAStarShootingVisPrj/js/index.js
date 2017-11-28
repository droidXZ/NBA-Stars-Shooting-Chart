
/*   index首页js    */
  // 当前默认的球星和球星Id 检索可通过名称 绘制均通过Id进行查找数据
  var currentStar = "Russell Westbrook",
      currentStarId = 201566;
  document.getElementsByClassName('buttonBox')[0].onclick = function (){
    document.getElementsByClassName('selectPlayer')[0].style.display = 'block';
  }

d3.json("json/nbaStarData2016-2017.json",function(data){
  console.log(currentStar + currentStarId);
  console.log(data);
  for(var i in data.resultSet.rowSet){
    if(data.resultSet.rowSet[i][0] == 201566){
      console.log(data.resultSet.rowSet[i]);
    }
  }
});
  testConsole(currentStar,currentStarId);
