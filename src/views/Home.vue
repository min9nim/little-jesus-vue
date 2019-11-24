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
      :clearable="false"
      format="yyyy-MM-dd"
      value-format="yyyyMMdd"
      placeholder="날짜 선택"
      :disabled="state.pointInit && state.editable"
      @change="handleDateChange"
    )
  template(v-if="!state.loading")
    .form(v-for="(point, index) in globalState.points" :key="index")
      read-point(v-if="!state.editable" :point="point")
      edit-point(v-else :studentId="point.owner._id")
    .no-result(v-show="hasNoStudent()") 반 학생이 없습니다.
    .btn(v-show="globalState.points.length > 0")
      template(v-if="state.editable")
        el-button(@click="handleSave") 저장
        el-button(v-if="state.pointInit" @click="handleCancel") 취소
      template(v-else)
        el-button(@click="handleEdit") 수정
        el-button(@click="handleRemove") 삭제
</template>

<script lang="ts">
import {createComponent, onBeforeMount, onMounted} from '@vue/composition-api'
import {
  useState,
  useBeforeMount,
  useHandleSave,
  IState,
  useGlobalState,
  useHandleDateChange,
  useHandleTeacherChange,
  useHandleEdit,
  useHandleRemove,
} from './home.fn'
import EditPoint from '../components/EditPoint.vue'
import ReadPoint from '../components/ReadPoint.vue'
import {IGlobalState, IPoint, ITeacher} from '../biz/type'
import {propEq} from 'ramda'

export default {
  name: 'v-home',
  components: {EditPoint, ReadPoint},
  setup(props: any, {root}: any) {
    const globalState: IGlobalState = useGlobalState()
    const state: IState = useState()
    const handleTeacherChange = useHandleTeacherChange({state, globalState})
    const handleDateChange = useHandleDateChange({state, globalState})
    const handleSave = useHandleSave({state, globalState})
    const handleEdit = useHandleEdit({state})
    const handleRemove = useHandleRemove({state})
    onBeforeMount(useBeforeMount({root, state, globalState}))
    return {
      state,
      globalState,
      handleTeacherChange,
      handleDateChange,
      handleSave,
      handleEdit,
      handleRemove,
      handleCancel: () => {
        state.editable = false
      },
      hasNoStudent() {
        if (globalState.teacherId === '') {
          return true
        }
        const teacher: any = globalState.teachers.find(propEq('_id', globalState.teacherId))
        if (!teacher) {
          console.log('Not found teacher', globalState.teacherId)
          return true
        }
        return teacher.students.length === 0
      },
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
      width: 130px;
    }

    .date {
      cursor: pointer;
      margin-left: 5px;
      width: 140px;
    }
  }

  .form {
    padding: 5px 0;
  }

  .btn {
    margin-top: 10px;
  }
}
</style>
<style lang="stylus" scoped>
.no-result {
  margin: 10px;
}
</style>
