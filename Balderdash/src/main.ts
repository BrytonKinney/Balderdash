import Vue, { CreateElement, VNode } from "vue";
import App from "./App.vue";

new Vue({
    render: h => h(App)
}).$mount("#app");