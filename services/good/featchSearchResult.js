/** 获取搜索历史 */
export function getSearchResult(params) {
  // console.log(params)
  return wx.cloud.callContainer({
    "config": {
      "env": "prod-3gvqnfsbbbe3e2b9"
    },
    "path": "/room/list",
    "header": {
      "X-WX-SERVICE": "springboot-krih",
      "content-type": "application/json"
    },
    "method": "POST",
    "data": {"roomNum":params.keyword,"pageNum":params.pageNum,"pageSize":params.pageSize}
  }).then((res) =>{
    console.log(res)
    return res.data;
  });
}
