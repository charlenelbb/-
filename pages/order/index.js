//1.页面加载出来的时候 onshow
    //获取url上的参数type  (不能直接通过options形参数获取，需要从页面栈)
    //判断页面中有没有token   没有 直接跳到授权页面
    //根据type决定tabbar哪个被选中
    //根据type发送请求获取订单数据
    //渲染页面
//2.点击不同标题 重新加载 渲染

import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';


Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders:[],
    tabs:[
      {
        id:0,
        value:"全部",
        isActive:true
      },
      {
        id:1,
        value:"待付款",
        isActive:false
      },
      {
        id:2,
        value:"待发货",
        isActive:false
      },
      {
        id:3,
        value:"退款/退货",
        isActive:false
      },

    ],

  },

  onShow(){
    //判断缓存有无token
    const token = wx.getStorageSync("token");
    if(!token){
      //没有token 跳到授权页
      wx.navigateTo({
        url: '/pages/auth/index',
      });
      //跳回当前页面
      return;
    }
    //获取当前小程序的页面栈（数组）长度最大为10
    let  pages = getCurrentPages();
    //数组中索引最大的页面就是当前页面
    let currentPage = pages[pages.length-1]; 
    //从当前页面获取type参数
    const {type} = currentPage.options;
    //激活选中标题
    this.changeTitleByIndex(type-1);
    this.getOrders(type);   
  },

  //获取订单列表的方法
  async getOrders(type){
    const res=await request({url:"/my/orders/all",data:{type}});
    this.setData({
      //遍历 时间戳转换为可读时间
      orders:res.orders.map(v=>({...v, create_time_cn:(new Date(v.create_time*1000).toLocaleString())}))
    })
  },

  //根据索引激活tab拦标签
  changeTitleByIndex(index){
    //修改源数组
    let {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    //修改后的tabs放回data
    this.setData({tabs})   
  },

  //从子组件传递过来的标题点击事件
  handleTabsItemChange(e){
    //获取被点击的标题索引
    const {index} = e.detail;
    this.changeTitleByIndex(index);
    //重新发送请求
    this.getOrders(index+1)
  },
  
})