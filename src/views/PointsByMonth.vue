<template lang="pug">
.home 준비 중
</template>

<script lang="ts">
import {createComponent, onBeforeMount, watch} from '@vue/composition-api'
import {usePublicState as useHomeState} from './home.fn'
import TablePoint from '../components/TablePoint.vue'
import {useState, IState, useHandleDateChange, useBeforeMount, useHandleClick} from './points.fn'
import {IPublicState as IHomeState, IPoint, ITeacher} from '../biz/type'
import {propEq, omit} from 'ramda'

export default {
  name: 'v-points',
  components: {TablePoint},
  methods: {omit, propEq},
  setup(props: any, {root}: any) {
    const homeState: IHomeState = useHomeState()
    const state: IState = useState(root)
    const handleDateChange = useHandleDateChange({root, state})
    const handleClick = useHandleClick(root, homeState)
    // onBeforeMount(useBeforeMount({root, state}))
    watch(() => root.$store.state.teachers.length, useBeforeMount({root, state}))
    return {
      state,
      homeState,
      handleClick,
      handleDateChange,
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

      .teacher {
        margin: 0;
      }

      .btn {
        height: 25px;
        display: inline-block;
        margin-left: 15px;
        padding: 7px 7px;
      }
    }
  }
}
</style>
