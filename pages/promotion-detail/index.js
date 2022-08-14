import Toast from 'tdesign-miniprogram/toast/index';
import { fetchPromotion } from '../../services/promotion/detail';

Page({
  data: {
    commentResources: [],
    test: 0,
  },

  onLoad(query) {
    const promotionID = parseInt(query.promotion_id);
    console.log('promotionID=',promotionID);
    this.getGoodsList(promotionID);
  },

  getGoodsList(promotionID) {
    fetchPromotion(promotionID).then(
      ({ commentResources,test }) => {
        this.setData({
          commentResources: commentResources[promotionID - 1],
          test:test,
        });
      },
    );
  },

  goodClickHandle(e) {
    const { index } = e.detail;
    const { spuId } = this.data.list[index];
    wx.navigateTo({ url: `/pages/goods/details/index?spuId=${spuId}` });
  },

  cardClickHandle() {
    Toast({
      context: this,
      selector: '#t-toast',
      message: '点击加购',
    });
  },

  bannerClickHandle() {
    Toast({
      context: this,
      selector: '#t-toast',
      message: '点击规则详情',
    });
  },
});
