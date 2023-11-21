<template>
    <div>
        <van-tabbar v-model="active">
            <van-tabbar-item icon="checked">绑定</van-tabbar-item>
            <van-tabbar-item icon="clear">解绑</van-tabbar-item>
            <van-tabbar-item icon="search">查询</van-tabbar-item>
        </van-tabbar>
        <van-button @click="show"></van-button>
    </div>
</template>

<script>
export default {
    name: 'actionWipStorage',
    data() {
        return {
            active: 0
        }
    },
    methods: {
        show() {
            // 显示弹窗
            console.log(this.active);

    }}
}
</script>

<style lang="scss" scoped></style>