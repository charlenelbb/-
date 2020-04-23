import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    collect:[],
    tabs:[
      {
        id:0,
        value:"商品收藏",
        isActive:true
      },
      {
        id:1,
        value:"品牌收藏",
        isActive:false
      },
      {
        id:2,
        value:"店铺收藏",
        isActive:false
      },
      {
        id:3,
        value:"浏览足迹",
        isActive:false
      },

    ],

  },

  onShow(){
    const collect=wx.getStorageSync("collect")||[];
    this.setData({collect})
  },

  //从子组件传递过来的标题点击事件
  handleTabsItemChange(e){
    //获取被点击的标题索引
    const {index} = e.detail;
    //修改源数组
    let {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    //修改后的tabs放回data
    this.setData({tabs})   
  },
  
})