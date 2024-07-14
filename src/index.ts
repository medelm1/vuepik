import { App } from 'vue';
import ImageSelector from './components/ImageSelector.vue';

export default {
    install(app: App) {
        app.component('ImageSelector', ImageSelector);
    }
};
