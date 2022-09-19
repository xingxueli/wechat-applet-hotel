import Toast from 'tdesign-miniprogram/toast/index';
import Dialog from 'tdesign-miniprogram/dialog/index';
import { OrderButtonTypes } from '../../config';
import { cancelOrder } from '../../../../services/order/orderConfirm';
const obj2Params = (obj = {}, encode = false) => {
  const result = [];
  Object.keys(obj).forEach((key) =>
    result.push(`${key}=${encode ? encodeURIComponent(obj[key]) : obj[key]}`),
  );

  return result.join('&');
};

Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    order: {
      type: Object,
      observer(order) {
        // 判定有传goodsIndex ，则认为是商品button bar, 仅显示申请售后按钮
        if (this.properties?.goodsIndex !== null) {
          const goods = order.goodsList[Number(this.properties.goodsIndex)];
          this.setData({
            buttons: {
              left: [],
              right: (goods.buttons || []).filter(
                (b) => b.type == OrderButtonTypes.APPLY_REFUND,
              ),
            },
          });
          return;
        }
        // 订单的button bar 不显示申请售后按钮
        const buttonsRight = (order.buttons || [])
          // .filter((b) => b.type !== OrderButtonTypes.APPLY_REFUND)
          .map((button) => {
            //邀请好友拼团按钮
            if (
              button.type === OrderButtonTypes.INVITE_GROUPON
            ) {
              const {
                goodsList,
              } = order;
              const goodsImg = goodsList[0] && goodsList[0].imgUrl;
              const goodsName = goodsList[0] && goodsList[0].name;
              return {
                ...button,
                openType: 'share',
                dataShare: {
                  goodsImg,
                  goodsName,
                  groupId,
                  promotionId,
                  remainMember,
                  groupPrice,
                  storeId: order.storeId,
                },
              };
            }
            return button;
          });
        // 删除订单按钮单独挪到左侧
        const deleteBtnIndex = buttonsRight.findIndex(
          (b) => b.type === OrderButtonTypes.DELETE,
        );
        let buttonsLeft = [];
        if (deleteBtnIndex > -1) {
          buttonsLeft = buttonsRight.splice(deleteBtnIndex, 1);
        }
        this.setData({
          buttons: {
            left: buttonsLeft,
            right: buttonsRight,
          },
        });
      },
    },
    goodsIndex: {
      type: Number,
      value: null,
    },
    isBtnMax: {
      type: Boolean,
      value: false,
    },
  },

  data: {
    order: {},
    buttons: {
      left: [],
      right: [],
    },
  },

  methods: {
    // 点击【订单操作】按钮，根据按钮类型分发
    onOrderBtnTap(e) {
      const { type } = e.currentTarget.dataset;
      switch (type) {
        case OrderButtonTypes.DELETE:
          this.onDelete(this.data.order);
          break;
        case OrderButtonTypes.CANCEL:
          this.onCancel(this.data.order);
          break;
        case OrderButtonTypes.CONFIRM:
          this.onConfirm(this.data.order);
          break;
        case OrderButtonTypes.PAY:
          this.onPay(this.data.order);
          break;
        case OrderButtonTypes.APPLY_REFUND:
          this.onApplyRefund(this.data.order);
          break;
        case OrderButtonTypes.VIEW_REFUND:
          this.onViewRefund(this.data.order);
          break;
        case OrderButtonTypes.COMMENT:
          this.onAddComent(this.data.order);
          break;
        case OrderButtonTypes.INVITE_GROUPON:
          //分享邀请好友拼团
          break;
        case OrderButtonTypes.REBUY:
          this.onBuyAgain(this.data.order);
      }
    },

    onCancel() {
      const params = this.data.order;
      cancelOrder(params).then(
        (res) => {
          if (res.code === 'Success') {
            Toast({
              context: this,
              selector: '#t-toast',
              message: '订单取消成功',
              duration: 2000,
              icon: '',
            });
            //刷新订单列表
             setTimeout(() => {
              wx.redirectTo({ url: '/pages/order/order-list/index' });
             });
          } else {
            Toast({
              context: this,
              selector: '#t-toast',
              message: res.errorMsg || '订单取消失败，请联系客服人员进行取消',
              duration: 2000,
              icon: '',
            });
            // setTimeout(() => {
            //   // 提交支付失败   返回购物车
            //   wx.navigateBack();
            // }, 2000);
          }
        },
        (err) => {
          console.log(err)
            Toast({
              context: this,
              selector: '#t-toast',
              message: '取消失败，请联系客服',
              duration: 2000,
              icon: 'close-circle',
            });
            //是否需要跳转
            // setTimeout(() => {
            //   wx.redirectTo({ url: '/order/list' });
            // });
        },
      );
    },

    onConfirm() {
      Dialog.confirm({
        title: '确认是否已经收到货？',
        content: '',
        confirmBtn: '确认收货',
        cancelBtn: '取消',
      })
        .then(() => {
          Toast({
            context: this,
            selector: '#t-toast',
            message: '你确认了确认收货',
            icon: 'check-circle',
          });
        })
        .catch(() => {
          Toast({
            context: this,
            selector: '#t-toast',
            message: '你取消了确认收货',
            icon: 'check-circle',
          });
        });
    },

    onPay() {
      console.log(this.data)
      const order = this.data.order;
      const { predictStartTime,predictEndTime,orderName,orderMobile } = order;
      if (!predictStartTime || !predictEndTime || !orderName || !orderMobile) {
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
        quantity: order.quantity,
        storeId: order.storeId,
        storeName: order.storeName,
        spuId: order.goodsList[0].spuId,
        goodsName: order.goodsList[0].title,
        skuId: order.goodsList[0].skuId,
        available: 1,
        price: order.goodsList[0].price,
        specInfo: order.goodsList[0].specs?.map((item) => ({
          specTitle: item.title,
          specValue: item.specValueList[0].specValue,
        })),
        primaryImage: order.goodsList[0].thumb,
        thumb: order.goodsList[0].thumb,
        title: order.goodsList[0].title,
        startDate: order.predictStartTime,
        endDate: order.predictEndTime,
        orderName: order.orderName,
        orderMobile: order.orderMobile,
        orderNum: order.orderNo,
        remark: order.remark
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

    onBuyAgain() {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '你点击了再次购买',
        icon: 'check-circle',
      });
    },

    onApplyRefund(order) {
      const goods = order.goodsList[this.properties.goodsIndex];
      const params = {
        orderNo: order.orderNo,
        skuId: goods?.skuId ?? '19384938948343',
        spuId: goods?.spuId ?? '28373847384343',
        orderStatus: order.status,
        price: goods?.price ?? 89,
        num: goods?.num ?? 89,
        createTime: order.createTime,
        orderAmt: order.totalAmount,
        payAmt: order.amount,
        canApplyReturn: true,
      };
      const paramsStr = Object.keys(params)
        .map((k) => `${k}=${params[k]}`)
        .join('&');
      wx.navigateTo({ url: `/pages/order/apply-service/index?${paramsStr}` });
    },

    onViewRefund() {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '你点击了查看退款',
        icon: '',
      });
    },

    /** 添加订单评论 */
    onAddComent(order) {
      const imgUrl = order?.goodsList?.[0]?.thumb;
      const title = order?.goodsList?.[0]?.title;
      const specs = order?.goodsList?.[0]?.specs;
      wx.navigateTo({
        url: `/pages/goods/comments/create/index?specs=${specs}&title=${title}&orderNo=${order?.orderNo}&imgUrl=${imgUrl}`,
      });
    },
  },
});
