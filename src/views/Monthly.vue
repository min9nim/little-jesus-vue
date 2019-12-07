<template lang="pug">
.monthly(v-loading='state.loading')
  .options
    el-date-picker.date(
      v-model="state.date"
      type="month"
      format="yyyy-MM"
      value-format="yyyyMMdd"
      placeholder="월 선택"
      @change="handleMonthChange"
    )
  el-table(:data="state.tableData" style="width: 100%")
    el-table-column(prop="name" label="이름")
    el-table-column(prop="week1" label="11/3")
    el-table-column(prop="week2" label="11/10")
    el-table-column(prop="week3" label="11/17")
    el-table-column(prop="week4" label="11/24")

</template>

<script lang="ts">
import {createComponent, onBeforeMount, reactive} from '@vue/composition-api'
import {useHandleMonthChange} from './monthly.fn'

export default {
  name: 'v-monthly',
  setup(props: any, {root}: any) {
    const state = reactive({
      date: '',
      loading: false,
      tableData: [
        {
          name: '송하연',
          week1: 10,
          week2: 20,
          week3: 30,
          week4: 40,
        },
        {
          name: '송하니',
          week1: 10,
          week2: 20,
          week3: 30,
          week4: 40,
        },
        {
          name: '우아름',
          week1: 10,
          week2: 20,
          week3: 30,
          week4: 40,
        },
        {
          name: '우미소',
          week1: 10,
          week2: 20,
          week3: 30,
          week4: 40,
        },
      ],
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
