<template lang="pug">
.home(v-loading='state.loading')
  .options
    el-select.teacher(
      v-model="state.teacherId"
      placeholder="선생님 선택"
      @change="handleTeacherChange"
    )
      el-option(
        v-for="item in state.teachers"
        :key="item._id"
        :label="item.name"
        :value="item._id"
      )
    el-date-picker.date(
      v-model="state.date"
      type="date"
      placeholder="날짜 선택"
      @change="handleDateChange"
    )
  .form(v-for="(student, index) in state.students" :key="index")
    input-form(:studentId="student._id")
  .btn(v-show="state.students.length > 0")
    el-button 저장
</template>

<script lang="ts">
import {createComponent, onBeforeMount} from '@vue/composition-api'
import {useState, useBeforeMount} from './home.fn'
import InputForm from '../components/InputForm.vue'

interface Teacher {
  _id: string
  name: string
  students: [string]
}
export default {
  name: 'v-home',
  components: {InputForm},
  setup() {
    const state = useState()
    const handleTeacherChange = (teacherId: string) => {
      localStorage.setItem('teacherId', teacherId)
    }
    const handleDateChange = (date: Date) => {
      console.log({date})
    }

    onBeforeMount(useBeforeMount({state}))

    return {
      state,
      handleTeacherChange,
      handleDateChange,
    }
  },
}
</script>
<style scoped lang="stylus">
.home {
  margin: 0 10px;
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
