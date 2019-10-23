<template lang="pug">
.input-form
  h1 {{ state.student.name }}
  .item
    .label 출석여부
    .control
      el-radio(v-model="state.student.attendance" :label="true") O
      el-radio(v-model="state.student.attendance" :label="false") X
  .item
    .label 심방여부
    .control
      el-radio(v-model="state.student.visitcall" :label="true") O
      el-radio(v-model="state.student.visitcall" :label="false") X    
  .item.meditation
    .label 말씀묵상
    .control
      el-radio(v-model="state.student.meditation" :label="0") 0
      el-radio(v-model="state.student.meditation" :label="1") 1
      el-radio(v-model="state.student.meditation" :label="2") 2
      el-radio(v-model="state.student.meditation" :label="3") 3
      el-radio(v-model="state.student.meditation" :label="4") 4
      el-radio(v-model="state.student.meditation" :label="5") 5
      el-radio(v-model="state.student.meditation" :label="6") 6
      el-radio(v-model="state.student.meditation" :label="7") 7
  .item
    .label 말씀암송
    .control
      el-radio(v-model="state.student.recitation" :label="true") O
      el-radio(v-model="state.student.recitation" :label="false") X    
  .item.invitation
    .label 전도
    .control
      el-radio(v-model="state.student.invitation" :label="0") 0
      el-radio(v-model="state.student.invitation" :label="1") 1
      el-radio(v-model="state.student.invitation" :label="2") 2
      el-radio(v-model="state.student.invitation" :label="3") 3
      el-radio(v-model="state.student.invitation" :label="4") 4
      el-radio(v-model="state.student.invitation" :label="5") 5    
  .item
    .label 기타사항
    .control
      el-input(
        v-model="state.student.etc"
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 6}"
        placeholder="특이사항 입력"
      )  
</template>
<script lang="ts">
import {createComponent, reactive, computed, watch} from '@vue/composition-api'
import {useState} from '../views/home.fn'
import {propEq} from 'ramda'
import Vue from 'vue'

export default createComponent({
  props: {studentId: String},
  setup(props, {root}) {
    const globalState = useState()
    let state = reactive({
      student: globalState.students.find(propEq('_id', props.studentId)),
    })
    watch(
      () => props.studentId,
      () => {
        state.student = globalState.students.find(propEq('_id', props.studentId))
      },
    )
    return {
      state,
    }
  },
})
</script>
<style lang="stylus" scoped>
.input-form {
  h1 {
    margin-top: 0;
  }

  .item {
    font-size: 18px;
    margin: 3px 0;
    display: flex;
    margin: 10px 0;

    &.meditation {
      .el-radio {
        margin: 10px 20px 10px 0;
      }
    }

    &.invitation {
      .el-radio {
        margin: 10px 20px 10px 0;
      }
    }

    .label {
      margin-right: 20px;
      width: 70px;
      text-align: right;
      display: flex;
      align-items: center;
    }

    .control {
      margin-left: 10px;
      flex: 1;
    }
  }
}
</style>
<style lang="stylus">
.home {
  .form {
    .item {
      .el-radio__label {
        font-size: 18px;
      }
    }
  }
}
</style>
