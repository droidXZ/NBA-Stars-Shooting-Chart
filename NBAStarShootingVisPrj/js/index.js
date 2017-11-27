
d3.json("json/nbaStarData2016-2017.json",function(data){
  console.log(data);
  for(var i in data.resultSet.rowSet){
    if(data.resultSet.rowSet[i][0] == 201566){
      console.log(data.resultSet.rowSet[i]);
    }
  }
});
