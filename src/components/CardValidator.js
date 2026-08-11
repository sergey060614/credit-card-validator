import { luhnCheck, getCardSystem } from '../lib/cardUtils.js';
export class CardValidator {
    constructor(containerElement) {
        // Принимаем готовый объект div#app
        this.container = containerElement; 
        
        // Инициализируем переменные
        this.input = null;
        this.messageBox = null;

        this.render();
        this.bindEvents();
    }

    render() {
        // Вставляем верстку внутрь контейнера
        this.container.innerHTML = `
            <div class="cc-widget">
                <input type="text" placeholder="Номер карты" class="cc-input"/>
                <button type="button" class="cc-btn">Проверить</button>
                <div class="cc-result"></div>
            </div>
        `;

        // Теперь ищем элементы ВНУТРИ this.container
        // querySelector ищет только среди потомков конкретного блока
        this.input = this.container.querySelector('.cc-input'); 
        this.messageBox = this.container.querySelector('.cc-result');
    }

    bindEvents() {
        const button = this.container.querySelector('.cc-btn');
        if (button) {
            button.addEventListener('click', () => this.validate());
        }
    }

    validate() {
        const number = this.input.value.replace(/\D/g, '');
        const system = getCardSystem(number);
        const isValid = luhnCheck(number);

        let message = '';
        if (system) {
             message += `<img src="/assets/${system}.svg" alt="${system}" width="30"> `;
        }
        message += isValid ? '✅ Валидный номер' : '❌ Невалидный номер';
        
        this.messageBox.innerHTML = message;
    }
}