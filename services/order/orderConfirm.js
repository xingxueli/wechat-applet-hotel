import { config } from '../../config/index';

/** 取消订单 */
export function cancelOrder(params) {
  // console.log('cancelOrder')
  // console.log(params)
  return wx.cloud.callContainer({
    "config": {
      "env": "prod-3gvqnfsbbbe3e2b9"
    },
    "path": "/order/cancel",
    "header": {
      "X-WX-SERVICE": "springboot-krih",
      "content-type": "application/json"
    },
    "method": "POST",
    "data": {"orderNum":params.orderNo}
  }).then((res) =>{
    console.log(res)
    return res.data;
  });
}

/* 提交订单 */
export function dispatchCommitPay(params) {
  console.log(params)
  return wx.cloud.callContainer({
    "config": {
      "env": "prod-3gvqnfsbbbe3e2b9"
    },
    "path": "/order/create",
    "header": {
      "X-WX-SERVICE": "springboot-krih",
      "content-type": "application/json"
    },
    "method": "POST",
    "data": params
  }).then((res) =>{
    console.log(res)
    return res.data;
  });
}

/** 开发票 */
export function dispatchSupplementInvoice() {
  if (config.useMock) {
    const { delay } = require('../_utils/delay');
    return delay();
  }

  return new Promise((resolve) => {
    resolve('real api');
  });
}
