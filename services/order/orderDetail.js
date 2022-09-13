import { config } from '../../config/index';

/** 获取订单详情数据 */
export function fetchOrderDetail(params) {
  return wx.cloud.callContainer({
    "config": {
      "env": "prod-3gvqnfsbbbe3e2b9"
    },
    "path": "/order/detail",
    "header": {
      "X-WX-SERVICE": "springboot-krih",
      "content-type": "application/json"
    },
    "method": "GET",
    "data": {"orderNum":params.parameter}
  }).then((res) =>{
    console.log(res)
    return res.data;
  });
}

/** 获取客服mock数据 */
function mockFetchBusinessTime(params) {
  const { delay } = require('../_utils/delay');
  const { genBusinessTime } = require('../../model/order/orderDetail');

  return delay().then(() => genBusinessTime(params));
}

/** 获取客服数据 */
export function fetchBusinessTime(params) {
  if (config.useMock) {
    return mockFetchBusinessTime(params);
  }

  return new Promise((resolve) => {
    resolve('real api');
  });
}
