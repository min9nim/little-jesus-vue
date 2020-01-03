<template lang="pug">
.home(v-loading='state.loading')
  .options
    el-select.teacher(
      v-model="publicState.teacherId"
      placeholder="선생님 선택"
      @change="handleTeacherChange"
    )
      el-option(
        v-for="item in $store.state.teachers"
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
    .form(v-for="(point, index) in publicState.points" :key="index")
      read-point(v-if="!state.editable" :point="point")
      edit-point(v-else :studentId="point.owner && point.owner._id")
    .no-result(v-show="hasNoStudent()") 반 학생이 없습니다.
    .btn(v-show="publicState.points.length > 0")
      template(v-if="state.editable")
        el-button(@click="handleSave" icon="el-icon-check") 저장
        el-button(v-if="state.pointInit" icon="el-icon-close" @click="handleCancel") 취소
      template(v-else)
        el-button(icon="el-icon-edit" @click="handleEdit") 수정
        el-button(icon="el-icon-delete" @click="handleRemove") 삭제
</template>

<script lang="ts">
import {createComponent, onBeforeMount, onMounted, watch} from '@vue/composition-api'
import {
  useState,
  useBeforeMount,
  useHandleSave,
  IState,
  usePublicState,
  useHandleDateChange,
  useHandleTeacherChange,
  useHandleEdit,
  useHandleRemove,
} from './home.fn'
import EditPoint from '../components/EditPoint.vue'
import ReadPoint from '../components/ReadPoint.vue'
import {IPublicState, IPoint, ITeacher} from '../biz/type'
import {propEq} from 'ramda'

export default {
  name: 'v-home',
  components: {EditPoint, ReadPoint},
  setup(props: any, {root}: any) {
    const publicState: IPublicState = usePublicState()
    const state: IState = useState({root})
    const handleTeacherChange = useHandleTeacherChange({root, state, publicState})
    const handleDateChange = useHandleDateChange({root, state, publicState})
    const handleSave = useHandleSave({state, publicState})
    const handleEdit = useHandleEdit({state})
    const handleRemove = useHandleRemove({root, state})
    // onBeforeMount(useBeforeMount({root, state, publicState}))
    watch(() => root.$store.state.teachers.length, useBeforeMount({root, state, publicState}))
    return {
      state,
      publicState,
      handleTeacherChange,
      handleDateChange,
      handleSave,
      handleEdit,
      handleRemove,
      handleCancel: () => {
        state.editable = false
      },
      hasNoStudent() {
        if (publicState.teacherId === '') {
          return true
        }
        const teacher: any = root.$store.state.teachers.find(propEq('_id', publicState.teacherId))
        if (!teacher) {
          console.log('Not found teacher', publicState.teacherId)
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
