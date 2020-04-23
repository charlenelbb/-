// pages/cart/index.js
//1.获取用户收货地址
//1绑定点击事件
//2调用小程序内置api 获取收货地址
//2获取用户对小程序所授予获取地址的权限状态 scope
  //假设用户在“点击获取收货地址”的提示框 点击确定 authSetting scope.address
    //  scope = true  可以直接调用地址
  //假设用户在“点击获取收货地址”的提示框 点击取消
    //  scope = false  诱导用户自己打开授权设置界面
  //假设用户从来没有调用过收货地址api
    //  scope = undefined  直接调用
  //把获取到的地址存入本地存储
//2.页面加载完毕
    //获取本地存储的地址
    //把数据设置给data中的变量
//3.onShow
    //回到商品详情页js  第一次添加商品 手动添加checked属性 num=1 checked=true
    //获取购物车数据
    //将数据填入页面
//4.全选的实现
    //onShow 获取缓存中的购物车数据
    //根据购物车数据 所有商品被选中 checked = true 全选框被选中
//5.总价格 总数量
    //前提；商品被选中
    //获取购物车数据 遍历
    //总量 += 选中商品数量
    //总价 += 选中商品数量 * 单价
//6.商品选中功能
    //绑定change事件
    //获取到被修改的商品对象
    //checked取反
    //重新填充回data和缓存
    //重新计算全选  总价  总数
//7.全选和全不选
  //全选框绑定change事件
  //获取data中的 allchecked 取反
  //遍历购物车 让里面商品checked随allchecked改变
  //购物车数据放回data和缓存  allchecked放回data
//8.商品数量编辑
    //+-按钮绑定同一个点击事件  根据自定义属性区分
    //传递被点击的商品id  goods_id  获取index
    //修改num
        //点击-  当num==1 弹窗询问是否删除
        //确定   删除
        //取消   什么都不做
    //setcart
//9.支付功能
    //绑定点击事件
    //判断 地址&&商品勾选
        //有一项不符合 分别弹窗提示
        //符合 跳转到支付页面
import{ getSetting,chooseAddress,openSetting,showModal,showToast } from "../../utils/asyncWx.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data:{
    address:{},
    cart:[],
    allChecked:false,
    totalNum:0,
    totalPrice:0
  },
  onShow(){
    //获取缓存中的收货地址
      const address = wx.getStorageSync("address");
    //获取缓存中的购物车数据
      const cart = wx.getStorageSync('cart')||[];
    //计算全选
    //every 数组方法会遍历接收一个回调函数 如果每个回调函数都返回true 那么返回true
                                    //如果有一个false，终止循环，返回false
                                    //空数组返回true
/*       const allChecked = cart.length?cart.every(v=>v.checked):false;
 */   
    this.setData({
      address
    });
    this.setCart(cart);
  },
    async handleChooseAddress() {
      try {
      //获取权限状态
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      //判断权限状态
      if(scopeAddress===false){
        //先诱导用户打开授权页面
        await openSetting();
      }
      //调用获取地址的api
      let address = await chooseAddress();
      address.all = address.provinceName+address.cityName+address.countyName+address.detailInfo;
      //地址存入本地缓存
      wx.setStorageSync('address', address)
  
      } catch (error) {
        console.log(error);
    
      }
    },
    
    //商品选中事件
    handleItemChange(e){
      //获取被修改的商品id
      const goods_id = e.currentTarget.dataset.id;
      //获取购物车数组 找到商品索引
      let {cart} = this.data;
      let index = cart.findIndex(v=>v.goods_id===goods_id);
      //选中状态取反
      cart[index].checked = !cart[index].checked;
      this.setCart(cart);
    },

    //(封装函数)更新购物车状态时 重新计算全选 总价 总数
    setCart(cart){
      wx.setStorageSync('cart', cart);
      let allChecked = true;
      let totalNum = 0;
      let totalPrice = 0;
      cart.forEach(v=>{
        if(v.checked){
          totalPrice += v.num * v.goods_price;
          totalNum += v.num;
        }else{
          //合并两组循环 节约性能
          allChecked=false;
        }
      })
      //判断cart是否为空
      allChecked = cart.length?allChecked:false;
    //给data赋值
      this.setData({
        cart,
        allChecked,
        totalNum,
        totalPrice
      })

    },

    //全选和全不选
    handleItemAllChecked(){
      //获取data中的 allchecked cart 取反
      let {cart,allChecked} = this.data;
      allChecked = !allChecked;
      //循环购物车  更改checked
      cart.forEach(v=>v.checked=allChecked);
      //cart放回data和缓存
      this.setCart(cart);
    },

    //商品数量加减
    async handleItemNumEdit(e){
      //获取传递的参数
      const {id,operation} = e.currentTarget.dataset;
      //获取cart 找到index
      let {cart}=this.data;
      const index=cart.findIndex(v=>v.goods_id===id);
      //判断是否执行删除
      if(cart[index].num===1&&operation===-1){
        //弹窗提示
        const result=await showModal({content:'您是否要删除改商品'});
        if(result.confirm){
          cart.splice(index,1);
          this.setCart(cart);
        };
      }else{
        //修改num
        cart[index].num += operation;
        //setcart
        this.setCart(cart);
      }
    },

    //结算
    async handlePay(){
      //判断收货地址
      const {address,totalNum} = this.data;
      if(!address.userName){
        //没有地址 弹出提示
        await showToast({title:'您还没有选择收货地址'});
        return;
      }
      //判断有没有选购商品
      if(totalNum==0){
        //没有选中商品 弹出提示
        await showToast({title:'您还没有选择商品'});
        return;
      }
      //跳转到支付页面
      wx.navigateTo({
        url: '/pages/pay/index',
      });

    }

})