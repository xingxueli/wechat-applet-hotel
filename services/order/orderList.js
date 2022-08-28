/** 获取订单列表数据 */
export function fetchOrders(params) {
  console.log(params)
  return wx.cloud.callContainer({
    "config": {
      "env": "prod-3gvqnfsbbbe3e2b9"
    },
    "path": "/order/list",
    "header": {
      "X-WX-SERVICE": "springboot-krih",
      "content-type": "application/json"
    },
    "method": "POST",
    "data": {"orderStatus":params.orderStatus,"pageNum":params.parameter.pageNum,"pageSize":params.parameter.pageSize}
  }).then((res) =>{
    console.log(res)
    return res.data;
  });
}

/** 获取订单列表统计 */
export function fetchOrdersCount(params) {
  // console.log(params)
  return wx.cloud.callContainer({
    "config": {
      "env": "prod-3gvqnfsbbbe3e2b9"
    },
    "path": "/order/orderStatus/count",
    "header": {
      "X-WX-SERVICE": "springboot-krih",
      "content-type": "application/json"
    },
    "method": "GET",
    "data": {}
  }).then((res) =>{
    // console.log(res)
    return res.data.data;
  });
}
