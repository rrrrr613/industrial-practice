/**
 * Корзина покупателя
 * Управление товарами в корзине
 */

import { CartItem } from './CartItem.js';

export class ShoppingCart {
    /**
     * @param {string} userId - ID пользователя
     */
    constructor(userId) {
        this.userId = userId;
        this.items = [];
        this.createdAt = new Date();
    }

    /**
     * Добавляет товар в корзину
     * Если товар уже есть, увеличивает количество
     * @param {Product} product - Товар
     * @param {number} quantity - Количество
     * @throws {Error} Если количество некорректно или недостаточно товара
     */
    addItem(product, quantity = 1) {
        if (quantity <= 0) {
            throw new Error('Количество должно быть положительным числом');
        }
        if (product.stock < quantity) {
            throw new Error(`Недостаточно товара. Доступно: ${product.stock}`);
        }

        // Проверяем, есть ли уже такой товар в корзине
        const existingItem = this.items.find(item => item.product.id === product.id);
        
        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;
            if (product.stock < newQuantity) {
                throw new Error(
                    `Нельзя добавить. В корзине уже ${existingItem.quantity}, доступно ${product.stock}`
                );
            }
            existingItem.quantity = newQuantity;
        } else {
            this.items.push(new CartItem(product, quantity));
        }
    }

    /**
     * Удаляет товар из корзины
     * @param {string} productId - ID товара
     */
    removeItem(productId) {
        this.items = this.items.filter(item => item.product.id !== productId);
    }

    /**
     * Обновляет количество конкретного товара
     * @param {string} productId - ID товара
     * @param {number} quantity - Новое количество
     * @throws {Error} Если товар не найден или недостаточно товара
     */
    updateQuantity(productId, quantity) {
        if (quantity < 0) {
            throw new Error('Количество не может быть отрицательным');
        }
        if (quantity === 0) {
            this.removeItem(productId);
            return;
        }

        const item = this.items.find(item => item.product.id === productId);
        if (!item) {
            throw new Error(`Товар с id ${productId} не найден в корзине`);
        }
        if (item.product.stock < quantity) {
            throw new Error(`Недостаточно товара. Доступно: ${item.product.stock}`);
        }
        item.quantity = quantity;
    }

    /**
     * Сумма всех товаров в корзине
     * @returns {number}
     */
    getBaseTotal() {
        return parseFloat(
            this.items.reduce((sum, item) => sum + item.getTotalPrice(), 0).toFixed(2)
        );
    }

    /**
     * Общее количество товаров
     * @returns {number}
     */
    getTotalItems() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    /**
     * Очищает корзину
     */
    clear() {
        this.items = [];
    }

    /**
     * Проверяет, пуста ли корзина
     * @returns {boolean}
     */
    isEmpty() {
        return this.items.length === 0;
    }

    /**
     * Сериализация корзины
     * @returns {Object}
     */
    toDict() {
        return {
            userId: this.userId,
            items: this.items.map(item => item.toDict()),
            baseTotal: this.getBaseTotal(),
            totalItems: this.getTotalItems(),
            createdAt: this.createdAt.toISOString()
        };
    }
}