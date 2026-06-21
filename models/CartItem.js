/**
 * Позиция в корзине
 * Связывает товар и количество
 */

import { Entity } from './Entity.js';

export class CartItem extends Entity {
    /**
     * @param {Product} product - Товар
     * @param {number} quantity - Количество
     * @param {string|null} uid - ID
     */
    constructor(product, quantity, uid = null) {
        super(uid);
        this.product = product;
        this.quantity = quantity;
    }

    /**
     * Стоимость позиции
     * @returns {number}
     */
    getTotalPrice() {
        return parseFloat((this.product.price * this.quantity).toFixed(2));
    }

    /**
     * Сериализация позиции
     * @returns {Object}
     */
    toDict() {
        return {
            id: this.id,
            product: this.product.toDict(),
            quantity: this.quantity,
            totalPrice: this.getTotalPrice()
        };
    }
}