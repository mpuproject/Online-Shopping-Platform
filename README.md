# ecommerce

This template should help get you started developing with Vue 3 in Vite.



#### Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).



#### Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).



#### Project Setup

```sh
npm install
```



#### Compile and Hot-Reload for Development

```sh
npm run dev
```



#### Compile and Minify for Production

```sh
npm run build
```



#### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```



# TODO List

Admin Dashboard:

一级分类前端（view/Admin/AdminCategory.vue）：

* [ ] 一级分类编辑浮动对话框，接口
* [ ] 一级分类删除提示，接口
* [ ] 一级分类表格，操作按钮

二级分类前端（view/Admin/AdminSubcategory.vue）：

* [ ] 二级分类编辑浮动对话框，接口
* [ ] 二级分类删除提示，接口
* [ ] 二级分类表格，操作按钮

订单前端（未做页面）：显示==已支付（‘1’）、已发货（‘3’）、已送达（’4‘）、已签收（’5‘）和未退款（‘6’）==的订单

* [ ] 订单表格，预留一列修改订单状态，2条逻辑：'1' - '3' - ‘4’ - ‘5’ 与 ‘6’ - ‘7’；即，当订单状态为1开头时，只能按照1-3-4-5的顺序处理（订单正常处理逻辑）；当订单状态为6时，只能按照6-7处理（退款逻辑）参考淘宝

```django
STATUS_CHOICES = [
        ('0', 'Unpaid'),        #未支付
        ('1', 'Paid'),          #已支付
        ('2', 'Canceled'),      #已取消
        ('3', 'Undelivered'),   #已发货
        ('4', 'Delivered'),     #已送达
        ('5', 'Received'),      #已签收
        ('6', 'Unrefunded'),    #未退款
        ('7', 'Refunded'),      #已退款
        ('8', 'Done'),          #已完成
]
```







User View:

* [ ] 用户评论模块（需要用户购买了该产品，即存在该产品相关订单，以及订单状态='8'-已完成才能评论）
  * [ ] 评论在 `view/Detail/index.vue` 搜索` ‘Comment’ `已预留位置，具体样式参考淘宝
  * [ ] 如果有时间，可以做评论筛选模块，具体参考淘宝
* [ ] 用户地址的增删改查页面
* [ ] 用户历史订单查看
  * [ ] 订单状态为'5'-已签收，需要用户二次确认（订单查看表格的末尾，点击后弹出弹窗再次确认）样式可以参考淘宝，弹窗使用 `ElMessageBox.confirm()`
