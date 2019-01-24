// 1

/**
 * addItemInfoDecorator - добавляет в возвращаемый методом объект поля date - дата создания объекта;
 *      info - информациб о объекте
 * @param {object} target - прототип класса
 * @param {string} method - имя метода
 * @param {PropertyDescriptor} descriptor - дискриптор метода
 *      1. Генерирует переменную date и записывает в нее дату вызова метода;
 *      2. Забирает реализацию метода;
 *      3. Связывает значение контакта дескриптора с контекстом метода;
 *      4. Добавляет поля в позвращаемый методом объект и возвращает его.
 */
function addItemInfoDecorator(target: Object, method: string, descriptor: PropertyDescriptor): object {
    let date: object = new Date();
    let originalFunc: any = descriptor.value;

    descriptor.value = function () {
        let origResult: any = originalFunc.apply(this);
        
        origResult.info = this.name + " - " + this.price;
        origResult.date = date;

        return origResult;
    }

    return descriptor;
}

class Item {
    public price: number;
    public name: string;

    constructor(name: string ,price: number) {
        this.name = name;
        this.price = price;
    }

    @addItemInfoDecorator
    public getItemInfo() {
        return {
            name: this.name, 
            price: this.price
        };
    }
}

let item = new Item('Apple', 100);
console.log(item);
console.log(item.getItemInfo());

// 2

/**
 * addOptionsDecorator - добавляет в класс поля type и createClass
 * @param {string} type - тип пользователя
 * @returns {Object} - функция, которая добавляет в класс поля type и createClass:
 *      1. Генерирует переменную, в которую записывает дату создания класса;
 *      2. Возвращает конструктор класса, в который записывает переданное значение типа и дату.
 */
function addOptionsDecorator(type: string) {
    return function (targetClass) {
        let date: any = new Date();

        return class {
            public type: string = type;
            public createDate: string = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
        }
    }
}

@addOptionsDecorator("admin")
class User{}

// 3

// News api USA
namespace NewsUSA {

    export interface INews {
        id: number;
        title: string;
        text: string;
        author: string;
    }

    export class NewsService {
        protected apiurl: string = 'https://news_api_usa_url'
        public getNews(): void {} // method
    }
}

// News api Ukraine
namespace NewsUkraine {
    
    export interface INews {
        uuid: string;
        title: string;
        body: string;
        author: string;
        date: string;
        imgUrl: string;
    }

    export class NewsService {
        protected apiurl: string = 'https://news_api_2_url'
        public getNews(): void {} // method get all news
        public addToFavorite(): void {} // method add to favorites
    }
}

// 4

class Junior {
    public doTasks(): void {
        console.log('Actions!!!');
    }
}

class Middle {
    public createApp(): void {
        console.log('Creating!!!');
    }
}

class Senior implements Junior, Middle {
    public doTasks(): void {};
    public createApp():void {};
    
    public createArchitecture(): void {
        console.log('Architecture was created!');
    }
}

applyMixins(Senior, [Junior, Middle]);

/**
 * applyMixins - перебирает по одному базовые классы, из их прототипов достает реализации методов
 *               по ключам и присваеивает их в методы целевого класса
 * @param targetClasss - класс, к которому применяется mixin
 * @param baseClasses - массив классов
 */
function applyMixins(targetClasss: any, baseClasses: any[]) {
    baseClasses.forEach((baseClass) => {
        Object.getOwnPropertyNames(baseClass.prototype).forEach((propName) => {
            targetClasss.prototype[propName] = baseClass.prototype[propName];
        });
    });
}