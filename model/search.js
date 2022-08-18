import { getGoodsList } from './goods';

/**
 * @param {number} sort
 * @param {number} pageNum
 * @param {number} pageSize
 * @param {number} minPrice
 * @param {number} maxPrice
 * @param {string} keyword
 */

export function getSearchHistory() {
  return {
    historyWords: [
      '鸡',
      '电脑',
      'iPhone12',
      '车载手机支架',
      '自然堂',
      '小米10',
      '原浆古井贡酒',
      '欧米伽',
      '华为',
      '针织半身裙',
      '氢跑鞋',
      '三盒处理器',
    ],
  };
}

export function getSearchPopular() {
  return {
    popularWords: [
      '鸡',
      '电脑',
      'iPhone12',
      '车载手机支架',
      '自然堂',
      '小米10',
      '原浆古井贡酒',
      '欧米伽',
      '华为',
      '针织半身裙',
      '氢跑鞋',
      '三盒处理器',
    ],
  };
}

export function getSearchResult() {
  // const homeListData = [
  //   {
  //     "spuId": 1,
  //     "thumb": "https://7072-prod-3gvqnfsbbbe3e2b9-1313299760.tcb.qcloud.la/material/201660393983_.pic_hd.jpg?sign=7887d23c79df61083c1e32396dd9412a&t=1660549509",
  //     "title": "描述的名字需要长一些才能撑开样式",
  //     "price": "11",
  //     "originPrice": "28",
  //     "tags": [
  //         "优惠"
  //     ]
  //   },
  //   {
  //     "spuId": 1,
  //     "thumb": "https://7072-prod-3gvqnfsbbbe3e2b9-1313299760.tcb.qcloud.la/material/201660393983_.pic_hd.jpg?sign=7887d23c79df61083c1e32396dd9412a&t=1660549509",
  //     "title": "描述的名字需要长一些才能撑开样式",
  //     "price": "11",
  //     "originPrice": "28",
  //     "tags": [
  //         "优惠"
  //     ]
  //   },
  //   {
  //     "spuId": 1,
  //     "thumb": "https://7072-prod-3gvqnfsbbbe3e2b9-1313299760.tcb.qcloud.la/material/201660393983_.pic_hd.jpg?sign=7887d23c79df61083c1e32396dd9412a&t=1660549509",
  //     "title": "描述的名字需要长一些才能撑开样式",
  //     "price": "11",
  //     "originPrice": "28",
  //     "tags": [
  //         "优惠"
  //     ]
  //   },
  //   {
  //     "spuId": 1,
  //     "thumb": "https://7072-prod-3gvqnfsbbbe3e2b9-1313299760.tcb.qcloud.la/material/201660393983_.pic_hd.jpg?sign=7887d23c79df61083c1e32396dd9412a&t=1660549509",
  //     "title": "描述的名字需要长一些才能撑开样式",
  //     "price": "11",
  //     "originPrice": "28",
  //     "tags": [
  //         "优惠"
  //     ]
  //   },
  //   {
  //     "spuId": 1,
  //     "thumb": "https://7072-prod-3gvqnfsbbbe3e2b9-1313299760.tcb.qcloud.la/material/201660393983_.pic_hd.jpg?sign=7887d23c79df61083c1e32396dd9412a&t=1660549509",
  //     "title": "描述的名字需要长一些才能撑开样式",
  //     "price": 11,
  //     "originPrice": 28,
  //     "tags": [
  //         "优惠"
  //     ]
  //   }
  // ];
  const nextList = getGoodsList(7);
  return {
    saasId: null,
    storeId: null,
    pageNum: 1,
    pageSize: 30,
    totalCount: 1,
    spuList: nextList,
    algId: 0,
  };
}
