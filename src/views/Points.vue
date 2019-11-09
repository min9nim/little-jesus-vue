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
  .result(v-for="(points, teacherName) in state.pointsByTeacher")
    el-card
      .title(slot="header")
        h3.teacher {{teacherName || '반미정'}}
        router-link(to="/?edit")
          el-button.btn(size="mini" @click="handleClick(teacherName)") {{points.length ? '수정' : '입력'}}
      table-point(:points="points")
  hr
  .sum
    h2 전체합계
    table-point(:points="state.points" :table-body-hidden="true")
</template>

<script lang="ts">
import {createComponent, onBeforeMount} from '@vue/composition-api'
import {useGlobalState} from './home.fn'
import TablePoint from '../components/TablePoint.vue'
import {
  useState,
  IState,
  IComputed,
  useHandleDateChange,
  useBeforeMount,
  useComputed,
  useHandleClick,
} from './points.fn'
import {IGlobalState, IPoint, ITeacher} from '../biz/type'

export default {
  name: 'v-points',
  components: {TablePoint},
  setup() {
    const globalState: IGlobalState = useGlobalState()
    const state: IState = useState()
    const computed: IComputed = useComputed(state)
    const handleDateChange = useHandleDateChange({state, globalState})
    const handleClick = useHandleClick(globalState)
    onBeforeMount(useBeforeMount({state, globalState}))
    return {
      state,
      computed,
      globalState,
      handleClick,
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
      margin-left: 0;
      width: 140px;
    }
  }

  hr {
    margin-top: 30px;
  }

  .result {
    margin-top: 10px;

    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .teacher {
        margin: 0;
      }

      .btn {
        height: 25px;
        display: inline-block;
        margin-left: 15px;
        width: 45px;
        padding: 7px 3px;
      }
    }
  }
}
</style>
