import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from './routes'
import PrimeVue from "primevue/config";
import "primevue/resources/themes/saga-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import "./style.css";
const app = createApp(App);

app.use(createPinia());
app.use(PrimeVue);
app.use(router);


app.mount("#app");
