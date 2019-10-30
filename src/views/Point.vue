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
  .section 출석현황
    table.items(v-if="!state.loading")
      thead
        tr.row
          td.name 이름
          td.attendance 출석
          td.visitcall 심방
          td.meditation 묵상
          td.recitation 암송
          td.invitation 전도
          td.invitation 기타
      tbody
        tr.row(v-for="(point, index) in state.points" :key="index")
          td.name {{point.owner.name}}
          td.attendance {{point.attendance ? 1 : 0}}
          td.visitcall {{point.visitcall ? 1 : 0}}
          td.meditation {{point.meditation}}
          td.recitation {{point.recitation ? 1 : 0}}
          td.invitation {{point.invitation}}
          td.invitation {{point.etc}}
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
    width: 100%;
    border-collapse: collapse;

    .row {
      margin: 5px;
      border: 1px solid #ddd;
      padding: 10px;
    }
  }
}

table, th, td {
  border: 1px solid #eee;
}
td{
  padding: 3px;
}
</style>
