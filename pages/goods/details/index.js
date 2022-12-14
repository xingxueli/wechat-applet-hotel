import Toast from 'tdesign-miniprogram/toast/index';
import { fetchGood } from '../../../services/good/fetchGood';
import { fetchActivityList } from '../../../services/activity/fetchActivityList';
import {
  getGoodsDetailsCommentList,
  getGoodsDetailsCommentsCount,
} from '../../../services/good/fetchGoodsDetailsComments';
import dayjs from 'dayjs';

import { cdnBase } from '../../../config/index';

const imgPrefix = `${cdnBase}/`;

const recLeftImg = `${imgPrefix}common/rec-left.png`;
const recRightImg = `${imgPrefix}common/rec-right.png`;
const obj2Params = (obj = {}, encode = false) => {
  const result = [];
  Object.keys(obj).forEach((key) =>
    result.push(`${key}=${encode ? encodeURIComponent(obj[key]) : obj[key]}`),
  );

  return result.join('&');
};

Page({
  data: {
    commentsList: [],
    commentsStatistics: {
      badCount: 0,
      commentCount: 0,
      goodCount: 0,
      goodRate: 0,
      hasImageCount: 0,
      middleCount: 0,
    },
    isShowPromotionPop: false,
    activityList: [],
    recLeftImg,
    recRightImg,
    details: {},
    goodsTabArray: [
      {
        name: '商品',
        value: '', // 空字符串代表置顶
      },
      {
        name: '详情',
        value: 'goods-page',
      },
    ],
    storeLogo: `${imgPrefix}common/store-logo.png`,
    storeName: '云mall标准版旗舰店',
    jumpArray: [
      {
        title: '首页',
        url: '/pages/home/home',
        iconName: 'home',
      },
      {
        title: '购物车',
        url: '/pages/cart/index',
        iconName: 'cart',
        showCartNum: true,
      },
    ],
    isStock: true,
    cartNum: 0,
    soldout: false,
    buttonType: 1,
    buyNum: 1,
    selectedAttrStr: '',
    skuArray: [],
    primaryImage: '',
    specImg: '',
    isStartPopupShow: false,
    isEndPopupShow: false,
    isAllSelectedSku: false,
    buyType: 0,
    outOperateStatus: false, // 是否外层加入购物车
    operateType: 0,
    selectSkuSellsPrice: 0,
    maxLinePrice: 0,
    minSalePrice: 0,
    maxSalePrice: 0,
    list: [],
    spuId: '',
    navigation: { type: 'fraction' },
    current: 0,
    autoplay: true,
    duration: 500,
    interval: 5000,
    soldNum: 0, // 已售数量
    startDate: '',
    startDatePlusOneDay: '',
    endDate: '',
    initDateText: dayjs().format('YYYY-MM-DD'),
    storeId: 0,
    thumb: '',
    title: '',
    storeName: '',
    price: 0,
    originPrice: 0,
    roomStatus: 0,
    roomNum: '',
    roomStatusString: '',
    reserveTime: '',
    reserveText: '',
    images: [],
    desc: [],//评论里边的图片，后续考虑开发
    orderName: '',
    orderMobile: '',
    phoneError: false,
  },

  showStartPopup(type) {
    if(this.data.roomStatus == 1){//已被预定，一定要是订单已支付状态
      Toast({
        context: this,
        selector: '#t-toast',
        message: '当前房间已经被预定，请看看其他房间',
        icon: '',
        duration: 1000,
      });
      return;
    }
    this.setData({
      buyType: 1,
      outOperateStatus: type >= 1,
      isStartPopupShow: true
    });
  },

  showEndPopup(type) {
    if(this.data.roomStatus == 1){//已被预定，一定要是订单已支付状态
      Toast({
        context: this,
        selector: '#t-toast',
        message: '当前房间已经被预定，请看看其他房间',
        icon: '',
        duration: 1000,
      });
      return;
    }
    this.setData({
      buyType: 1,
      outOperateStatus: type >= 1,
      isEndPopupShow: true,
    });
  },

  buyItNow() {
    this.showSkuSelectPopup(1);
  },

  toAddCart() {
    this.showSkuSelectPopup(2);
  },

  toNav(e) {
    const { url } = e.detail;
    wx.switchTab({
      url: url,
    });
  },

  showCurImg(e) {
    const { index } = e.detail;
    const { images } = this.data.details;
    wx.previewImage({
      current: images[index],
      urls: images, // 需要预览的图片http链接列表
    });
  },

  onPageScroll({ scrollTop }) {
    const goodsTab = this.selectComponent('#goodsTab');
    goodsTab && goodsTab.onScroll(scrollTop);
  },

  chooseSpecItem(e) {
    const { specList } = this.data.details;
    const { selectedSku, isAllSelectedSku } = e.detail;
    if (!isAllSelectedSku) {
      this.setData({
        selectSkuSellsPrice: 0,
      });
    }
    this.setData({
      isAllSelectedSku,
    });
    this.getSkuItem(specList, selectedSku);
  },

  getSkuItem(specList, selectedSku) {
    const { skuArray, primaryImage } = this.data;
    const selectedSkuValues = this.getSelectedSkuValues(specList, selectedSku);
    let selectedAttrStr = ` 件  `;
    selectedSkuValues.forEach((item) => {
      selectedAttrStr += `，${item.specValue}  `;
    });
    // eslint-disable-next-line array-callback-return
    const skuItem = skuArray.filter((item) => {
      let status = true;
      (item.specInfo || []).forEach((subItem) => {
        if (
          !selectedSku[subItem.specId] ||
          selectedSku[subItem.specId] !== subItem.specValueId
        ) {
          status = false;
        }
      });
      if (status) return item;
    });
    this.selectSpecsName(selectedSkuValues.length > 0 ? selectedAttrStr : '');
    if (skuItem) {
      this.setData({
        selectItem: skuItem,
        selectSkuSellsPrice: skuItem.price || 0,
      });
    } else {
      this.setData({
        selectItem: null,
        selectSkuSellsPrice: 0,
      });
    }
    this.setData({
      specImg: skuItem && skuItem.skuImage ? skuItem.skuImage : primaryImage,
    });
  },

  // 获取已选择的sku名称
  getSelectedSkuValues(skuTree, selectedSku) {
    const normalizedTree = this.normalizeSkuTree(skuTree);
    return Object.keys(selectedSku).reduce((selectedValues, skuKeyStr) => {
      const skuValues = normalizedTree[skuKeyStr];
      const skuValueId = selectedSku[skuKeyStr];
      if (skuValueId !== '') {
        const skuValue = skuValues.filter((value) => {
          return value.specValueId === skuValueId;
        })[0];
        skuValue && selectedValues.push(skuValue);
      }
      return selectedValues;
    }, []);
  },

  normalizeSkuTree(skuTree) {
    const normalizedTree = {};
    skuTree.forEach((treeItem) => {
      normalizedTree[treeItem.specId] = treeItem.specValueList;
    });
    return normalizedTree;
  },

  selectSpecsName(selectSpecsName) {
    if (selectSpecsName) {
      this.setData({
        selectedAttrStr: selectSpecsName,
      });
    } else {
      this.setData({
        selectedAttrStr: '',
      });
    }
  },

  addCart() {
    const { startDate,endDate } = this.data;
    let msg = '';
    if(startDate){
      msg = '请选择开始时间';
    }
    if(endDate){
      msg = '请选择结束时间';
    }
    Toast({
      context: this,
      selector: '#t-toast',
      message: msg,
      icon: '',
      duration: 1000,
    });
  },

  gotoBuy(type) {
    const { startDate,endDate,orderName,orderMobile } = this.data;
    if (!startDate || !endDate || !orderName || !orderMobile) {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '请选择入住时间，联系人和电话',
        icon: '',
        duration: 1000,
      });
      return;
    }
    const query = {
      quantity: dayjs(endDate).diff(startDate, 'day'),
      storeId: this.data.storeId,
      storeName: this.data.storeName,
      spuId: this.data.spuId,
      goodsName: this.data.title,
      skuId: this.data.skuId,
      available: 1,
      price: this.data.price,
      specInfo: this.data.details.specList?.map((item) => ({
        specTitle: item.title,
        specValue: item.specValueList[0].specValue,
      })),
      primaryImage: this.data.thumb,
      thumb: this.data.thumb,
      title: this.data.title,
      startDate: startDate,
      endDate: endDate,
      orderName: this.data.orderName,
      orderMobile: this.data.orderMobile,
    };
    let urlQueryStr = obj2Params({
      goodsRequestList: encodeURIComponent(JSON.stringify([query])),
    });
    urlQueryStr = urlQueryStr ? `?${urlQueryStr}` : '';
    const path = `/pages/order/order-confirm/index${urlQueryStr}`;
    wx.navigateTo({
      url: path,
    });
  },

  onStartConfirm(e) {
    this.setData({
      startDate: e.detail.value,
      startDatePlusOneDay: dayjs(e.detail.value).add(1,'day').format('YYYY-MM-DD')
    });
    const { buyType} = this.data;
    if (buyType === 1) {
      this.gotoBuy();
    } else {
      this.addCart();
    }
  },

  print(e){
    console.log('enter print')
  },

  onEndConfirm(e) {
    this.setData({
      endDate: e.detail.value,
    });
    const { buyType} = this.data;
    if (buyType === 1) {
      this.gotoBuy();
    } else {
      this.addCart();
    }
  },

  changeNum(e) {
    this.setData({
      buyNum: e.detail.buyNum,
    });
  },

  closePromotionPopup() {
    this.setData({
      isShowPromotionPop: false,
    });
  },

  promotionChange(e) {
    const { index } = e.detail;
    wx.navigateTo({
      url: `/pages/promotion-detail/index?promotion_id=${index}`,
    });
  },

  showPromotionPopup() {
    this.setData({
      isShowPromotionPop: true,
    });
  },

  getDetail(spuId) {
    Promise.resolve(fetchGood(spuId)).then((res) => {
      console.log(res)
      const details = res;
      this.setData({
        details,
        spuId: details.spuId,
        storeId: details.storeId,
        thumb: details.thumb,
        title: details.title,
        storeName: details.storeName,
        price: details.price,
        originPrice: details.originPrice,
        roomStatus: details.roomStatus,
        roomNum: details.roomNum,
        roomStatusString: details.roomStatusString,
        reserveTime: details.reserveTime,
        reserveText: details.roomStatus == 1 ? '已被预定，预定时间'+details.reserveTime : '',
        images: details.images,
        startDate: '',
        endDate: '',
        desc: [],//评论里边的图片，后续考虑开发
      });
    });
  },

  async getCommentsList() {
    try {
      const code = 'Success';
      const data = await getGoodsDetailsCommentList();
      const { homePageComments } = data;
      if (code.toUpperCase() === 'SUCCESS') {
        const nextState = {
          commentsList: homePageComments.map((item) => {
            return {
              goodsSpu: item.spuId,
              userName: item.userName || '',
              commentScore: item.commentScore,
              commentContent: item.commentContent || '用户未填写评价',
              userHeadUrl: item.isAnonymity
                ? this.anonymityAvatar
                : item.userHeadUrl || this.anonymityAvatar,
            };
          }),
        };
        this.setData(nextState);
      }
    } catch (error) {
      console.error('comments error:', error);
    }
  },

  onShareAppMessage() {
    // 自定义的返回信息
    const { selectedAttrStr } = this.data;
    let shareSubTitle = '';
    if (selectedAttrStr.indexOf('件') > -1) {
      const count = selectedAttrStr.indexOf('件');
      shareSubTitle = selectedAttrStr.slice(count + 1, selectedAttrStr.length);
    }
    const customInfo = {
      imageUrl: this.data.details.primaryImage,
      title: this.data.details.title + shareSubTitle,
      path: `/pages/goods/details/index?spuId=${this.data.spuId}`,
    };
    return customInfo;
  },

  /** 获取评价统计 */
  async getCommentsStatistics() {
    try {
      const code = 'Success';
      const data = await getGoodsDetailsCommentsCount();
      if (code.toUpperCase() === 'SUCCESS') {
        const {
          badCount,
          commentCount,
          goodCount,
          goodRate,
          hasImageCount,
          middleCount,
        } = data;
        const nextState = {
          commentsStatistics: {
            badCount: parseInt(`${badCount}`),
            commentCount: parseInt(`${commentCount}`),
            goodCount: parseInt(`${goodCount}`),
            /** 后端返回百分比后数据但没有限制位数 */
            goodRate: Math.floor(goodRate * 10) / 10,
            hasImageCount: parseInt(`${hasImageCount}`),
            middleCount: parseInt(`${middleCount}`),
          },
        };
        this.setData(nextState);
      }
    } catch (error) {
      console.error('comments statiistics error:', error);
    }
  },

  /** 跳转到评价列表 */
  navToCommentsListPage() {
    wx.navigateTo({
      url: `/pages/goods/comments/index?spuId=${this.data.spuId}`,
    });
  },

  onLoad(query) {
    const { spuId } = query;
    this.setData({
      spuId: spuId,
    });
    this.getDetail(spuId);
    this.getCommentsList(spuId);
    this.getCommentsStatistics(spuId);
  },

  onPhoneInput(e) {
    const { phoneError } = this.data;
    const isPhoneNumber = /^[1][3,4,5,7,8,9][0-9]{9}$/.test(e.detail.value);
    if (phoneError === isPhoneNumber) {
        this.setData({
            phoneError: !isPhoneNumber,
        });
    }
    if(isPhoneNumber === true){
      this.setData({
        orderMobile: e.detail.value,
      });
      const { buyType} = this.data;
      if (buyType === 1) {
        this.gotoBuy();
      } else {
        this.addCart();
      }
    }
  },

  inputOrderName(e){
    this.setData({
      orderName: e.detail.value,
    });
    const { buyType} = this.data;
    if (buyType === 1) {
      this.gotoBuy();
    } else {
      this.addCart();
    }
  },
});
