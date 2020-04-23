
import { login } from "../../utils/asyncWx.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
import { request } from "../../request/index.js";


Page({
  //获取用户信息
  async handleGetUserInfo(e) {
    try {
      //获取用户信息
      const { encryptedData, rawData, iv, signature } = e.detail;
      //获取小程序登录成功后的code
      const { code } = await login();
      const loginParams = { encryptedData, rawData, iv, signature };
      //发送请求获取token    
      const res = await request({ url: "/users/wxlogin", data: loginParams, method: "post" });
      //把token存入缓存  跳转回上一页面
      wx.setStorageSync("token", token);
      wx.navigateBack({
        delta: 1
      });

    } catch (error) {
      console.log(error);
      
    }
  }
})