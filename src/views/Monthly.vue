<template lang="pug">
.monthly(v-loading='state.loading')
  .options
    el-date-picker.year-month(
      v-model="state.yearMonth"
      type="month"
      format="yyyy년 MM월"
      value-format="yyyyMM"
      placeholder="월 선택"
      :clearable="false"
      @change="handleMonthChange"
    )
  el-table.table(
    v-if="state.yearMonth"
    :data="state.tableData"
    :default-sort = "{prop: 'totalSum', order: 'descending'}"
    size="mini"
    :border="false"
  )
    el-table-column(prop="name" label="학생" sortable min-width="70")
    el-table-column(prop="teacher" label="선생님" sortable min-width="80")
    el-table-column(
      v-for='(date, index) in state.sundays'
      :key="index"
      :prop="'week' + (index+1)"
      :label="date"
      :resizable="true"
      min-width="35"
    )
    el-table-column(prop="totalSum" label="합계" sortable min-width="70")
</template>

<script lang="ts">
import {
  createComponent,
  onBeforeMount,
  reactive,
  computed,
  Ref,
  onMounted,
  watch,
} from '@vue/composition-api'
import {useHandleMonthChange, getSundaysOfMonth} from './monthly.fn'
import moment from 'moment'
interface IState {
  yearMonth: string
  loading: boolean
  tableData: any[]
  sundays: Ref<string[]>
}
export default {
  name: 'v-monthly',
  setup(props: any, {root}: any) {
    const state: any = reactive({
      yearMonth: moment().format('YYYYMM'),
      loading: true,
      tableData: [],
      sundays: computed(() => getSundaysOfMonth(state.yearMonth, 'DD')),
    })
    const handleMonthChange = useHandleMonthChange({state, root})
    // onMounted(() => handleMonthChange(state.yearMonth))
    watch(() => root.$store.state.teachers.length, () => handleMonthChange(state.yearMonth))
    return {
      state,
      handleMonthChange,
    }
  },
}
</script>
<style scoped lang="stylus">
.options {
  margin-bottom: 10px;
  text-align: left;

  .year-month {
    width: 150px;
  }
}
</style>
