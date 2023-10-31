<template>
  <div class="home-container">
    <!-- <div class="home-text">username: {{ username }}</div>
    <div class="home-text">userid: {{ userid }}</div>
    <div class="home-text">nickname: {{ nickname }}</div>
    <div class="home-text">departmentid: {{ departmentid }}</div> -->
    <img src="@/assets/home.jpg" class="img"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Home',
  computed: {
    ...mapGetters([
      'username',
      'userid',
      'nickname',
      'departmentid'
    ])
  }
}
</script>

<style lang="scss" scoped>
.home {
  &-container {
    margin: 30px;
    &:before {
      position: fixed;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      content: "";
      //background-image: url(~@/assets/home.jpg);
      //background-size:contain
    }
    .img{
      margin:150px 350px 100px 350px;
    }
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
