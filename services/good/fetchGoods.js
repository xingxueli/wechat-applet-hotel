import { config } from '../../config/index';

/** 获取商品列表 */
function mockFetchGoodsList(pageIndex = 1, pageSize = 20) {
  const { delay } = require('../_utils/delay');
  const { getGoodsList } = require('../../model/goods');
  // return delay().then(() =>
    // getGoodsList(pageIndex, pageSize).map((item) => {
    //   return {
    //     spuId: item.spuId,
    //     thumb: item.primaryImage,
    //     title: item.title,
    //     price: item.minSalePrice,
    //     originPrice: item.maxLinePrice,
    //     tags: item.spuTagList.map((tag) => tag.title),
    //   };
    // }),
    // );
    return [
      {
        "spuId": 1,
        "thumb": "https://7072-prod-3gvqnfsbbbe3e2b9-1313299760.tcb.qcloud.la/material/201660393983_.pic_hd.jpg?sign=7887d23c79df61083c1e32396dd9412a&t=1660549509",
        "title": "描述的名字需要长一些才能撑开样式",
        "price": "11",
        "originPrice": "28",
        "tags": [
            "优惠"
        ]
      },
      {
        "spuId": 1,
        "thumb": "https://7072-prod-3gvqnfsbbbe3e2b9-1313299760.tcb.qcloud.la/material/201660393983_.pic_hd.jpg?sign=7887d23c79df61083c1e32396dd9412a&t=1660549509",
        "title": "描述的名字需要长一些才能撑开样式",
        "price": "11",
        "originPrice": "28",
        "tags": [
            "优惠"
        ]
      },
      {
        "spuId": 1,
        "thumb": "https://7072-prod-3gvqnfsbbbe3e2b9-1313299760.tcb.qcloud.la/material/201660393983_.pic_hd.jpg?sign=7887d23c79df61083c1e32396dd9412a&t=1660549509",
        "title": "描述的名字需要长一些才能撑开样式",
        "price": "11",
        "originPrice": "28",
        "tags": [
            "优惠"
        ]
      },
      {
        "spuId": 1,
        "thumb": "https://7072-prod-3gvqnfsbbbe3e2b9-1313299760.tcb.qcloud.la/material/201660393983_.pic_hd.jpg?sign=7887d23c79df61083c1e32396dd9412a&t=1660549509",
        "title": "描述的名字需要长一些才能撑开样式",
        "price": "11",
        "originPrice": "28",
        "tags": [
            "优惠"
        ]
      },
      {
        "spuId": 1,
        "thumb": "https://7072-prod-3gvqnfsbbbe3e2b9-1313299760.tcb.qcloud.la/material/201660393983_.pic_hd.jpg?sign=7887d23c79df61083c1e32396dd9412a&t=1660549509",
        "title": "描述的名字需要长一些才能撑开样式",
        "price": "11",
        "originPrice": "28",
        "tags": [
            "优惠"
        ]
      }
  ];

}

/** 获取商品列表 */
export function fetchGoodsList(pageIndex = 1, pageSize = 20) {
  if (config.useMock) {
    return mockFetchGoodsList(pageIndex, pageSize);
  }
    // return wx.cloud.callContainer({
    //   "config": {
    //     "env": "prod-3gvqnfsbbbe3e2b9"
    //   },
    //   "path": "/room/list",
    //   "header": {
    //     "X-WX-SERVICE": "springboot-krih",
    //     "content-type": "application/json"
    //   },
    //   "method": "GET",
    //   "data": {}
    // }).then((res) =>{
    //   return res.data.data;
    // });
}
