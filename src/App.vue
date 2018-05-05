<template>
  <div id="app">
    <transition name="fade" mode="out-in">
        <router-view></router-view>
    </transition>
  </div>
</template>

<style>
*{margin:0;padding:0;}
html,body,#app,.wrapper{
    width:100%;
    height:100%;
    overflow: hidden;
}
body{
    font-family:"Helvetica Neue",Helvetica, "microsoft yahei", arial, STHeiTi, sans-serif;
}
a{text-decoration: none}

.page-boxtitle{
  margin-bottom: 20px;
}

.el-breadcrumb{
  float: right;
}

.query-box {
    background: #f2f2f2;
    padding: 10px;
    margin: 10px 0px;
}


.fade-enter-active,
.fade-leave-active {
  transition: all .2s ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
.el-dialog__header{
  padding: 0;
  padding-left: 10px;
}
.el-dialog__title{
  line-height: 20px;
}
.header .el-dialog__header{
        height: 32px; line-height: 52px;
    }
</style>