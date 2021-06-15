import { defineComponent, reactive, toRefs } from "@vue/composition-api";

export default defineComponent({
  components: {},
  props: {},
  setup(props) {
    const state = reactive({});
    return () => (<div></div>);
  },
});
