//引入用来发送请求的方法 一定要把方法补全
import { request } from "../../request/index.js";
Page({
  data: {
    // 轮播图数组
    swiperList: [],
    //导航数组
    cateList: [],
    //楼层数组
    floorList: []
  },
  //options(Object)
  onLoad: function (options) {
    // //开始发送异步请求获取轮播图数据  优化的手段可以通过promise
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata', 
    //   success: (result) => {
    //     console.log(result);
    //      this.setData({
    //        swiperList:result.data.message
    //      })
    //   },
    // });
    this.getSwiperlist();
    this.getCatelist();
    this.getFloorlist()
  },

  //获取轮播图数据
  getSwiperlist() {
    request({url: '/home/swiperdata'})
        .then(result => {
          this.setData({
            swiperList: result
          })
    })
  },
  //获取轮播图数据
  getCatelist() {
    request({url: '/home/catitems'})
        .then(result => {
          this.setData({
            cateList: result
          })
    })
  },
  getFloorlist() {
    request({url: '/home/floordata'})
        .then(result => {
          this.setData({
            floorList: result
          })
    })
  },


});
