import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  data: {
    //左右分类数组
    leftMenu:[],
    rightContent:[],
    //被点击的左侧菜单
    currentIndex:0
  },
  //接口的返回数据
  cates:[],

  onLoad: function (options) {
    //先判断本地有没有旧数据
    //没有就发送请求
    //有 没过期就用
    const cates = wx.getStorageSync('cates');
    if(!cates){
      //不存在旧数据  发送请求获取数据
      this.getCateList()
    }else{
      //有旧数据 根据过期时间来判断
      if(Date.now()-cates.time>1000*10){
        //过期了 重新发送请求
        this.getCateList()
      }else{
        //可以使用旧数据
        this.cates=cates.data;
        this.setData({
          leftMenu:this.cates.map(v=>v.cat_name),
          rightContent:this.cates[0].children
        });
      }

    }
  },

  async getCateList(){
    // request({url:'/categories'})
    //   .then(result=>{
    //     // this.setDate({
    //     //   // cateList : result.data.message
    //     // })
    //     this.cates=result.data.message;

    //     //把接口数据存入本地
    //     wx.setStorageSync('cates', {time:Date.now(),data:this.cates});

    //     this.setData({
    //       leftMenu:this.cates.map(v=>v.cat_name),
    //       rightContent:this.cates[0].children
    //     });
    //   })

    //使用es7的async await
    const result = await request({url:'/categories'});
    this.cates=result;

    //把接口数据存入本地
    wx.setStorageSync('cates', {time:Date.now(),data:this.cates});

    this.setData({
      leftMenu:this.cates.map(v=>v.cat_name),
      rightContent:this.cates[0].children
    });

  },

  handleItemTap(e){
    const{index}=e.currentTarget.dataset;
    this.setData({
      currentIndex:index,
      rightContent:this.cates[index].children,
      scroll_top:0
    })
  }
})