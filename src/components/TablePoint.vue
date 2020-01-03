<template lang="pug">
table.items
  thead
    tr.row
      td.name 이름
      td(v-for="item in computed.menuItems") {{menuLabel(item.type)}}
      td.etc 기타
      td.point 점수
  tbody(v-if="!tableBodyHidden")
    tr.row(v-for="(point, index) in points" :key="index")
      td.name {{point.owner.name}}
      td(v-for="item in point.items") {{item.value.split(':')[1]}}
      td.etc {{point.etc}}
      td.point {{itemSum(point.items)}}
  tfoot
    tr.row
      td.name 점수
      td(v-for="(item, index) in computed.menuItems") {{pointSum(index)}} / {{totalPointSum(item.type)}}
      td.etc -    
      td.point -        
</template>

<script lang="ts">
import {IComputed, useComputed} from '../components/table-point.fn'
import {IPublicState, IPoint, ITeacher} from '../biz/type'
import {usePublicState} from '../views/home.fn'
import {prop, head, last, split, map, pipe, reduce} from 'ramda'
import {flatLog, go} from '@mgsong/min-utils'

export default {
  name: 'table-point',
  props: {
    points: Array,
    tableBodyHidden: Boolean,
  },
  methods: {prop},
  setup(props: any, {root}: any) {
    const computed: IComputed = useComputed({root, props})
    return {
      computed,
      menuLabel(menuId: string) {
        return prop('label', root.$store.getters.pointMenuMap[menuId])
      },
      pointSum(index: number) {
        if (root.$store.state.pointMenus.length === 0) {
          return 0
        }
        const reducer = (acc: number, point: any) => {
          const item = point.items[index]
          if (!point.items) {
            return acc
          }
          if (!item) {
            // 포인트 입력 이후 새로 추가된 항목이 있을 경우 예외 처리
            return acc
          }
          const value = go(item.value, split(':'), last, Number)
          const label = root.$store.getters.pointMenuMap[item.type].label
          // console.log('item.type = ' + item.type)
          const priority = root.$store.getters.pointMenuMap[item.type].priority
          // console.log({label, value, priority})
          return acc + value * priority
          // return acc + value
        }
        return props.points.reduce(reducer, 0)
      },
      totalPointSum(menuId: string) {
        if (root.$store.state.pointMenus.length === 0) {
          return 0
        }

        const maxValue = go(
          root.$store.getters.pointMenuMap[menuId].type,
          split(','),
          map(
            pipe(
              split(':'),
              last,
              Number,
            ),
          ),
          reduce((a: any, b: any) => (a > b ? a : b), 0),
        )
        const priority = root.$store.getters.pointMenuMap[menuId].priority

        return props.points.length * maxValue * priority
      },
      itemSum(items: any) {
        if (root.$store.state.pointMenus.length === 0) {
          return 0
        }
        if (!items) {
          throw Error('Not found items')
        }

        return items.reduce((acc: any, item: any) => {
          // console.log('item.type = ' + item.type)
          // flatLog('root.$store.getters.pointMenuMap = ', root.$store.getters.pointMenuMap)
          const priority = root.$store.getters.pointMenuMap[item.type].priority
          const value = go(item.value, split(':'), last, Number)
          return acc + value * priority
        }, 0)
      },
      perfectScoreSum(items: any) {
        if (root.$store.state.pointMenus.length === 0) {
          return 0
        }
        if (!items) {
          throw Error('Not found items')
        }
        return items.reduce((acc: any, item: any) => {
          const perfectScore =
            (Number(root.$store.getters.pointMenuMap[item.type].type) - 1) *
            root.$store.getters.pointMenuMap[item.type].priority
          return acc + perfectScore * root.$store.getters.pointMenuMap[item.type].priority
        }, 0)
      },
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
