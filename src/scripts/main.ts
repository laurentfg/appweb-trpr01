import { createApp } from 'vue';
import '../css/style.css';
import App from '../App.vue';
import { createNotivue  } from 'notivue';

import 'notivue/notification.css'; // For built-in Notification
import 'notivue/animations.css'; // For default animations

const notivue = createNotivue({position: 'bottom-right'});
const app = createApp(App);

app.use(notivue);
app.mount('#app');