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
  template(v-if="!state.loading")
    .form(v-for="(point, index) in state.points" :key="index")
      read-point(:point="point")
</template>

<script lang="ts">
import {createComponent, onBeforeMount} from '@vue/composition-api'
import {useGlobalState} from './home.fn'
import ReadPoint from '../components/ReadPoint.vue'
import {useState, IState, useHandleDateChange, useBeforeMount} from './point.fn'
import {IGlobalState, IPoint, ITeacher} from '../biz/type'

export default {
  name: 'v-point',
  components: {ReadPoint},
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

  .form {
    margin: 5px 0;
    border: 1px solid #ddd;
    padding: 10px;
  }

  .btn {
    margin-top: 10px;
  }
}
</style>
