// pages/login/index.js
Page({
  handlGetuserinfo(e){
    //获取用户信息  存入缓存
    const {userInfo} = e.detail;
    wx.setStorageSync("userinfo", userInfo);
    //跳回user页面
    wx.navigateBack({
      delta: 1
    });
  }
})