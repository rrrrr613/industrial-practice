/**
 * Главный модуль для демонстрации работы интернет-магазина
 * Запуск: npm start
 */

import { Product } from './models/Product.js';
import { ShoppingCart } from './models/ShoppingCart.js';
import { Order } from './models/Order.js';
import { CatalogService } from './services/CatalogService.js';

/**
 * Вспомогательная функция для красивого вывода
 */
function printSection(title) {
    console.log('\n' + '='.repeat(60));
    console.log(`  ${title}`);
    console.log('='.repeat(60));
}

/**
 * Вспомогательная функция для вывода JSON
 */
function printJSON(data) {
    console.log(JSON.stringify(data, null, 2));
}

/**
 * Основная демонстрация
 */
function demoShop() {
    console.clear();
    printSection('ИНТЕРНЕТ-МАГАЗИН - ДЕМОНСТРАЦИЯ РАБОТЫ (Node.js)');

    // ========== 1. СОЗДАНИЕ КАТАЛОГА ==========
    const catalog = new CatalogService();

    // Создаем товары
    const product1 = new Product(
        'Ноутбук ASUS ROG Zephyrus',
        129999.00,
        5,
        'Электроника',
        'Мощный игровой ноутбук с RTX 4080'
    );

    const product2 = new Product(
        'Мышь Logitech G502 X',
        5990.00,
        20,
        'Аксессуары',
        'Игровая мышь с подсветкой и 10 программируемыми кнопками'
    );

    const product3 = new Product(
        'Коврик для мыши Razer Goliathus',
        1500.00,
        50,
        'Аксессуары',
        'Большой коврик с подсветкой Chroma RGB'
    );

    const product4 = new Product(
        'Монитор LG UltraGear 27"',
        45990.00,
        8,
        'Электроника',
        '27-дюймовый монитор с частотой 240 Гц'
    );

    // Добавляем в каталог
    catalog.addProduct(product1);
    catalog.addProduct(product2);
    catalog.addProduct(product3);
    catalog.addProduct(product4);

    console.log('\n✅ Каталог создан. Доступные товары:');
    catalog.getAllProducts().forEach(p => {
        console.log(`  - ${p.name}: ${p.price.toFixed(2)} руб. (в наличии: ${p.stock} шт.)`);
    });

    // ========== 2. ПОИСК И ФИЛЬТРАЦИЯ ==========
    printSection('ПОИСК И ФИЛЬТРАЦИЯ');

    console.log('\n🔍 Поиск по запросу "мышь":');
    catalog.search('мышь').forEach(p => {
        console.log(`  - ${p.name} (${p.category})`);
    });

    console.log('\n🏷️ Фильтр по категории "Электроника":');
    catalog.findByCategory('Электроника').forEach(p => {
        console.log(`  - ${p.name} - ${p.price.toFixed(2)} руб.`);
    });

    console.log('\n💰 Фильтр по цене (от 1000 до 10000 руб.):');
    catalog.getProductsByPriceRange(1000, 10000).forEach(p => {
        console.log(`  - ${p.name} - ${p.price.toFixed(2)} руб.`);
    });

    console.log('\n📊 Сортировка по цене (возрастание):');
    catalog.sortByPrice('asc').forEach(p => {
        console.log(`  - ${p.name}: ${p.price.toFixed(2)} руб.`);
    });

    // ========== 3. РАБОТА С КОРЗИНОЙ ==========
    printSection('РАБОТА С КОРЗИНОЙ');

    const userId = 'user_001';
    const cart = new ShoppingCart(userId);

    console.log(`\n👤 Покупатель: ${userId}`);
    console.log('\nДобавляем товары в корзину:');

    try {
        cart.addItem(product1, 1);
        console.log(`  ✅ Добавлен: ${product1.name} x1`);

        cart.addItem(product2, 2);
        console.log(`  ✅ Добавлен: ${product2.name} x2`);

        cart.addItem(product3, 3);
        console.log(`  ✅ Добавлен: ${product3.name} x3`);

        console.log(`\n📦 Корзина (сумма: ${cart.getBaseTotal().toFixed(2)} руб.):`);
        cart.items.forEach(item => {
            console.log(`  - ${item.product.name} x${item.quantity} = ${item.getTotalPrice().toFixed(2)} руб.`);
        });

        // ========== 4. ОФОРМЛЕНИЕ ЗАКАЗА ==========
        printSection('ОФОРМЛЕНИЕ ЗАКАЗА');

        console.log('\nСоздаем заказ со скидкой 10% и обычной доставкой...');

        const order = new Order(
            userId,
            cart,
            0.10,   // 10% скидка
            false,  // Обычная доставка
            'г. Москва, ул. Тверская, д. 1'
        );

        console.log('\n✅ Заказ создан:');
        printJSON(order.toDict());

        // ========== 5. ПРОВЕРКА ОСТАТКОВ ==========
        printSection('ПРОВЕРКА ОСТАТКОВ ПОСЛЕ ЗАКАЗА');

        console.log(`\n📊 Остаток ноутбуков: ${product1.stock} шт. (было 5, заказано 1)`);
        console.log(`📊 Остаток мышей: ${product2.stock} шт. (было 20, заказано 2)`);
        console.log(`📊 Остаток ковриков: ${product3.stock} шт. (было 50, заказано 3)`);

        // ========== 6. ОТМЕНА ЗАКАЗА ==========
        printSection('ОТМЕНА ЗАКАЗА');

        console.log('\nОтменяем заказ...');
        order.cancel();
        console.log('✅ Заказ отменен. Товары возвращены на склад.');

        console.log(`\n📊 Остаток ноутбуков после отмены: ${product1.stock} шт.`);
        console.log(`📊 Остаток мышей после отмены: ${product2.stock} шт.`);

        // ========== 7. ИЗМЕНЕНИЕ СТАТУСОВ ==========
        printSection('УПРАВЛЕНИЕ СТАТУСАМИ ЗАКАЗА');

        // Создаем новый заказ для демонстрации статусов
        const cart2 = new ShoppingCart(userId);
        cart2.addItem(product4, 1);
        const order2 = new Order(userId, cart2, 0.05, true, 'г. Санкт-Петербург, Невский пр., д. 10');

        console.log('\n📋 Создан новый заказ (экспресс-доставка):');
        console.log(`  - Сумма: ${order2.totalAmount.toFixed(2)} руб.`);
        console.log(`  - Статус: ${order2.status}`);

        console.log('\n🔄 Меняем статусы:');
        order2.confirmPayment();
        console.log(`  - Подтверждена оплата: ${order2.status}`);

        order2.ship();
        console.log(`  - Отправлен: ${order2.status}`);

        order2.deliver();
        console.log(`  - Доставлен: ${order2.status}`);

        // ========== 8. ОБРАБОТКА ИСКЛЮЧЕНИЙ ==========
        printSection('ОБРАБОТКА ИСКЛЮЧЕНИЙ');

        console.log('\nПопытка добавить больше товара, чем есть в наличии:');
        try {
            cart.addItem(product1, 10);
        } catch (error) {
            console.log(`  ❌ Ошибка: ${error.message}`);
        }

        console.log('\nПопытка отменить уже доставленный заказ:');
        try {
            order2.cancel();
        } catch (error) {
            console.log(`  ❌ Ошибка: ${error.message}`);
        }

        console.log('\nПопытка отрицательного количества:');
        try {
            cart.addItem(product1, -5);
        } catch (error) {
            console.log(`  ❌ Ошибка: ${error.message}`);
        }

        // ========== 9. ИТОГОВАЯ ИНФОРМАЦИЯ ==========
        printSection('ИТОГОВАЯ ИНФОРМАЦИЯ');

        console.log('\n📋 Текущее состояние каталога:');
        catalog.getAllProducts().forEach(p => {
            console.log(`  - ${p.name}: ${p.stock} шт.`);
        });

        console.log(`\n📋 Текущее состояние корзины (${userId}):`);
        if (!cart.isEmpty()) {
            console.log(`  - Количество позиций: ${cart.items.length}`);
            console.log(`  - Общее количество товаров: ${cart.getTotalItems()}`);
            console.log(`  - Сумма: ${cart.getBaseTotal().toFixed(2)} руб.`);
        } else {
            console.log('  - Корзина пуста');
        }

        console.log('\n' + '='.repeat(60));
        console.log('  ДЕМОНСТРАЦИЯ ЗАВЕРШЕНА');
        console.log('='.repeat(60) + '\n');

    } catch (error) {
        console.error(`\n❌ Критическая ошибка: ${error.message}`);
        console.error(error.stack);
    }
}

// Запуск демонстрации
demoShop();