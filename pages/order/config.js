export const OrderStatus = {
  PENDING_PAYMENT: 5, // 待支付
  PENDING_DELIVERY: 10, // 待入住
  PENDING_RECEIPT: 40, // 已入住
  COMPLETE: 50, // 已退房
  PAYMENT_TIMEOUT: 80, // 已取消，支付超时
  CANCELED_NOT_PAYMENT: 80, // 已取消，未支付主动取消
  CANCELED_PAYMENT: 80, // 已取消，已支付主动取消
  CANCELED_REJECTION: 80, // 已取消，拒收
};

// 订单按钮类型
export const OrderButtonTypes = {
  PAY: 1, // 付款
  CANCEL: 2, // 取消订单
  CONFIRM: 3, // 确认收货
  APPLY_REFUND: 4, // 申请售后
  VIEW_REFUND: 5, // 查看退款
  COMMENT: 6, // 评价
  DELETE: 7, // 删除订单
  DELIVERY: 8, // 查看物流
  REBUY: 9, // 再次购买
  INVITE_GROUPON: 11, //邀请好友拼团
};
