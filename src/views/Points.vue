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
  .result(v-for="(points, teacherName) in omit(['반미정'], state.pointsByTeacher)")
    el-card(shadow="hover")
      .title(slot="header")
        h3.teacher {{teacherName}}
        router-link(to="/?edit")
          el-button.btn(size="mini" @click="handleClick(teacherName)") {{points.length ? '수정' : '입력'}}
      table-point(:points="points")
  .result(v-if="state.pointsByTeacher && state.etcStudents.length > 0")
    el-card(shadow="hover")
      .title(slot="header")
        h3.teacher 반미정
        router-link(to="/?edit")
          el-button.btn(size="mini" @click="handleClick('반미정')") {{state.pointsByTeacher['반미정'].length ? '수정' : '입력'}}
      table-point(:points="state.pointsByTeacher['반미정']")      
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
  useHandleClick,
} from './points.fn'
import {IGlobalState, IPoint, ITeacher} from '../biz/type'
import {propEq, omit} from 'ramda'

export default {
  name: 'v-points',
  components: {TablePoint},
  methods: {omit, propEq},
  setup() {
    const globalState: IGlobalState = useGlobalState()
    const state: IState = useState(globalState)
    const handleDateChange = useHandleDateChange({state, globalState})
    const handleClick = useHandleClick(globalState)
    onBeforeMount(useBeforeMount({state, globalState}))
    return {
      state,
      globalState,
      handleClick,
      handleDateChange,
      teacherVisible(teacherName: string) {
        const teacher: any = globalState.teachers.find(propEq('name', '반미정'))
        return teacherName !== '반미정' || teacher.students.length > 0
      },
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
