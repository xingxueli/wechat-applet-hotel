import { mockIp, mockReqId } from '../../utils/mock';

const orderResps = [
  {
    data: {
      saasId: '88888888',
      storeId: '1000',
      storeName: '红兴农家院',
      uid: '88888888205468',
      orderId: '354021735982432279',
      orderNo: '354021731671873099',
      orderStatus: 5,
      totalAmount: '10010',
      paymentAmount: '20',
      discountAmount: '9990',
      remark: '买电风扇送电池吗',
      cancelType: 0,
      cancelReasonType: 0,
      cancelReason: '',
      createTime: '1600350829288',
      orderItemVOs: [
        {
          id: '354021736133427225',
          spuId: '3',
          skuId: '135696670',
          goodsName:
            '腾讯极光盒子4智能网络电视机顶盒6K千兆网络机顶盒4K高分辨率',
          specifications: [
            { specTitle: '颜色', specValue: '贵族青' },
            { specTitle: '类型', specValue: '尊享礼盒装' },
          ],
          goodsPictureUrl:
            'https://cdn-we-retail.ym.tencent.com/tsr/goods/dz-3b.png',
          originPrice: '0',
          actualPrice: '9999',
          buyQuantity: 1,
          buttonVOs: [{ primary: false }],
        },
      ],
      paymentVO: {
        payStatus: 1,
        amount: '20',
        currency: null,
        payType: null,
        payWay: null,
        payWayName: null,
        interactId: null,
        traceNo: null,
        channelTrxNo: null,
        period: null,
        payTime: null,
        paySuccessTime: null,
      },
      buttonVOs: [{ primary: true, type: 1, name: '付款' }],
      invoiceVO: null,
      couponAmount: '0',
      autoCancelTime: '1823652629288',
      orderStatusName: '待付款',
      orderSatusRemark: '需支付￥0.20'
    }
  },
  {
    data: {
      saasId: '88888888',
      storeId: '1000',
      storeName: '红兴农家院',
      uid: '88888888205468',
      orderId: '132381537256650240',
      orderNo: '132381532610540875',
      orderStatus: 10,
      totalAmount: '76600',
      paymentAmount: '36800',
      discountAmount: '34800',
      remark: '麻烦给个配饰',
      cancelType: 0,
      cancelReasonType: 0,
      cancelReason: '',
      createTime: '1587140043976',
      orderItemVOs: [
        {
          id: '132381537407645952',
          spuId: '7',
          skuId: '135691633',
          goodsName:
            '不锈钢刀叉勺套装家用西餐餐具ins简约耐用不锈钢金色银色可选',
          goodsPictureUrl:
            'https://cdn-we-retail.ym.tencent.com/tsr/goods/gh-2b.png',
          originPrice: '29900',
          actualPrice: '19900',
          specifications: [
            { specTitle: '颜色', specValue: '奶黄色' },
            { specTitle: '类型', specValue: '三件套' },
          ],
          buyQuantity: 1,
          buttonVOs: null,
        }
      ],
      paymentVO: {
        payStatus: 1,
        amount: '36800',
        currency: 'CNY',
        payType: 0,
        payWay: null,
        payWayName: null,
        interactId: '4923587',
        traceNo: null,
        channelTrxNo: null,
        period: null,
        payTime: '1600162877000',
        paySuccessTime: '1600162877538',
      },
      buttonVOs: [
        {
          primary: false,
          type: 2,
          name: '取消订单',
        },
        {
          primary: true,
          type: 9,
          name: '再次购买',
        },
      ],
      couponAmount: '5000',
      autoCancelTime: null,
      orderStatusName: '待入住',
      orderSatusRemark: null
    }
  },
  {
    data: {
      saasId: '88888888',
      storeId: '1000',
      storeName: '红兴农家院',
      uid: '88888888205468',
      orderId: '132222629674264064',
      orderNo: '132222623132329291',
      orderStatus: 40,
      totalAmount: '500400',
      paymentAmount: '458600',
      discountAmount: '36800',
      remark: '我是买一送一的，记得送',
      cancelType: 3,
      cancelReasonType: 0,
      cancelReason: '',
      createTime: '1587130572345',
      orderItemVOs: [
        {
          id: '132222629825260288',
          spuId: '3',
          skuId: '135691622',
          goodsName:
            '腾讯极光盒子4智能网络电视机顶盒6K千兆网络机顶盒4K高分辨率',
          goodsPictureUrl:
            'https://cdn-we-retail.ym.tencent.com/tsr/goods/dz-3a.png',
          originPrice: '16900',
          actualPrice: '9900',
          specifications: [
            {
              specTitle: '颜色',
              specValue: '经典白',
            },
            {
              specTitle: '类型',
              specValue: '经典套装',
            },
          ],
          buyQuantity: 1,
          buttonVOs: [{ primary: false, type: 4, name: '申请售后' }],
        }
      ],
      paymentVO: {
        payStatus: 1,
        amount: '458600',
        currency: 'CNY',
        payType: 0,
        payWay: null,
        payWayName: null,
        interactId: '66869',
        traceNo: null,
        channelTrxNo: null,
        period: null,
        payTime: '1594869391000',
        paySuccessTime: '1594869391287',
      },
      buttonVOs: [
        {
          primary: true,
          type: 3,
          name: '确认收货',
        },
      ],
      couponAmount: '5000',
      autoCancelTime: null,
      orderStatusName: '已入住',
      orderSatusRemark: null
    }
  },
  {
    data: {
      saasId: '88888888',
      storeId: '1000',
      storeName: '红兴农家院',
      uid: '88888888205468',
      orderId: '130494482155052032',
      orderNo: '130494472895208267',
      orderStatus: 80,
      totalAmount: '59700',
      paymentAmount: '24900',
      discountAmount: '29800',
      remark: '',
      cancelType: 3,
      cancelReasonType: 0,
      cancelReason: '超时未支付',
      createTime: '1587027566726',
      orderItemVOs: [
        {
          id: '130494482322824704',
          spuId: '7',
          skuId: '135691633',
          goodsName:
            '不锈钢刀叉勺套装家用西餐餐具ins简约耐用不锈钢金色银色可选',
          goodsPictureUrl:
            'https://cdn-we-retail.ym.tencent.com/tsr/goods/gh-2b.png',
          originPrice: '29900',
          actualPrice: '19900',
          specifications: [
            { specTitle: '颜色', specValue: '奶黄色' },
            { specTitle: '类型', specValue: '三件套' },
          ],
          buyQuantity: 3,
          buttonVOs: null,
        },
      ],
      paymentVO: {
        payStatus: 1,
        amount: '24900',
        currency: null,
        payType: null,
        payWay: null,
        payWayName: null,
        interactId: null,
        traceNo: null,
        channelTrxNo: null,
        period: null,
        payTime: null,
        paySuccessTime: null,
      },
      buttonVOs: null,
      invoiceVO: null,
      couponAmount: '5000',
      autoCancelTime: null,
      orderStatusName: '已取消(未支付)',
      orderSatusRemark: '超时未支付',
      logisticsLogVO: null,
      invoiceStatus: 3,
      invoiceDesc: '暂不开发票',
      invoiceUrl: null,
    }
  },
  {
    data: {
      saasId: '88888888',
      storeId: '1000',
      storeName: '红兴农家院',
      uid: '88888888205468',
      orderId: '130169572291521792',
      orderNo: '130169571554503755',
      orderStatus: 50,
      totalAmount: '538000',
      paymentAmount: '508200',
      discountAmount: '29800',
      remark: '',
      cancelType: 0,
      cancelReasonType: 0,
      cancelReason: '',
      createTime: '1587008200587',
      orderItemVOs: [
        {
          id: '130169572425740032',
          spuId: '1',
          skuId: '135691631',
          goodsName:
            '纯色纯棉休闲圆领短袖T恤纯白亲肤厚柔软细腻面料纯白短袖套头T恤',
          goodsPictureUrl:
            'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-08b.png',
          originPrice: '31900',
          actualPrice: '26900',
          specifications: [
            { specTitle: '颜色', specValue: '橙色' },
            { specTitle: '尺码', specValue: 'M' },
          ],
          buyQuantity: 20,
          buttonVOs: null,
        },
      ],
      paymentVO: {
        payStatus: 2,
        amount: '508200',
        currency: 'CNY',
        payType: 0,
        payWay: 0,
        payWayName: '微信支付',
        interactId: '121212',
        traceNo: '121212',
        channelTrxNo: '121212',
        period: null,
        payTime: '2020-03-23 00:00:00',
        paySuccessTime: '2020-04-16 11:36:41',
      },
      buttonVOs: [
        { primary: false, type: 4, name: '申请售后' },
        { primary: true, type: 6, name: '评价' },
      ],
      couponAmount: '0',
      autoCancelTime: null,
      orderStatusName: '已退房',
      orderSatusRemark: null
    }
  }
];

export function genOrderDetail(params) {
  const { parameter } = params;
  const resp = orderResps.find((r) => r.data.orderNo === parameter);
  return resp;
}

export function genBusinessTime() {
  const resp = {
    data: {
      businessTime: ['周一,周二,周三,周四,周五:00:20:00-08:00:00'],
      telphone: '18565372257',
      saasId: '88888888',
    },
    code: 'Success',
    msg: null,
    requestId: mockReqId(),
    clientIp: mockIp(),
    rt: 3,
    success: true,
  };
  return resp;
}
