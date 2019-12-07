<template lang="pug">
.monthly(v-loading='state.loading')
  .options
    el-date-picker.date(
      v-model="state.yearMonth"
      type="month"
      format="yyyy-MM"
      value-format="yyyyMM"
      placeholder="월 선택"
      @change="handleMonthChange"
    )
  el-table(
    v-if="state.yearMonth"
    :data="state.tableData"
    :default-sort = "{prop: 'name', order: 'ascending'}"
    style="width: 100%"
  )
    el-table-column(prop="name" label="이름" sortable)
    el-table-column(
      v-for='(date, index) in state.sundays'
      :key="index"
      :prop="'week' + (index+1)"
      :label="date"
      sortable
    )
    el-table-column(prop="totalSum" label="합계" sortable)
</template>

<script lang="ts">
import {createComponent, onBeforeMount, reactive, computed, Ref} from '@vue/composition-api'
import {useHandleMonthChange, getSundaysOfMonth} from './monthly.fn'
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
      yearMonth: '',
      loading: false,
      tableData: [],
      sundays: computed(() => getSundaysOfMonth(state.yearMonth)),
    })
    const handleMonthChange = useHandleMonthChange({root, state})
    return {
      state,
      handleMonthChange,
    }
  },
}
</script>
<style scoped lang="stylus"></style>
