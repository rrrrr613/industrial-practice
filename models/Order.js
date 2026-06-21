/**
 * Класс заказа
 * Реализует расчет скидки и доставки по формуле из ТЗ
 */

import { Entity } from './Entity.js';

export class Order extends Entity {
    /**
     * @param {string} userId - ID пользователя
     * @param {ShoppingCart} cart - Корзина
     * @param {number} discountRate - Процент скидки (0.0 - 0.5)
     * @param {boolean} isExpress - Флаг экспресс-доставки
     * @param {string} deliveryAddress - Адрес доставки
     * @param {string|null} uid - ID заказа
     */
    constructor(userId, cart, discountRate = 0.0, isExpress = false, deliveryAddress = '', uid = null) {
        super(uid);
        this.userId = userId;
        this.status = 'pending'; // pending | paid | shipped | delivered | cancelled
        this.discountRate = discountRate;
        this.isExpress = isExpress;
        this.deliveryAddress = deliveryAddress;
        this.createdAt = new Date();

        // Копируем товары из корзины
        this.items = cart.items.map(item => ({
            product: item.product,
            quantity: item.quantity,
            priceAtPurchase: item.product.price
        }));

        // --- РАСЧЕТЫ (по формуле) ---
        this.baseTotal = cart.getBaseTotal();
        this.deliveryCost = this._calculateDelivery();
        this.discountAmount = parseFloat((this.baseTotal * this.discountRate).toFixed(2));
        this.totalAmount = parseFloat(
            (this.baseTotal - this.discountAmount + this.deliveryCost).toFixed(2)
        );

        // Резервируем товары (списываем со склада)
        for (const item of this.items) {
            item.product.decreaseStock(item.quantity);
        }
    }

    /**
     * Расчет стоимости доставки
     * @private
     * @returns {number}
     */
    _calculateDelivery() {
        // Если сумма >= 3000 руб. -> бесплатно
        if (this.baseTotal >= 3000) {
            return 0;
        }
        // Иначе: 500 руб. (обычная) или 1000 руб. (экспресс)
        return this.isExpress ? 1000 : 500;
    }

    /**
     * Отмена заказа (возврат товаров на склад)
     * @throws {Error} Если заказ уже отправлен или доставлен
     */
    cancel() {
        if (this.status === 'shipped' || this.status === 'delivered') {
            throw new Error('Нельзя отменить отправленный или доставленный заказ');
        }
        if (this.status === 'cancelled') {
            return;
        }

        // Возврат товаров на склад
        for (const item of this.items) {
            item.product.increaseStock(item.quantity);
        }
        this.status = 'cancelled';
    }

    /**
     * Подтверждение оплаты
     * @throws {Error} Если статус не позволяет
     */
    confirmPayment() {
        if (this.status !== 'pending') {
            throw new Error(`Невозможно подтвердить оплату для статуса '${this.status}'`);
        }
        this.status = 'paid';
    }

    /**
     * Отправка заказа
     * @throws {Error} Если статус не позволяет
     */
    ship() {
        if (this.status !== 'paid') {
            throw new Error(`Невозможно отправить заказ со статусом '${this.status}'`);
        }
        this.status = 'shipped';
    }

    /**
     * Доставка заказа
     * @throws {Error} Если статус не позволяет
     */
    deliver() {
        if (this.status !== 'shipped') {
            throw new Error(`Невозможно доставить заказ со статусом '${this.status}'`);
        }
        this.status = 'delivered';
    }

    /**
     * Сериализация заказа
     * @returns {Object}
     */
    toDict() {
        return {
            id: this.id,
            userId: this.userId,
            status: this.status,
            baseTotal: this.baseTotal,
            discountRate: this.discountRate,
            discountAmount: this.discountAmount,
            deliveryCost: this.deliveryCost,
            totalAmount: this.totalAmount,
            deliveryAddress: this.deliveryAddress,
            createdAt: this.createdAt.toISOString(),
            items: this.items.map(item => ({
                productId: item.product.id,
                productName: item.product.name,
                quantity: item.quantity,
                priceAtPurchase: item.priceAtPurchase,
                total: parseFloat((item.quantity * item.priceAtPurchase).toFixed(2))
            }))
        };
    }
}