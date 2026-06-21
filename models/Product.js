/**
 * Класс товара
 * Применяет инкапсуляцию: приватное поле _stock
 */

import { Entity } from './Entity.js';

export class Product extends Entity {
    /**
     * @param {string} name - Название товара
     * @param {number} price - Цена
     * @param {number} stock - Количество на складе
     * @param {string} category - Категория
     * @param {string} description - Описание
     * @param {string|null} uid - ID
     */
    constructor(name, price, stock, category, description = '', uid = null) {
        super(uid);
        this.name = name;
        this.price = price;
        this._stock = stock; // Инкапсуляция: приватное поле
        this.category = category;
        this.description = description;
    }

    /**
     * Геттер для остатков (инкапсуляция)
     * @returns {number}
     */
    get stock() {
        return this._stock;
    }

    /**
     * Уменьшает остаток с проверкой
     * @param {number} quantity - Количество для списания
     * @throws {Error} Если количество некорректно или недостаточно товара
     */
    decreaseStock(quantity) {
        if (quantity <= 0) {
            throw new Error('Количество должно быть положительным числом');
        }
        if (quantity > this._stock) {
            throw new Error(`Недостаточно товара '${this.name}'. Доступно: ${this._stock}`);
        }
        this._stock -= quantity;
    }

    /**
     * Увеличивает остаток (возврат товара)
     * @param {number} quantity - Количество для добавления
     * @throws {Error} Если количество некорректно
     */
    increaseStock(quantity) {
        if (quantity <= 0) {
            throw new Error('Количество должно быть положительным числом');
        }
        this._stock += quantity;
    }

    /**
     * Сериализация товара
     * @returns {Object}
     */
    toDict() {
        return {
            id: this.id,
            name: this.name,
            price: this.price,
            stock: this._stock,
            category: this.category,
            description: this.description
        };
    }
}