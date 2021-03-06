<template lang="pug">
.home(v-loading='state.loading')
  .options
    el-date-picker.date(
      v-model="state.date"
      type="date"
      :format="dateFormat"
      value-format="yyyyMMdd"
      placeholder="날짜 선택"
      :clearable="false"
      @change="handleDateChange"
      :readonly="Boolean(date)"
    )
  .pointsByTeacher(v-if="!state.loading")
    .result(v-for="(points, teacherName) in omit(['반미정'], state.pointsByTeacher)")
      el-card(shadow="hover")
        .title(slot="header")
          h3.teacher {{teacherNameHidden ? '' : teacherName}}
          .date(v-show="dateVisible") - {{state.dateFormatted}} -
          router-link(to="/?edit")
            el-button.btn(
              size="mini"
              icon="el-icon-edit"
              @click="handleClick(teacherName)"
            ) {{points.length ? '수정' : '입력'}}
        table-point(
          :overflow-ellipsis="overflowEllipsis"
          :student-name-hidden="studentNameHidden"
          :points="points"
          :teacher-name="teacherName"
        )
    .result(v-if="state.pointsByTeacher && state.etcStudents.length > 0")
      el-card(shadow="hover")
        .title(slot="header")
          h3.teacher {{teacherNameHidden ? '' : '반미정'}}
          .date(v-show="dateVisible") - {{state.dateFormatted}} -
          router-link(to="/?edit")
            el-button.btn(
              size="mini"
              icon="el-icon-edit"
              @click="handleClick('반미정')"
            ) {{state.pointsByTeacher['반미정'].length ? '수정' : '입력'}}
        table-point(
          :overflow-ellipsis="overflowEllipsis"
          :student-name-hidden="studentNameHidden"
          :points="state.pointsByTeacher['반미정']"
          teacher-name="반미정"
        )
  hr
  .sum
    .title
      h2 {{teacherNameHidden ? ' ' : '전체합계'}}
      .date(v-show="dateVisible") - {{state.dateFormatted}} -
    table-point(:points="state.points" :table-body-hidden="true")
</template>

<script lang="ts">
import {createComponent, onBeforeMount, watch} from '@vue/composition-api'
import {usePublicState as useHomeState} from '../views/home.fn'
import TablePoint from './TablePoint.vue'
import {
  useState,
  IState,
  useHandleDateChange,
  useBeforeMount,
  useHandleClick,
} from './points-by-class.fn'
import {IPublicState as IHomeState, IPoint, ITeacher} from '../biz/type'
import {propEq, omit} from 'ramda'
import createLogger from 'if-logger'

export default {
  name: 'points-by-class',
  props: [
    'date',
    'useDefaultPoint',
    'teacherNameHidden',
    'studentNameHidden',
    'dateVisible',
    'overflowEllipsis',
    'dateFormat',
  ],
  components: {TablePoint},
  methods: {omit, propEq},
  setup(props: any, {root}: any) {
    const l = createLogger().addTags('PointsByClass.vue')
    const homeState: IHomeState = useHomeState()
    const state: IState = useState({props, root})
    const handleDateChange = useHandleDateChange({props, root, state})
    const handleClick = useHandleClick(root, state, homeState)
    // onBeforeMount(useBeforeMount({root, state}))
    watch(() => root.$store.state.teachers.length, useBeforeMount({props, root, state}))
    watch(
      () => props.date,
      () => {
        if (!props.date) {
          l.info('watch return', props.date)
          return
        }
        state.date = props.date
        handleDateChange(props.date)
      },
    )
    return {
      state,
      homeState,
      handleClick,
      handleDateChange: value => {
        l.debug('사용자가 날짜 선택')
        // 사용자가 직접 날짜를 선택한 경우에만 vuex 상태를 변경한다 -20.02.07 mgsong
        state.oldDate = state.date
        root.$store.commit('setDate', value)
        handleDateChange(value)
      },
      teacherVisible(teacherName: string) {
        const teacher: any = root.$store.state.teachers.find(propEq('name', '반미정'))
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
      height: 20px;

      .teacher {
        margin: 0;
        flex: 1;
      }

      .date {
        font-size: 12px;
        padding-top: 2px;
      }

      .btn {
        height: 25px;
        display: inline-block;
        margin-left: 15px;
        padding: 7px 7px;
      }
    }
  }

  .sum {
    .title {
      display: flex;
      align-items: center;

      h2 {
        flex: 1;
        height: 30px;
        margin: 2px 0 7px 5px;
      }

      .date {
        font-size: 12px;
        padding-top: 2px;
        margin-right: 5px;
      }
    }
  }
}
</style>
