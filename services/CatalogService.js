/**
 * Сервис для управления каталогом товаров
 * Поиск, фильтрация, сортировка
 */

export class CatalogService {
    constructor() {
        this.products = new Map(); // Map<id, Product>
    }

    /**
     * Добавляет товар в каталог
     * @param {Product} product 
     */
    addProduct(product) {
        this.products.set(product.id, product);
    }

    /**
     * Возвращает товар по ID
     * @param {string} productId 
     * @returns {Product|null}
     */
    getProduct(productId) {
        return this.products.get(productId) || null;
    }

    /**
     * Возвращает все товары
     * @returns {Product[]}
     */
    getAllProducts() {
        return Array.from(this.products.values());
    }

    /**
     * Поиск товаров по категории
     * @param {string} category 
     * @returns {Product[]}
     */
    findByCategory(category) {
        return this.getAllProducts().filter(
            p => p.category.toLowerCase() === category.toLowerCase()
        );
    }

    /**
     * Поиск по названию или описанию
     * @param {string} query 
     * @returns {Product[]}
     */
    search(query) {
        const q = query.toLowerCase();
        return this.getAllProducts().filter(
            p => p.name.toLowerCase().includes(q) || 
                 p.description.toLowerCase().includes(q)
        );
    }

    /**
     * Фильтрация по диапазону цен
     * @param {number} minPrice 
     * @param {number} maxPrice 
     * @returns {Product[]}
     */
    getProductsByPriceRange(minPrice, maxPrice) {
        return this.getAllProducts().filter(
            p => p.price >= minPrice && p.price <= maxPrice
        );
    }

    /**
     * Сортировка товаров по цене
     * @param {'asc'|'desc'} direction 
     * @returns {Product[]}
     */
    sortByPrice(direction = 'asc') {
        const products = this.getAllProducts();
        return products.sort((a, b) => {
            return direction === 'asc' ? a.price - b.price : b.price - a.price;
        });
    }

    /**
     * Сортировка по названию
     * @param {'asc'|'desc'} direction 
     * @returns {Product[]}
     */
    sortByName(direction = 'asc') {
        const products = this.getAllProducts();
        return products.sort((a, b) => {
            return direction === 'asc' 
                ? a.name.localeCompare(b.name) 
                : b.name.localeCompare(a.name);
        });
    }
}