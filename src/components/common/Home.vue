<template>
    <div class="wrapper">
        <hw-header></hw-header>
        <hw-sider></hw-sider>
        <div class="content" :style="$store.state.left">
            <transition name="fade" mode="out-in">
                <router-view></router-view>
            </transition>
        </div>
    </div>
</template>

<script>
import Header from './Header'
import Sider from './Sider'

export default {
  components: {
    hwHeader: Header,
    hwSider: Sider
  }
}
</script>

<style scoped>
.content{
    background: none repeat scroll 0 0 #fff;
    position: absolute;
    left: 200px;
    right: 0;
    top: 70px;
    bottom:0;
    width: auto;
    padding:20px;
    box-sizing: border-box;
    overflow-y: scroll;
}
</style>