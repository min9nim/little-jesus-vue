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
