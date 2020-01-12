<template lang="pug">
.monthly(v-loading='state.loading')
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
    .item(v-for="date in state.sundays")  
      points-by-class(:date="date" :use-default-point="true")
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
      loading: true,
      tableData: [],
      sundays: computed(() => getSundaysOfMonth(state.yearMonth, 'YYYYMMDD')),
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

.flex-container {
  display: flex;

  .item {
  }
}
</style>
