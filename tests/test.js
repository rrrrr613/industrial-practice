/**
 * Модульные тесты для индивидуального задания №5
 * Запуск: npm test
 */

import { Product } from '../models/Product.js';
import { ShoppingCart } from '../models/ShoppingCart.js';
import { Order } from '../models/Order.js';

/**
 * Простой фреймворк для тестирования
 */
class TestRunner {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }

    test(name, fn) {
        this.tests.push({ name, fn });
    }

    async run() {
        console.log('\n🧪 ЗАПУСК ТЕСТОВ\n' + '='.repeat(50));

        for (const test of this.tests) {
            try {
                await test.fn();
                console.log(`✅ PASS: ${test.name}`);
                this.passed++;
            } catch (error) {
                console.log(`❌ FAIL: ${test.name}`);
                console.log(`   ${error.message}`);
                this.failed++;
            }
        }

        console.log('\n' + '='.repeat(50));
        console.log(`📊 ИТОГО: ${this.passed} пройдено, ${this.failed} не пройдено`);
        console.log(this.failed === 0 ? '✅ ВСЕ ТЕСТЫ ПРОЙДЕНЫ!' : '❌ ЕСТЬ ОШИБКИ');
    }
}

// Создаем тест-раннер
const runner = new TestRunner();

// ========== ТЕСТЫ ДЛЯ PRODUCT ==========
runner.test('Product: корректное уменьшение остатка', () => {
    const product = new Product('Телефон', 50000, 10, 'Электроника');
    product.decreaseStock(3);
    if (product.stock !== 7) {
        throw new Error(`Ожидалось 7, получено ${product.stock}`);
    }
});

runner.test('Product: ошибка при недостатке товара', () => {
    const product = new Product('Телефон', 50000, 10, 'Электроника');
    let errorThrown = false;
    try {
        product.decreaseStock(15);
    } catch (e) {
        errorThrown = true;
    }
    if (!errorThrown) {
        throw new Error('Ожидалась ошибка InsufficientStockError');
    }
});

runner.test('Product: ошибка при отрицательном количестве', () => {
    const product = new Product('Телефон', 50000, 10, 'Электроника');
    let errorThrown = false;
    try {
        product.decreaseStock(-5);
    } catch (e) {
        errorThrown = true;
    }
    if (!errorThrown) {
        throw new Error('Ожидалась ошибка InvalidQuantityError');
    }
});

runner.test('Product: увеличение остатка', () => {
    const product = new Product('Телефон', 50000, 10, 'Электроника');
    product.increaseStock(5);
    if (product.stock !== 15) {
        throw new Error(`Ожидалось 15, получено ${product.stock}`);
    }
});

// ========== ТЕСТЫ ДЛЯ SHOPPING CART ==========
runner.test('ShoppingCart: добавление нового товара', () => {
    const product = new Product('Ноутбук', 100000, 5, 'Электроника');
    const cart = new ShoppingCart('user_001');
    cart.addItem(product, 2);
    if (cart.items.length !== 1) {
        throw new Error(`Ожидалось 1 позиция, получено ${cart.items.length}`);
    }
    if (cart.items[0].quantity !== 2) {
        throw new Error(`Ожидалось количество 2, получено ${cart.items[0].quantity}`);
    }
});

runner.test('ShoppingCart: добавление существующего товара', () => {
    const product = new Product('Ноутбук', 100000, 5, 'Электроника');
    const cart = new ShoppingCart('user_001');
    cart.addItem(product, 2);
    cart.addItem(product, 3);
    if (cart.items[0].quantity !== 5) {
        throw new Error(`Ожидалось количество 5, получено ${cart.items[0].quantity}`);
    }
});

runner.test('ShoppingCart: ошибка при добавлении больше, чем есть', () => {
    const product = new Product('Ноутбук', 100000, 5, 'Электроника');
    const cart = new ShoppingCart('user_001');
    let errorThrown = false;
    try {
        cart.addItem(product, 10);
    } catch (e) {
        errorThrown = true;
    }
    if (!errorThrown) {
        throw new Error('Ожидалась ошибка InsufficientStockError');
    }
});

runner.test('ShoppingCart: удаление товара', () => {
    const product = new Product('Ноутбук', 100000, 5, 'Электроника');
    const cart = new ShoppingCart('user_001');
    cart.addItem(product, 2);
    cart.removeItem(product.id);
    if (!cart.isEmpty()) {
        throw new Error('Корзина должна быть пустой');
    }
});

