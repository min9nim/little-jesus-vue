<template lang="pug">
.main(v-loading='state.loading')
  .options
    el-date-picker.year-month(
      v-model="state.yearMonth"
      type="month"
      format="yyyy년 MM월"
      value-format="yyyyMM"
      placeholder="월 선택"
      @change="handleMonthChange"
    )
  .flex-container
    .item(v-for="(date, index) in state.sundays")
      points-by-class(
        date-format="M월 d일"
        :date="date"
        :use-default-point="true"
        :student-name-hidden="false"
        :teacher-name-hidden="false"
        :date-visible="true"
        :overflow-ellipsis="true"
      )
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
import {getSundaysOfMonth} from './points-by-month.fn'
import PointsByClass from '../components/PointsByClass.vue'
import moment from 'moment'
interface IState {
  yearMonth: string
  loading: boolean
  tableData: any[]
  sundays: Ref<string[]>
}
export default {
  name: 'points-by-month',
  components: {PointsByClass},
  setup(props: any, {root}: any) {
    const state: any = reactive({
      yearMonth: moment().format('YYYYMM'),
      loading: false,
      sundays: getSundaysOfMonth(moment().format('YYYYMM'), 'YYYYMMDD'),
    })
    // onMounted(() => handleMonthChange(state.yearMonth))
    // watch(() => root.$store.state.teachers.length, () => handleMonthChange(state.yearMonth))
    return {
      state,
      handleMonthChange: (value: string) => {
        state.sundays = getSundaysOfMonth(value, 'YYYYMMDD')
      },
    }
  },
}
</script>
<style scoped lang="stylus">
.main {
  min-width: 1350px;
}

.options {
  margin-bottom: 10px;
  text-align: left;

  .year-month {
    width: 150px;
  }
}

.flex-container {
  display: flex;

  .item {
  }
}
</style>
