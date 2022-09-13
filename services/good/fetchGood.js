/** 获取商品列表 */
export function fetchGood(spuId) {
  return wx.cloud.callContainer({
    "config": {
      "env": "prod-3gvqnfsbbbe3e2b9"
    },
    "path": "/room/detail",
    "header": {
      "X-WX-SERVICE": "springboot-krih",
      "content-type": "application/json"
    },
    "method": "POST",
    "data": {"spuId":spuId}
  }).then((res) =>{
    return res.data.data;
  });
}
