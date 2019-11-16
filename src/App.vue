<template lang="pug">
#app
  #nav
    el-tabs(v-model="state.activeName" @tab-click="handleClick")
      el-tab-pane(label="출석체크" name="/")
      el-tab-pane(label="포인트현황" name="/points")
  router-view  
</template>
<script lang="ts">
import {reactive} from '@vue/composition-api'

export default {
  setup(props, {root}) {
    const state = reactive({
      activeName: '/',
    })
    return {
      state,
      handleClick(tab: any, event: any) {
        console.log(tab, event)
        root.$router.push(tab.name)
      },
    }
  },
}
</script>
<style lang="stylus" scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
<style lang="stylus" >
#nav {
  text-align: center;

  a {
    margin: 0 5px;
    font-weight: bold;
    color: #2c3e50;
  }

  a.router-link-exact-active {
    color: #42b983;
  }

  .el-tabs__item {
    padding: 0 10px;
    height: 35px;
  }
}

.home {
  .form {
    .item {
      .el-radio__label {
        font-size: 14px;
      }
    }
  }
}

#app {
  .el-card {
    // border: 5px solid #f1f1f1;
    .el-card__header {
      padding: 10px 10px;
      background-color: #f9f9f9;
    }

    .el-card__body {
      padding: 10px 10px;
    }
  }

  .el-input--prefix .el-input__inner {
    cursor: pointer;
  }
}
</style>
