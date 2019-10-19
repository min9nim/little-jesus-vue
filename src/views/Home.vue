<template>
  <div>
    <div v-for="(student, index) in state.students" :key="index">
      이름: {{ student.name }}
      <div>
        출석여부
      </div>
      <div>
        출석여부
      </div>
      <div>
        말씀묵상
      </div>
      <div>
        말씀암송
      </div>
      <div>
        전도
      </div>
      <div>
        기타
      </div>
    </div>
  </div>
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

</style>