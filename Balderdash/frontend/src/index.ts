import App from "./components/App.vue";
import Vue, { VNode } from "vue";

let app = new Vue({
    el: "#app",
    render: function (create) : VNode {
        return create(App);
    }
})