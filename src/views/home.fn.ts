import { reactive } from "@vue/composition-api";

export function useState() {
  return reactive({
    teachers: [],
    teacherId: "",
    students: [],
    date: "",
    loading: true
  });
}
