// pages/goods_list/index.js
//1.用户上划页面 滚动条触底 开始加载下一页数据
  //找到滚动条触底事件
  //判断有没有下一页数据
        //获取总页码
        //总页数=Math.ceil(总条数 / 页容量 pagesize)
        //和当前页码比较 pagenum
  //如果没有下一页，弹出提示
  //有下一页，加载下一页数据
      //当前页码++
      //重新发送请求
      //数据请求回来  要对data数组进行拼接  不是全部替换

//2.下拉刷新页面
    //触发下拉刷新事件
        //找到下拉触发刷新的事件
    //重置数据数组
    //重置页码 设置为1
    //重新发送请求
    //数据请求完成后 手动关闭等待效果

import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"综合",
        isActive:true
      },
      {
        id:1,
        value:"销量",
        isActive:false
      },
      {
        id:2,
        value:"价格",
        isActive:false
      },
    ],
    goodsList:[]
  },

  //商品列表接口要的参数
  QueryParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10
  },

  totalPages:1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid=options.cid||"";
    this.QueryParams.query=options.query||""; 
    this.getGoodsList()
  },

  //获取商品列表数据
  async getGoodsList(){
    const result = await request({url:'/goods/search',data:this.QueryParams});
    console.log(result);
    //获取总条数
    const total = result.total;
    //计算总页数
    this.totalPages=Math.ceil(total / this.QueryParams.pagesize);
    this.setData({
      //拼接数组
      goodsList:[...this.data.goodsList,...result.goods]
    })

    //关闭下拉刷新窗口 如果没有调用直接关闭也不会报错
    wx.stopPullDownRefresh();
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
  //下拉触底事件
  onReachBottom(){
    if(this.QueryParams.pagenum>=this.totalPages){
      //没有下一页数据
      //console.log("已经是最底了");
      wx.showToast({
        title: '没有下一页数据了'});
    }else{
      //还有下一页
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },
  //下拉刷新事件
  onPullDownRefresh(){
    //1 重置数组
    this.setData({
      goodsList:[]
    });
    //2 重置页码
    this.QueryParams.pagenum=1;
    //3 发送请求
    this.getGoodsList()

  }

})