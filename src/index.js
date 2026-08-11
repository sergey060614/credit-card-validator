import './assets/styles.css';
import { CardValidator } from './components/CardValidator.js';

document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('app');
    
    if (appContainer) {
        // Передаем САМ ЭЛЕМЕНТ (#app)
        new CardValidator(appContainer);
    }
});