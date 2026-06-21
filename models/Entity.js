/**
 * Базовый абстрактный класс Entity
 * Реализует принцип наследования и полиморфизма
 */

import crypto from 'crypto';

export class Entity {
    /**
     * @param {string|null} uid - Уникальный идентификатор
     */
    constructor(uid = null) {
        this.id = uid || crypto.randomUUID();
    }

    /**
     * Абстрактный метод для сериализации объекта
     * Должен быть переопределен в наследниках
     * @throws {Error} Если метод не переопределен
     */
    toDict() {
        throw new Error('Метод toDict() должен быть переопределен в наследнике');
    }
}