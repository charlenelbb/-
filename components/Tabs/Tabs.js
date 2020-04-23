// components/Tabs/Tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs:{
      type:Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentindex:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleItemTap(e){
      //获取点击的索引
      const {index} = e.currentTarget.dataset;
      //出发父组件重的事件  自定义事件
      this.triggerEvent("tabsItemChange", {index})
    }
  }
})
