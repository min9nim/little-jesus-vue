<template lang="pug">
.point
  h1 {{state.teachers.map(prop('name'))}}
</template>
<script lang="ts">
import {createComponent, reactive} from '@vue/composition-api'
import {useState} from './home.fn'
import {prop} from 'ramda'

export default createComponent({
  methods: {prop},
  setup() {
    const state = useState()
    return {
      state,
    }
  },
})
</script>
