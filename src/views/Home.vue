<template lang="pug">
.home
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
      .label 기타
      .control
        el-input(v-model="student.etc" type="textarea" :autosize="{ minRows: 2, maxRows: 6}")

  .btn
    el-button 저장
</template>

<script>
import { createComponent, reactive, onMounted } from "@vue/composition-api";
import gql from "graphql-tag";
import { req } from "@/utils";
import { mergeRight } from "ramda";

export default createComponent({
  setup() {
    const state = reactive({
      students: []
    });

    onMounted(async () => {
      const result = await req(gql`
        {
          students {
            name
          }
        }
      `);
      // console.log(result)
      state.students = result.students.map(
        mergeRight({
          attendance: false,
          visitcall: false,
          meditation: 0,
          invitation: 0,
          recitation: false
        })
      );
    });

    return {
      state
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
}
.home .form .item .control {
  margin-left: 10px;
  flex: 1;
}
.home .btn {
  margin-top: 10px;
}
</style>