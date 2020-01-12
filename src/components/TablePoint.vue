<template lang="pug">
table.items(:class="{'etc-ellipsis': etcEllipsis}")
  thead
    tr.row
      td.name(v-if="!studentNameHidden") 이름
      td(v-for="item in computed.menuItems") {{menuLabel(item.type)}}
      td.etc 기타
      td.point 점수
  tbody(v-if="!tableBodyHidden")
    tr.row(v-for="(point, index) in points" :key="index")
      td.name(v-if="!studentNameHidden") {{point.owner.name}}
      td(v-for="item in point.items") {{item.value.split(':')[1]}}
      td.etc.ellipsis(v-html="nl2br(point.etc.replace(/script/ig, ''))")
      td.point {{itemSum(point.items)}}
  tfoot
    tr.row
      td.name(v-if="!studentNameHidden") 점수
      td(v-for="(item, index) in computed.menuItems") {{pointSum(index)}} / {{totalPointSum(item.type)}}
      td.etc -    
      td.point -        
</template>

<script lang="ts">
import {
  IComputed,
  useComputed,
  usePointSum,
  useTotalPointSum,
  useItemSum,
  usePerfectScoreSum,
} from './table-point.fn'
import {IPublicState, IPoint, ITeacher} from '../biz/type'
import {usePublicState} from '../views/home.fn'
import {prop, head, last, split, map, pipe, reduce, filter, propEq, length, find, path} from 'ramda'
import {flatLog, go, nl2br} from 'mingutils'

export default {
  name: 'table-point',
  props: {
    points: Array,
    tableBodyHidden: Boolean,
    studentNameHidden: Boolean,
    teacherName: String,
    etcEllipsis: Boolean,
  },
  methods: {prop, nl2br},
  setup(props: any, {root}: any) {
    const computed: IComputed = useComputed({root, props})
    const pointSum = usePointSum({props, root})
    const totalPointSum = useTotalPointSum({props, root})
    const itemSum = useItemSum({root})
    const perfectScoreSum = usePerfectScoreSum({root})
    return {
      computed,
      menuLabel(menuId: string) {
        return prop('label', root.$store.getters.pointMenuMap[menuId])
      },
      pointSum,
      totalPointSum,
      itemSum,
      perfectScoreSum,
    }
  },
}
</script>
<style scoped lang="stylus">
table.items {
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

    .name {
      width: 50px;
    }
  }

  tbody {
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

.etc-ellipsis {
  table-layout: fixed;

  .ellipsis {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}
</style>
