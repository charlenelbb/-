//绑定input事件
    //获取输入框的值
    //合法性判断
    //通过后把值发送到后台
    //返回的数据打印到页面
//防抖(防止重复发送请求) 定时器
    //定义一个全局定时器

import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
    
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods:[],
    isFocus:false,
    inputValue:""
  },
  Timeid:0,

  //搜索框事件(输入值改变就触发)
  handleInput(e){
    //获取输入的值
    const {value} = e.detail;
    //判断合法性
    if(!value.trim()){
      //值不合法
      return;
    }
    this.setData({isFocus:true})
    clearTimeout(this.Timeid);
    this.Timeid=setTimeout(()=>{
      //1秒后发送请求获取数据
      this.qsearch(value);
    },1000);
    
  },

  //获取搜索数据
  async qsearch(query){
    const res=await request({url:"/goods/qsearch",data:{query}});
    console.log(res);
    this.setData({goods:res})
  },

  //取消搜索按钮
  handleCancel(){
    this.setData({
      inputValue:"",
      isFocus:false,
      goods:[],
    })
  }
})