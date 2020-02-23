<template lang="pug">
  points-by-class(date-format="M월 d일")
</template>

<script lang="ts">
import PointsByClass from '../components/PointsByClass.vue'

export default {
  name: 'v-points',
  components: {PointsByClass},
}
</script>
<style scoped lang="stylus"></style>