runner.test('ShoppingCart: расчет суммы корзины', () => {
    const p1 = new Product('Ноутбук', 100000, 5, 'Электроника');
    const p2 = new Product('Мышь', 2000, 20, 'Аксессуары');
    const cart = new ShoppingCart('user_001');
    cart.addItem(p1, 2); // 200000
    cart.addItem(p2, 3); // 6000
    const total = cart.getBaseTotal();
    if (total !== 206000) {
        throw new Error(`Ожидалось 206000, получено ${total}`);
    }
});

// ========== ТЕСТЫ ДЛЯ ORDER ==========
runner.test('Order: расчет без скидки', () => {
    const product = new Product('Ноутбук', 100000, 10, 'Электроника');
    const cart = new ShoppingCart('user_001');
    cart.addItem(product, 2);
    const order = new Order('user_001', cart, 0.0, false);
    if (order.baseTotal !== 200000) {
        throw new Error(`Ожидалось 200000, получено ${order.baseTotal}`);
    }
    if (order.deliveryCost !== 500) {
        throw new Error(`Ожидалось 500, получено ${order.deliveryCost}`);
    }
    if (order.totalAmount !== 200500) {
        throw new Error(`Ожидалось 200500, получено ${order.totalAmount}`);
    }
});

runner.test('Order: расчет со скидкой 10%', () => {
    const product = new Product('Ноутбук', 100000, 10, 'Электроника');
    const cart = new ShoppingCart('user_001');
    cart.addItem(product, 2);
    const order = new Order('user_001', cart, 0.10, false);
    if (order.discountAmount !== 20000) {
        throw new Error(`Ожидалось 20000, получено ${order.discountAmount}`);
    }
    if (order.totalAmount !== 180500) {
        throw new Error(`Ожидалось 180500, получено ${order.totalAmount}`);
    }
});

runner.test('Order: бесплатная доставка при сумме >= 3000', () => {
    const product = new Product('Ноутбук', 100000, 10, 'Электроника');
    const cart = new ShoppingCart('user_001');
    cart.addItem(product, 1);
    const order = new Order('user_001', cart, 0.0, false);
    if (order.deliveryCost !== 0) {
        throw new Error(`Ожидалось 0, получено ${order.deliveryCost}`);
    }
});

runner.test('Order: экспресс-доставка', () => {
    const product = new Product('Коврик', 500, 10, 'Аксессуары');
    const cart = new ShoppingCart('user_001');
    cart.addItem(product, 1);
    const order = new Order('user_001', cart, 0.0, true);
    if (order.deliveryCost !== 1000) {
        throw new Error(`Ожидалось 1000, получено ${order.deliveryCost}`);
    }
});

runner.test('Order: списание товаров при создании', () => {
    const product = new Product('Ноутбук', 100000, 10, 'Электроника');
    const cart = new ShoppingCart('user_001');
    cart.addItem(product, 2);
    const initialStock = product.stock;
    const order = new Order('user_001', cart);
    if (product.stock !== initialStock - 2) {
        throw new Error(`Ожидалось ${initialStock - 2}, получено ${product.stock}`);
    }
});

runner.test('Order: отмена заказа и возврат товаров', () => {
    const product = new Product('Ноутбук', 100000, 10, 'Электроника');
    const cart = new ShoppingCart('user_001');
    cart.addItem(product, 2);
    const initialStock = product.stock;
    const order = new Order('user_001', cart);
    order.cancel();
    if (product.stock !== initialStock) {
        throw new Error(`Ожидалось ${initialStock}, получено ${product.stock}`);
    }
    if (order.status !== 'cancelled') {
        throw new Error(`Ожидался статус 'cancelled', получен '${order.status}'`);
    }
});

runner.test('Order: смена статусов', () => {
    const product = new Product('Ноутбук', 100000, 10, 'Электроника');
    const cart = new ShoppingCart('user_001');
    cart.addItem(product, 1);
    const order = new Order('user_001', cart);
    
    order.confirmPayment();
    if (order.status !== 'paid') {
        throw new Error(`Ожидался 'paid', получен '${order.status}'`);
    }
    
    order.ship();
    if (order.status !== 'shipped') {
        throw new Error(`Ожидался 'shipped', получен '${order.status}'`);
    }
    
    order.deliver();
    if (order.status !== 'delivered') {
        throw new Error(`Ожидался 'delivered', получен '${order.status}'`);
    }
});

// Запуск всех тестов
runner.run();