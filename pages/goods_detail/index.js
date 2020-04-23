// pages/goods_detail/index.js

//1.发送请求数据
//2.点击轮播图预览大图
//3.点击加入购物车
    //先绑定点击事件
    //获取缓存中的购物车数据（数组格式）
    //先判断 当前商品是否存在于购物车
    //已经存在 修改商品数据 购物车++ 重新把购物车数组放入缓存
    //不存在 直接给数组添加新元素 带上数量属性 重新把购物车数组放入缓存
    //弹出用户提示
//4.商品收藏
    //onshow 加载缓存中的收藏数据
      //判断是否收藏该商品   是的 就改图标
    //点击 收藏按钮 判断是否在缓存的收藏中
      //存在  删除数据
      //不存在  添加到收藏数组

import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
import{ showToast } from "../../utils/asyncWx.js"


Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{},
    isCollected:false
  },

  //全局变量接收商品信息
  goods_info:[],
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    //获取当前小程序的页面栈（数组）长度最大为10
    let  pages = getCurrentPages();
    //数组中索引最大的页面就是当前页面
    let currentPage = pages[pages.length-1]; 
    const {goods_id} = currentPage.options;
    this.getGoodsDetail(goods_id);
  },
  //获取商品详情数据
  async getGoodsDetail(goods_id){
    const result = await request({url:"/goods/detail",data:{goods_id}});
    this.goods_info=result;
    //获取缓存中的商品收藏数组
    let collect = wx.getStorageSync("collect")||[];
    //判断是否被收藏
    let isCollected = collect.some(v=>v.goods_id===this.goods_info.goods_id);
    this.setData({
      goodsObj : {
        goods_name:result.goods_name,
        goods_price:result.goods_price,
        //部分iphone手机不识别webp图片
        //临时自己改成jpg，确保后台存在
        goods_introduce:result.goods_introduce.replace(/\.webp/g,'.jpg'),
        pics:result.pics

      },
      isCollected
    })
  },
  //点击轮播图放大预览
  handlePreviewImage(e){
    const urls = this.goods_info.pics.map(v=>v.pics_mid);
    //接受传递过来的url
    wx.previewImage({
      // current: 'String', // 当前显示图片的链接，不填则默认为 urls 的第一张
      current: e.currentTarget.dataset.url,
      urls: urls,
    })
  },
  //点击加入购物车
  handleCartAdd(){
    let cart=wx.getStorageSync('cart')||[];
    let index=cart.findIndex(v=>v.goods_id === this.goods_info.goods_id)
    if(index===-1){
      //找不到该物品 第一次添加
      this.goods_info.num=1;
      this.goods_info.checked=true;
      cart.push(this.goods_info)
    }else{
      //已经存在 num++
      cart[index].num++;
    }
    //把购物车数据重新存入缓存
    wx.setStorageSync('cart', cart);
    wx.showToast({
      title:'加入成功',
      icon:'success',
      //防止手抖加入过快
      mask:true
    })
  },

  //点击收藏事件
  async handleCollect(){
    let collect = wx.getStorageSync("collect")||[];
    //需要再次声明变量
    let isCollected = false;
    const index = collect.findIndex(v=>v.goods_id===this.goods_info.goods_id);
    if(index!=-1){
      collect.splice(index,1);
      isCollected=false;
      await showToast({title:"取消收藏"})
    }else{
      collect.push(this.goods_info);
      isCollected=true;
      await showToast({title:"收藏成功"})

    }
    this.setData({
      isCollected
    }),
    wx.setStorageSync("collect", collect);
  }

})