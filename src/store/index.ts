import Vue from 'vue'
import Vuex from 'vuex'
import {IPointMenu, ITeacher, IPoint, IStudent} from '@/biz/type'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    date: '',
    teachers: [] as ITeacher[],
    pointMenus: [] as IPointMenu[],
    asisPointMenus: [
      {
        _id: 'attendance',
        label: '출석',
        type: 'checkbox',
        priority: 1,
        hidden: false,
        disable: false,
      },
      {
        _id: 'visitcall',
        label: '심방',
        type: 'checkbox',
        priority: 0,
        hidden: false,
        disable: false,
      },
      {
        _id: 'invitation',
        label: '전도',
        type: 'radio:5',
        priority: 10,
        hidden: false,
        disable: false,
      },
      {
        _id: 'meditation',
        label: '묵상',
        type: 'radio:7',
        priority: 1,
        hidden: false,
        disable: false,
      },
      {
        _id: 'recitation',
        label: '암송',
        type: 'checkbox',
        priority: 7,
        hidden: false,
        disable: false,
      },
    ],
  },
  mutations: {
    setDate(state, date) {
      state.date = date
    },
    setTeachers(state, teachers) {
      state.teachers = teachers
    },
    setPointMenus(state, pointMenus) {
      state.pointMenus = pointMenus
    },
    addTeacher(state, teacher) {
      state.teachers.push(teacher)
    },
  },
  actions: {},
  modules: {},
})
