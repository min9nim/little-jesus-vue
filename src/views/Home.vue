<template lang="pug">
.home(v-loading='state.loading')
  .options
    el-select.teacher(
      v-model="globalState.teacherId"
      placeholder="선생님 선택"
      @change="handleTeacherChange"
    )
      el-option(
        v-for="item in globalState.teachers"
        :key="item._id"
        :label="item.name"
        :value="item._id"
      )
    el-date-picker.date(
      v-model="state.date"
      type="date"
      format="yyyy-MM-dd"
      value-format="yyyyMMdd"
      placeholder="날짜 선택"
      @change="handleDateChange"
    )
  template(v-if="!state.loading")
    .form(v-for="(point, index) in globalState.points" :key="index")
      read-point(v-if="!state.editable" :point="point")
      edit-point(v-else :studentId="point.owner._id")
    .btn(v-show="globalState.points.length > 0")
      template(v-if="state.editable")
        el-button(@click="handleSave") 저장
        el-button(@click="handleCancel") 취소
      el-button(v-else @click="handleEdit") 수정
</template>

<script lang="ts">
import {createComponent, onBeforeMount} from '@vue/composition-api'
import {
  useState,
  useBeforeMount,
  useHandleSave,
  IState,
  useGlobalState,
  useHandleDateChange,
  useHandleTeacherChange,
  useHandleEdit,
} from './home.fn'
import EditPoint from '../components/EditPoint.vue'
import ReadPoint from '../components/ReadPoint.vue'
import {IGlobalState, IPoint, ITeacher} from '../biz/type'

export default {
  name: 'v-home',
  components: {EditPoint, ReadPoint},
  setup() {
    const globalState: IGlobalState = useGlobalState()
    const state: IState = useState()
    const handleTeacherChange = useHandleTeacherChange({state, globalState})
    const handleDateChange = useHandleDateChange({state, globalState})
    const handleSave = useHandleSave({state, globalState})
    const handleEdit = useHandleEdit({state})
    onBeforeMount(useBeforeMount({state, globalState}))
    return {
      state,
      globalState,
      handleTeacherChange,
      handleDateChange,
      handleSave,
      handleEdit,
      handleCancel: () => {state.editable = false}
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

  .form {
    margin: 5px 0;
    border: 1px solid #ddd;
    padding: 10px;
  }

  .btn {
    margin-top: 10px;
  }
}
</style>
