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
    )
  .form(v-for="(student, index) in state.students" :key="index")
    h1 {{ student.name }}
    .item
      .label 출석여부
      .control
        el-radio(v-model="student.attendance" :label="true") O
        el-radio(v-model="student.attendance" :label="false") X
    .item
      .label 심방여부
      .control
        el-radio(v-model="student.visitcall" :label="true") O
        el-radio(v-model="student.visitcall" :label="false") X    
    .item.meditation
      .label 말씀묵상
      .control
        el-radio(v-model="student.meditation" :label="0") 0
        el-radio(v-model="student.meditation" :label="1") 1
        el-radio(v-model="student.meditation" :label="2") 2
        el-radio(v-model="student.meditation" :label="3") 3
        el-radio(v-model="student.meditation" :label="4") 4
        el-radio(v-model="student.meditation" :label="5") 5
        el-radio(v-model="student.meditation" :label="6") 6
        el-radio(v-model="student.meditation" :label="7") 7
    .item
      .label 말씀암송
      .control
        el-radio(v-model="student.recitation" :label="true") O
        el-radio(v-model="student.recitation" :label="false") X    
    .item.invitation
      .label 전도
      .control
        el-radio(v-model="student.invitation" :label="0") 0
        el-radio(v-model="student.invitation" :label="1") 1
        el-radio(v-model="student.invitation" :label="2") 2
        el-radio(v-model="student.invitation" :label="3") 3
        el-radio(v-model="student.invitation" :label="4") 4
        el-radio(v-model="student.invitation" :label="5") 5    
    .item
      .label 기타사항
      .control
        el-input(
          v-model="student.etc"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 6}"
          placeholder="특이사항 입력"
        )
  .btn
    el-button 저장
</template>

<script>
import { createComponent, reactive, onBeforeMount } from "@vue/composition-api";
import gql from "graphql-tag";
import { req } from "@/utils";
import { mergeRight, propEq } from "ramda";
// import {students} from '@/assets/data'

export default createComponent({
  setup() {
    const state = reactive({
      teachers: [],
      teacherId: "",
      students: [],
      date: '',
      loading: true
    });

    function handleTeacherChange(teacherId){
      console.count(teacherId)
      state.teacherId = teacherId
      const teacher = state.teachers.find(propEq("_id", state.teacherId));
      if (teacher) {
        state.students = teacher.students.map(
          mergeRight({
            attendance: false,
            visitcall: false,
            meditation: 0,
            invitation: 0,
            recitation: false
          })
        );
      }      
    }

    onBeforeMount(async () => {
      const result = await req(gql`
        {
          res: teachers {
            _id
            name
            students {
              _id
              name
            }
          }
        }
      `);
      state.teachers = result.res;
      state.loading = false;
    });

    return {
      state,
      handleTeacherChange,
    };
  }
});
</script>
<style scoped>
.home {
  margin: 0 10px;
  padding: 5px;
  text-align: left;
}
.home .options .teacher {
  width: 150px;
}
.home .options .date {
  margin-left: 5px;
  width: 150px;
}
.home .form {
  margin: 5px 0;
  border: 1px solid #eee;
  padding: 10px;
}
.home .form h1 {
  margin-top: 0;
}
.home .form .item {
  font-size: 18px;
  margin: 3px 0;
  display: flex;
  margin: 10px 0;
}
.home .form .item.meditation .el-radio {
  margin: 10px 20px 10px 0;
}
.home .form .item.invitation .el-radio {
  margin: 10px 20px 10px 0;
}
.home .form .item .label {
  margin-right: 20px;
  width: 70px;
  text-align: right;
  display: flex;
  align-items: center;
}
.home .form .item .control {
  margin-left: 10px;
  flex: 1;
}
.home .btn {
  margin-top: 10px;
}
</style>
<style>
.home .form .item .el-radio__label {
  font-size: 18px;
}
</style>
