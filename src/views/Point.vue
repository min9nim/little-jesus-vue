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
  table-point(v-if="!state.loading" :points="state.points")
</template>

<script lang="ts">
import {createComponent, onBeforeMount} from '@vue/composition-api'
import {useGlobalState} from './home.fn'
import TablePoint from '../components/TablePoint.vue'
import {useState, IState, IComputed, useHandleDateChange, useBeforeMount, useComputed} from './point.fn'
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
      width: 150px;
    }
  }

  .items {
    margin-top: 10px;
    width: 100%;
    border-collapse: collapse;

    .row {
      margin: 5px;
      border: 1px solid #ddd;
      padding: 10px;
    }
    thead{
      background-color: #f9f9f9;
    }    
    tfoot {
      background-color: #f9f9f9;
    }
  }
}

table, th, td {
  border: 1px solid #eee;
}
td{
  padding: 3px;
  text-align: center;
}

</style>
