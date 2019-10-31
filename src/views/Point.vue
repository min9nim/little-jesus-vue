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
    .title
      h3.teacher {{teacherName}}
      el-button.btn(size="mini") {{points.length ? '수정' : '입력'}}
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
} from './point.fn'
import {IGlobalState, IPoint, ITeacher} from '../biz/type'

export default {
  name: 'v-point',
  components: {TablePoint},
  setup() {
    const globalState: IGlobalState = useGlobalState()
    const state: IState = useState()
    const computed: IComputed = useComputed(state)
    const handleDateChange = useHandleDateChange({state, globalState})
    onBeforeMount(useBeforeMount({state, globalState}))
    return {
      state,
      computed,
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
      width: 140px;
    }
  }

  hr {
    margin-top: 30px;
  }

  .result {
    margin-top: 40px;
    .title {
      display flex
      align-items : center;
      justify-content: space-between;
      .teacher {
        margin: 0;
      }

      .btn {
        height 25px
        display: inline-block;
        margin-left: 15px;
      }
    }
  }
}
</style>
