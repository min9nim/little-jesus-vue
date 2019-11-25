<template lang="pug">
table.items
  thead
    tr.row
      td.name 이름
      td.attendance 출석
      td.visitcall 심방
      td.meditation 묵상
      td.recitation 암송
      td.invitation 전도
      td.etc 기타
      td.point 점수
  tbody(v-if="!tableBodyHidden")
    tr.row(v-for="(point, index) in points" :key="index")
      td.name {{point.owner.name}}
      td.attendance {{point.attendance ? 1 : 0}}
      td.visitcall {{point.visitcall ? 1 : 0}}
      td.meditation {{point.meditation}}
      td.recitation {{point.recitation ? 1 : 0}}
      td.invitation {{point.invitation}}
      td.etc {{point.etc}}
      td.point {{(point.attendance ? 1 : 0) + point.meditation + (point.recitation ? 7 : 0) + point.invitation * 10}}
  tfoot
    tr.row
      td.name 합계
      td.attendance {{computed.attendanceSum}} / {{points.length}}
      td.visitcall {{computed.visitcallSum}} / {{points.length}}
      td.meditation {{computed.meditationSum}}
      td.recitation {{computed.recitationSum}} / {{points.length}}
      td.invitation {{computed.invitationSum}}
      td.etc -    
      td.point -        
</template>

<script lang="ts">
import {IComputed, useComputed} from '../components/table-point.fn'
import {IPublicState, IPoint, ITeacher} from '../biz/type'
import {usePublicState} from '../views/home.fn'

export default {
  name: 'table-point',
  props: {
    points: Array,
    tableBodyHidden: Boolean,
  },
  setup(props: any) {
    const computed: IComputed = useComputed(props)
    return {
      computed,
    }
  },
}
</script>
<style scoped lang="stylus">
.items {
  width: 100%;
  font-size: 12px;
  border-collapse: collapse;
  padding: 5px;

  .row {
    margin: 5px;
    border: 1px solid #ddd;
    padding: 10px;
  }

  thead {
    background-color: #f9f9f9;
  }

  tbody {
    .name {
      min-width: 35px;
    }

    .etc {
      font-size: 10px;
      text-align: left;
      max-width: 130px;
    }
  }

  tfoot {
    background-color: #f9f9f9;
  }
}

table, th, td {
  border: 1px solid #eee;
}

td {
  padding: 3px;
  text-align: center;
}
</style>
