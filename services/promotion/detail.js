import { config } from '../../config/index';

/** 获取商品列表 */
function mockFetchPromotion(ID = 0) {
  const { delay } = require('../_utils/delay');
  const { getSwiperDetail } = require('../../model/promotion');
  return delay().then(() => getSwiperDetail(ID));
}

/** 获取商品列表 */
export function fetchPromotion(ID = 0) {
  if (config.useMock) {
    return mockFetchPromotion(ID);
  }
  return new Promise((resolve) => {
    resolve('real api');
  });
}
