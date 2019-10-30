<template lang="pug">
.home(v-loading='state.loading')
  .options
    el-date-picker.date(
      v-model="state.date"
      type="date"
      format="yyyy-MM-dd"
      value-format="yyyyMMdd"
      placeholder="날짜 선택"
      @change="handleDateChange"
    )
  .items(v-if="!state.loading")
    .form(v-for="(point, index) in state.points" :key="index")
      view-point(:point="point")
</template>

<script lang="ts">
import {createComponent, onBeforeMount} from '@vue/composition-api'
import {useGlobalState} from './home.fn'
import ViewPoint from '../components/ViewPoint.vue'
import {useState, IState, useHandleDateChange, useBeforeMount} from './point.fn'
import {IGlobalState, IPoint, ITeacher} from '../biz/type'

export default {
  name: 'v-point',
  components: {ViewPoint},
  setup() {
    const globalState: IGlobalState = useGlobalState()
    const state: IState = useState()
    const handleDateChange = useHandleDateChange({state, globalState})
    onBeforeMount(useBeforeMount({state, globalState}))
    return {
      state,
      globalState,
      handleDateChange,
    }
  },
}
</script>
<style scoped lang="stylus">
.home {
  // margin: 0 10px;
  padding: 5px;
  text-align: left;

  .options {
    .teacher {
      width: 150px;
    }

    .date {
      margin-left: 5px;
      width: 150px;
    }
  }
  .items {
    display: flex;
    flex-wrap: wrap;
    .form {
      flex: 1;
      margin: 5px;
      border: 1px solid #ddd;
      padding: 10px;
      min-width: 150px;
    }    
  }
}
</style>
