<template lang="pug">
.point
  h1 {{state.name}}
</template>
<script lang="ts">
import {createComponent, reactive} from '@vue/composition-api'

export default createComponent({
  setup(){
    const state = reactive({
      name: 'blabla',
    })
    return {
      state
    }
  }
})
</script>
