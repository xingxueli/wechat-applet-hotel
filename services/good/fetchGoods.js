import { config } from '../../config/index';

/** 获取商品列表 */
function mockFetchGoodsList(pageIndex = 1, pageSize = 20) {
  const { delay } = require('../_utils/delay');
  const { getGoodsList } = require('../../model/goods');
  return delay().then(() =>
    getGoodsList(pageIndex, pageSize).map((item) => {
      return {
        spuId: item.spuId,
        thumb: item.primaryImage,
        title: item.title,
        price: item.minSalePrice,
        originPrice: item.maxLinePrice,
        tags: item.spuTagList.map((tag) => tag.title),
      };
    }),
  );
}

/** 获取商品列表 */
export function fetchGoodsList(pageIndex = 1, pageSize = 20) {
  // if (config.useMock) {
  //   return mockFetchGoodsList(pageIndex, pageSize);
  // }
    return wx.cloud.callContainer({
      "config": {
        "env": "prod-3gvqnfsbbbe3e2b9"
      },
      "path": "/room/list",
      "header": {
        "X-WX-SERVICE": "springboot-krih",
        "content-type": "application/json"
      },
      "method": "GET",
      "data": {}
    }).then((res) =>{
      return res.data.data;
    });
}
