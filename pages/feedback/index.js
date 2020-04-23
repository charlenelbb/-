//点击+触发添加图片事件
//调用内置选择图片api
//获取图片路径（数组）
//将图片路径存储到data变量中
//根据图片数据循环渲染
//删除图片
//获取被点击图片索引
//获取data中图片数组
//根据索引 删除数组中的对应元素
//数组重新放入data
//提交内容
//获取文本域内容
//进行合法性验证
//将图片传到 专门的图片服务器  返回外网链接
//遍历图片数组
//挨个上传
//自己再维护图片数组 存放 图片外网链接
//文本 和 图片链接 一起传到服务器
//清空当前页面
//返回上一页
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "体验问题",
        isActive: true
      },
      {
        id: 1,
        value: "商品/商家投诉",
        isActive: false
      },
    ],
    //被选中的图片路径
    chooseImg: [],
    //文本内容
    textVal: ""
  },

  //外网图片链接
  uploadImgs: [],

  //从子组件传递过来的标题点击事件
  handleTabsItemChange(e) {
    //获取被点击的标题索引
    const { index } = e.detail;
    //修改源数组
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    //修改后的tabs放回data
    this.setData({ tabs })
  },

  //+选择图片事件
  handleChooseImg() {
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (result) => {
        //数组拼接 防止重复操作
        this.setData({ chooseImg: [...this.data.chooseImg, ...result.tempFilePaths] })
      },
      fail: () => { },
      complete: () => { }
    });
  },

  //删除图片
  handleDelete(e) {
    const index = e.currentTarget.dataset;
    let { chooseImg } = this.data;
    chooseImg.splice(index, 1);
    this.setData({ chooseImg })
  },

  //输入框内容存入data  data数据不会自动变
  handleTextInput(e) {
    this.setData({ textVal: e.detail.value })
  },

  //提交按钮点击事件
  handleSubmit() {
    //显示等待
    wx.showLoading({
      title: "正在上传中",
      mask: true,
    });

    const { textVal, chooseImg } = this.data;
    if (!textVal.trim()) {
      //不合法 弹窗
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: true
      });
      return;
    };

    //判断是否有图片要上传
    if (chooseImg.length != 0) {
      //遍历图片 依次上传
      chooseImg.forEach((v, i) => {
        wx.uploadFile({
          url: 'https://images.ac.cn/Home/Index/UploadAction/',
          filePath: v,
          name: "file",
          formData: {},
          success: (result) => {
            let url = JASON.parse(result.data).url;
            this.uploadImgs.push(url);

            //所有图片都上传完之后
            if (i === chooseImg.length - 1) {
              wx.hideLoading();
              console.log("把数据提交到后台");
              //重置页面
              this.setData({
                chooseImg: [],
                textVal: ""
              });
              //返回上一页面
              wx.navigateBack({
                delta: 1
              });
            }
          },
        });
      })

    }else(
      wx.hideLoading()
    )

  }
})