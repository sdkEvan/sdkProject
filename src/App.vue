<template>
    <div id="app">
        <transition name="slide-fade" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>

export default {
    name: 'app'
}
</script>

<style>
#app {
    height: 100%;
    font-family: Microsoft YaHei;
}
.el-button{
    font-family: Microsoft YaHei;
}
</style>
