//1.页面加载时 获取缓存中选中的商品  渲染到页面中
//
//2.支付
//判断缓存中是否有token
//没有  跳转到授权页面
//有 继续支付

import { getSetting, chooseAddress, openSetting, showModal, showToast, requestPayment } from "../../utils/asyncWx.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
import { request } from "../../request/index.js";

Page({
  data: {
    address: {},
    cart: [],
    totalNum: 0,
    totalPrice: 0,
    checkedItems: []
  },
  onShow() {
    //获取缓存中的收货地址
    const address = wx.getStorageSync("address");
    //获取缓存中的购物车数据
    let cart = wx.getStorageSync('cart') || [];
    cart = cart.filter(v => v.checked);

    //计算全选
    //every 数组方法会遍历接收一个回调函数 如果每个回调函数都返回true 那么返回true
    //如果有一个false，终止循环，返回false
    //空数组返回true
    /*       const allChecked = cart.length?cart.every(v=>v.checked):false;
      */
    let totalNum = 0;
    let totalPrice = 0;
    cart.forEach(v => {
      totalPrice += v.num * v.goods_price;
      totalNum += v.num;
    })
    //给data赋值
    this.setData({
      cart,
      totalNum,
      totalPrice,
      address
    })


  },

  //支付事件
  async handleOrderPay() {
    try {
      //判断有无token
      const token = wx.getStorageSync("token");
      if (!token) {
        //没有token 转到授权页面
        wx.navigateTo({
          url: '/pages/auth/index',
        });
        return;
      };
      //创建订单
      //准备请求头参数
      const header = { Authorization: token };
      //准备请求体参数
      const order_price = this.data.totalPrice;
      const consignee_addr = this.data.address.all;
      const cart = this.data.cart;
      let goods = [];
      cart.forEach(v => goods.push({
        goods_id: v.goods_id,
        goods_number: v.num,
        goods_price: v.goods_price
      }))
      const orderParams = { order_price, consignee_addr, goods };
      //准备发送请求 创建订单 获取订单编号
      const { order_num } = await request({ url: "/my/orders/create", method: "post", data: orderParams });
      //发起预支付接口
      const { pay } = await request({ url: "/my/orders/req_unifiedorder", method: "post", data: { order_num } });
      //发起微信支付
      await request(pay);
      //查询后台订单状态
      await request({ url: "/my/orders/chkOrder", method: "post", data: { order_num }});
      await showToast({ title: "支付成功" });
      //手动删除缓存中已经支付的商品
      let newCart = this.getStorageSync("cart");
      newCart=newCart.filter(v=>!v.checked);
      wx.setStorageSync("cart", newCart);
      //支付成功 跳转到订单页面
      wx.navigateTo({
        url: '/pages/order/index',
      });
    } catch (error) {
      await showToast({ title: "支付失败" })

    }
  }

})