<template lang="pug">
.home
  .form(v-for="(student, index) in state.students" :key="index")
    h1 {{ student.name }}
    .item
      .label 출석여부
      .control
        el-radio(lable="1") O
        el-radio(lable="2") X
    .item
      .label 심방여부
      .control
        el-radio(lable="1") O
        el-radio(lable="2") X    
    .item 말씀묵상
    .item 말씀암송
    .item 전도
    .item 기타
</template>

<script>
import {createComponent, reactive, onMounted} from '@vue/composition-api'
import gql from 'graphql-tag'
import {req} from '@/utils'

export default createComponent({
  setup() {
    const state = reactive({
      students: [],
    })

    onMounted(async () => {
      const result = await req(gql`
        {
          students {
            name
          }
        }
      `)
      // console.log(result)
      state.students = result.students
    })

    return {
      state,
    }
  },
})
</script>
<style scoped>
.home {
  margin: 0 10px;
  padding: 5px;
  text-align: left;
}
.home .form {
  border: 1px solid #eee;
}
.home .form .item {
  font-size: 18px;
  margin: 3px 0;
  display: flex;
}
.home .form .item .control {
  margin-left: 10px;
}
</style>