import Toast from 'tdesign-miniprogram/toast/index';
import { commitPay, wechatPayOrder } from './pay';

const stripeImg = `https://cdn-we-retail.ym.tencent.com/miniapp/order/stripe.png`;

Page({
  data: {
    placeholder: '备注信息',
    stripeImg,
    loading: false,
    settleDetailData: {
      storeGoodsList: [], //正常下单商品列表
      outOfStockGoodsList: [], //库存不足商品
      abnormalDeliveryGoodsList: [], // 不能正常配送商品
      inValidGoodsList: [], // 失效或者库存不足
      limitGoodsList: [], //限购商品
      couponList: [], //门店优惠券信息
    }, // 获取结算页详情 data
    orderCardList: [], // 仅用于商品卡片展示
    couponsShow: false, // 显示优惠券的弹框
    invoiceData: {
      email: '', // 发票发送邮箱
      buyerTaxNo: '', // 税号
      invoiceType: null, // 开票类型  1：增值税专用发票； 2：增值税普通发票； 3：增值税电子发票；4：增值税卷式发票；5：区块链电子发票。
      buyerPhone: '', //手机号
      buyerName: '', //个人或公司名称
      titleType: '', // 发票抬头 1-公司 2-个人
      contentType: '', //发票内容 1-明细 2-类别
    },
    goodsRequestList: [],
    userAddressReq: null,
    popupShow: false, // 不在配送范围 失效 库存不足 商品展示弹框
    notesPosition: 'center',
    storeInfoList: [],
    storeNoteIndex: 0, //当前填写备注门店index
    promotionGoodsList: [], //当前门店商品列表(优惠券)
    couponList: [], //当前门店所选优惠券
    submitCouponList: [], //所有门店所选优惠券
    currentStoreId: null, //当前优惠券storeId
    userAddress: null,
    startDate: '',
    endDate: '',
    totalGoodsCount: 0,
    totalSalePrice: '0',
    totalPayAmount: 0,
    settleType: 1,
    orderName: '',
    orderMobile: '',
    orderNum: '',
  },

  payLock: false,
  noteInfo: [],
  tempNoteInfo: [],
  onLoad(options) {
    let loadData = JSON.parse(decodeURIComponent(options.goodsRequestList));
    console.log(loadData)
    this.setData({
      loading: true,
      startDate: loadData[0].startDate,
      endDate: loadData[0].endDate,
      orderName: loadData[0].orderName,
      orderMobile: loadData[0].orderMobile,
      orderNum: loadData[0].orderNum
    });
    this.handleOptionsParams(options);
  },
  onShow() {
    const invoiceData = wx.getStorageSync('invoiceData');
    if (invoiceData) {
      //处理发票
      this.invoiceData = invoiceData;
      this.setData({
        invoiceData,
      });
      wx.removeStorageSync('invoiceData');
    }
  },

  init() {
    this.setData({
      loading: true,
    });
    const { goodsRequestList } = this;
    this.handleOptionsParams({ goodsRequestList });
  },
  // 处理不同情况下跳转到结算页时需要的参数
  handleOptionsParams(options, couponList) {
    let { goodsRequestList } = this; // 商品列表
    let { userAddressReq } = this; // 收货地址

    const storeInfoList = []; // 门店列表
    // 如果是从地址选择页面返回，则使用地址显选择页面新选择的地址去获取结算数据
    if (options.userAddressReq) {
      userAddressReq = options.userAddressReq;
    }
    if (options.type === 'cart') {
      // 从购物车跳转过来时，获取传入的商品列表数据
      const goodsRequestListJson = wx.getStorageSync('order.goodsRequestList');
      goodsRequestList = JSON.parse(goodsRequestListJson);
    } else if (typeof options.goodsRequestList === 'string') {
      goodsRequestList = JSON.parse(decodeURIComponent(options.goodsRequestList));
    }
    //获取结算页请求数据列表
    const storeMap = {};
    goodsRequestList.forEach((goods) => {
      if (!storeMap[goods.storeId]) {
        storeInfoList.push({
          storeId: goods.storeId,
          storeName: goods.storeName,
        });
        storeMap[goods.storeId] = true;
      }
    });
    this.goodsRequestList = goodsRequestList;
    this.storeInfoList = storeInfoList;
    this.initData(goodsRequestList);
  },
  initData(resData) {
    // 转换商品卡片显示数据
    const data = this.handleResToGoodsCard(resData);
    this.isInvalidOrder(data);
  },

  isInvalidOrder(data) {
    // 失效 不在配送范围 限购的商品 提示弹窗
    if (
      (data.limitGoodsList && data.limitGoodsList.length > 0) ||
      (data.abnormalDeliveryGoodsList &&
        data.abnormalDeliveryGoodsList.length > 0) ||
      (data.inValidGoodsList && data.inValidGoodsList.length > 0)
    ) {
      this.setData({ popupShow: true });
      return true;
    }
    this.setData({ popupShow: false });
    if (data.settleType === 0) {
      return true;
    }
    return false;
  },

  handleError() {
    Toast({
      context: this,
      selector: '#t-toast',
      message: '结算异常, 请稍后重试',
      duration: 2000,
      icon: '',
    });

    setTimeout(() => {
      wx.navigateBack();
    }, 1500);
    this.setData({
      loading: false,
    });
  },
  getRequestGoodsList(storeGoodsList) {
    const filterStoreGoodsList = [];
    storeGoodsList &&
      storeGoodsList.forEach((store) => {
        const { storeName } = store;
        store.skuDetailVos &&
          store.skuDetailVos.forEach((goods) => {
            const data = goods;
            data.storeName = storeName;
            filterStoreGoodsList.push(data);
          });
      });
    return filterStoreGoodsList;
  },
  handleGoodsRequest(goods, isOutStock = false) {
    const {
      reminderStock,
      quantity,
      storeId,
      uid,
      saasId,
      spuId,
      goodsName,
      skuId,
      storeName,
    } = goods;
    const resQuantity = isOutStock ? reminderStock : quantity;
    return {
      quantity: resQuantity,
      storeId,
      uid,
      saasId,
      spuId,
      goodsName,
      skuId,
      storeName,
    };
  },
  handleResToGoodsCard(data) {
    // 转换数据 符合 goods-card展示
    const orderCardList = []; // 订单卡片列表
    const storeInfoList = [];
    const submitCouponList = []; //使用优惠券列表;

    // console.log('enter handleResToGoodsCard')
    // console.log(data)
    data &&
      data.forEach((ele,index) => {
        const orderCard = {
          id: ele.storeId,
          storeName: ele.storeName,
          status: 0,
          statusDesc: '',
          amount: ele.totalAmount,
          remark: ele.remark,
          quantity: ele.quantity,
          goodsList: [],
          orderName: ele.orderName,
          orderMobile: ele.orderMobile,
          predictStartTime: ele.predictStartTime,
          predictEndTime: ele.predictEndTime,
        }; // 订单卡片

        orderCard.goodsList.push({
          id: index,
          thumb: ele.thumb,
          title: ele.goodsName,
          specs: ['规格1','规格2'], // 规格列表 string[]
          price: ele.price, // 优先取限时活动价
          settlePrice: ele.price,
          num: ele.quantity,
          skuId: ele.spuId,
          spuId: ele.spuId,
          storeId: ele.storeId,
        });

        storeInfoList.push({
          storeId: ele.storeId,
          storeName: ele.storeName,
          remark: ele.remark,
        });
        this.noteInfo.push(orderCard.remark);
        this.tempNoteInfo.push(orderCard.remark);
        orderCardList.push(orderCard);
      });
    
    const totalGoodsCount = data[0].quantity;
    const totalSalePrice = data[0].price * data[0].quantity;
    const totalPayAmount = data[0].price * data[0].quantity;
    const settleType = 1;
    this.setData({ 
      orderCardList, 
      storeInfoList, 
      totalGoodsCount,
      totalSalePrice,
      totalPayAmount,
      settleType
    });
    return data;
  },

  onNotes(e) {
    const { storenoteindex: storeNoteIndex } = e.currentTarget.dataset;
    // 添加备注信息
    this.setData({
      dialogShow: true,
      storeNoteIndex,
    });
  },
  onInput(e) {
    // const { storeNoteIndex } = this.data;
    this.noteInfo[0] = e.detail.value;
  },
  onBlur() {
    this.setData({
      notesPosition: 'center',
    });
  },
  onFocus() {
    this.setData({
      notesPosition: 'self',
    });
  },
  onTap() {
    this.setData({
      placeholder: '',
    });
  },
  onNoteConfirm() {
    // 备注信息 确认按钮
    console.log('enter onNoteConfirm')
    const { storeInfoList,goodsRequestList } = this.data;
    this.tempNoteInfo[0] = this.noteInfo[0];
    storeInfoList[0].remark = this.noteInfo[0];

    this.setData({
      dialogShow: false,
      storeInfoList,
    });
  },

  onStartDate(){

  },
  onEndDate(){

  },

  onNoteCancel() {
    // 备注信息 取消按钮
    // const { storeNoteIndex } = this.data;
    this.noteInfo[0] = this.tempNoteInfo[0];
    this.setData({
      dialogShow: false,
    });
  },

  onSureCommit() {
    // 商品库存不足继续结算
    const { settleDetailData } = this.data;
    const { outOfStockGoodsList, storeGoodsList, inValidGoodsList } =
      settleDetailData;
    if (
      (outOfStockGoodsList && outOfStockGoodsList.length > 0) ||
      (inValidGoodsList && storeGoodsList)
    ) {
      // 合并正常商品 和 库存 不足商品继续支付
      // 过滤不必要的参数
      const filterOutGoodsList = [];
      outOfStockGoodsList &&
        outOfStockGoodsList.forEach((outOfStockGoods) => {
          const { storeName } = outOfStockGoods;
          outOfStockGoods.unSettlementGoods.forEach((ele) => {
            const data = ele;
            data.quantity = ele.reminderStock;
            data.storeName = storeName;
            filterOutGoodsList.push(data);
          });
        });
      const filterStoreGoodsList = this.getRequestGoodsList(storeGoodsList);
      const goodsRequestList = filterOutGoodsList.concat(filterStoreGoodsList);
      this.handleOptionsParams({ goodsRequestList });
    }
  },
  // 提交订单
  submitOrder() {
    let that = this
    wx.requestSubscribeMessage({
      tmplIds: ['qzQx2J_pSwoS3jE8jHQgv2OMX78kOkRLlUQSNnSo0BQ',
      'wqjsb7aUYKcdjqY-yMZI7FPQd65ds4NwcF_XOqGDQVk',
      'iWEjfRGKgZBn_Wr1QMB79CtXBrRA-L3lxhDidN2ouQQ'],
      success (res) {
        console.log(res)
      },
      complete(res){
        console.log(res)
        that.doSubmitOrder();
      }
    })
  },

  doSubmitOrder(){
    const {
      settleDetailData,
      storeInfoList,
      startDate,
      endDate,
      settleType,
      totalPayAmount,
      orderNum
    } = this.data;
    const { goodsRequestList } = this;

    if (!startDate && !endDate) {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '请添加入住时间',
        duration: 2000,
        icon: 'help-circle',
      });
      return;
    }
    // console.log(this.payLock)
    // console.log(!settleType)
    // console.log(!totalPayAmount)
    if (
      this.payLock ||
      !settleType ||
      !totalPayAmount
    ) {
      return;
    }
    this.payLock = true;
    const params = {
      goodsRequestList: goodsRequestList,
      totalAmount: totalPayAmount, //取优惠后的结算金额
      storeInfoList,
      orderNum,
    };
    commitPay(params).then(
      (res) => {
        console.log(res)
        this.payLock = false;
        const { data } = res;
        // 提交出现 失效 不在配送范围 限购的商品 提示弹窗
        // if (this.isInvalidOrder(data)) {
        //   return;
        // }
        if (res.code === 'Success') {
          this.handlePay(data, settleDetailData);
        } else {
          Toast({
            context: this,
            selector: '#t-toast',
            message: res.msg || '提交订单超时，请稍后重试',
            duration: 2000,
            icon: '',
          });
          setTimeout(() => {
            // 提交支付失败   返回购物车
            wx.navigateBack();
          }, 2000);
        }
      },
      (err) => {
        console.log(err)
        this.payLock = false;
        if (
          err.code === 'CONTAINS_INSUFFICIENT_GOODS' ||
          err.code === 'TOTAL_AMOUNT_DIFFERENT'
        ) {
          Toast({
            context: this,
            selector: '#t-toast',
            message: err.msg || '支付异常',
            duration: 2000,
            icon: '',
          });
          this.init();
        } else if (err.code === 'ORDER_PAY_FAIL') {
          Toast({
            context: this,
            selector: '#t-toast',
            message: '支付失败',
            duration: 2000,
            icon: 'close-circle',
          });
          setTimeout(() => {
            wx.redirectTo({ url: '/order/list' });
          });
        } else if (err.code === 'ILLEGAL_CONFIG_PARAM') {
          Toast({
            context: this,
            selector: '#t-toast',
            message:
              '支付失败，微信支付商户号设置有误，请商家重新检查支付设置。',
            duration: 2000,
            icon: 'close-circle',
          });
          setTimeout(() => {
            wx.redirectTo({ url: '/order/list' });
          });
        } else {
          Toast({
            context: this,
            selector: '#t-toast',
            message: err.msg || '提交支付超时，请稍后重试',
            duration: 2000,
            icon: '',
          });
          setTimeout(() => {
            // 提交支付失败  返回购物车
            wx.navigateBack();
          }, 2000);
        }
      },
    );
  },

  // 处理支付
  handlePay(data, settleDetailData) {
    const { channel, payInfo, tradeNo, interactId, transactionId,payAmt } = data;
    const { totalAmount, totalPayAmount } = settleDetailData;
    // console.log(data)
    // console.log(settleDetailData)
    // console.log(totalAmount)
    // console.log(totalPayAmount)
    const payOrderInfo = {
      payInfo: payInfo,
      orderId: tradeNo,
      orderAmt: totalAmount === undefined ? payAmt : totalAmount,
      payAmt: totalPayAmount === undefined ? payAmt : totalPayAmount,
      interactId: interactId,
      tradeNo: tradeNo,
      transactionId: transactionId,
    };

    if (channel === 'wechat') {
      wechatPayOrder(payOrderInfo);
    }
  },

  hide() {
    // 隐藏 popup
    this.setData({
      'settleDetailData.abnormalDeliveryGoodsList': [],
    });
  },
  onReceipt() {
    // 跳转 开发票
    const invoiceData = this.invoiceData || {};
    wx.navigateTo({
      url: `/pages/order/receipt/index?invoiceData=${JSON.stringify(
        invoiceData,
      )}`,
    });
  },

  onCoupons(e) {
    const { submitCouponList, currentStoreId } = this.data;
    const { goodsRequestList } = this;
    const { selectedList } = e.detail;
    const tempSubmitCouponList = submitCouponList.map((storeCoupon) => {
      return {
        couponList:
          storeCoupon.storeId === currentStoreId
            ? selectedList
            : storeCoupon.couponList,
      };
    });
    const resSubmitCouponList = this.handleCouponList(tempSubmitCouponList);
    //确定选择优惠券
    this.handleOptionsParams({ goodsRequestList }, resSubmitCouponList);
    this.setData({ couponsShow: false });
  },
  onOpenCoupons(e) {
    const { storeid } = e.currentTarget.dataset;
    this.setData({
      couponsShow: true,
      currentStoreId: storeid,
    });
  },

  handleCouponList(storeCouponList) {
    //处理门店优惠券   转换成接口需要
    if (!storeCouponList) return [];
    const resSubmitCouponList = [];
    storeCouponList.forEach((ele) => {
      resSubmitCouponList.push(...ele.couponList);
    });
    return resSubmitCouponList;
  },

  onGoodsNumChange(e) {
    const {
      detail: { value },
      currentTarget: {
        dataset: { goods },
      },
    } = e;
    const index = this.goodsRequestList.findIndex(
      ({ storeId, spuId, skuId }) =>
        goods.storeId === storeId &&
        goods.spuId === spuId &&
        goods.skuId === skuId,
    );
    if (index >= 0) {
      // eslint-disable-next-line no-confusing-arrow
      const goodsRequestList = this.goodsRequestList.map((item, i) =>
        i === index ? { ...item, quantity: value } : item,
      );
      this.handleOptionsParams({ goodsRequestList });
    }
  },

  onPopupChange() {
    this.setData({
      popupShow: !this.data.popupShow,
    });
  },
});
