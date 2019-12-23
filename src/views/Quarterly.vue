<template lang="pug">
.monthly(v-loading='state.loading')
  .options
    el-date-picker.year(
      v-model="state.year"
      type="year"
      format="yyyy 년"
      value-format="yyyy"
      placeholder="년 선택"
      @change="handleYearChange"
    )
    el-select.quarter(v-model="state.quarter" placeholder="분기선택" @change="handleQuarterChange")
      el-option(
        v-for="item in state.quarterOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      )
  el-table.table(
    v-if="state.year && state.quarter"
    :data="state.tableData"
    :default-sort = "{prop: 'totalSum', order: 'descending'}"
    size="mini"
    :border="false"
  )
    el-table-column(prop="name" label="학생" sortable min-width="40")
    el-table-column(prop="teacher" label="선생님" sortable min-width="50")
    el-table-column(
      v-for='(month, index) in state.months'
      :key="index"
      :prop="'month' + (index+1)"
      :label="month + '월'"
      :resizable="true"
      min-width="30"
    )
    el-table-column(prop="totalSum" label="합계" sortable min-width="40")
</template>

<script lang="ts">
import {
  createComponent,
  onBeforeMount,
  reactive,
  computed,
  Ref,
  onMounted,
} from '@vue/composition-api'
import {useHandleQuarterChange, getMonthsOfQuarter, quarterOptions} from './quarterly.fn'
import moment from 'moment'
interface IState {
  yearMonth: string
  loading: boolean
  tableData: any[]
  sundays: Ref<string[]>
}
import {errorHandler} from '../utils'
export default {
  name: 'v-monthly',
  setup(props: any, {root}: any) {
    const state: any = reactive({
      year: moment().format('YYYY'),
      quarter: Math.ceil(new Date().getMonth() / 3),
      loading: false,
      quarterOptions,
      tableData: [],
      months: computed(() => getMonthsOfQuarter(state.quarter)),
    })
    const handleQuarterChange = useHandleQuarterChange({state})
    onMounted(() => handleQuarterChange(state.quarter).catch(errorHandler))
    return {
      state,
      handleQuarterChange,
      handleYearChange(value: string) {
        state.year = value
        state.quarter = null
      },
    }
  },
}
</script>
<style scoped lang="stylus">
.options {
  margin-bottom: 10px;
  text-align: left;

  .year {
    width: 120px;
    margin-right: 10px;
  }

  .quarter {
    width: 100px;
  }
}
</style>
