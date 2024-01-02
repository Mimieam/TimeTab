// Mini Framework
export class MiniReactivityFramework {
    constructor(data) {
        this.data = data;
        this.elements = {};
        this.elementsUpdaters = {}

        // Creating a proxy to observe changes in data
        this.proxy = new Proxy(this.data, {
            set: (target, key, value) => {
                target[key] = value;
                this.updateDOM(key);
                return true;
            }
        });
    }

    // Method to bind an element to a property in the data
    bind(key, element, ) {
        this.elements[key] = element;
        element.addEventListener('input', () => {
            this.proxy[key] = element.value;
        });
        this.updateDOM(key); 
    }

    // Method to update the DOM element
    updateDOM(key) {
        console.log(`- key ${key} changed!`)
        const element = this.elements[key];
        if (element) {
            element.value = this.data[key]; 
        }
    }
}
//
//const button = createElement('button', { onclick: increment }, ['Increment']);
//const text = createElement('p', {}, [`Count: ${reactiveSystem.data.count}`]);
//
//return createElement('div', {}, [button, text]);
//
//// Example usage:
//const data = {
//    name: 'John Doe',
//    age: 30
//};
//
//const miniFramework = new MiniReactivityFramework(data);
//
//// Binding DOM elements to data properties
//const nameInput = document.getElementById('nameInput');
//const ageInput = document.getElementById('ageInput');
//
//miniFramework.bind('name', nameInput);
//miniFramework.bind('age', ageInput);


//
//
//class Data {
//    constructor() {
//        this.message = 'Hello, world!';
//        this.count = 0;
//    }
//
//    increment() {
//        this.count++;
//    }
//}
//
//export class MiniReactivityFramework {
//    constructor(data, renderCallback) {
//        this.data = this.reactive(data);
//        this.render = renderCallback;
//        this.init();
//    }
//
//    reactive(obj) {
//        return new Proxy(obj, {
//            set: (target, key, value) => {
//                target[key] = value;
//                this.render();
//                return true;
//            }
//        });
//    }
//
//    init() {
//        this.render();
//        this.setupEventListeners();
//    }
//
//    setupEventListeners() {
//        const button = document.getElementById('incrementBtn');
//        if (button) {
//            button.addEventListener('click', () => this.data.increment());
//        }
//    }
//}
//
//const app = document.getElementById('app');
//
//function render() {
//    app.innerHTML = `
//        <div>
//            <h1>${simpleReactive.data.message}</h1>
//            <p>Count: ${simpleReactive.data.count}</p>
//            <button id="incrementBtn">Increment Count</button>
//        </div>
//    `;
//    simpleReactive.setupEventListeners(); // Re-establish event listeners after re-rendering
//}
//
//const dataInstance = new Data();
//const simpleReactive = new SimpleReactive(dataInstance, render);
//
//
////
//
//
//
//
class VNode {
    constructor(tag, props, children) {
        this.tag = tag;
        this.props = props;
        this.children = children;
    }

    render() {
        const element = document.createElement(this.tag);

        for (const [key, value] of Object.entries(this.props)) {
            element.setAttribute(key, value);
        }

        if (Array.isArray(this.children)) {
            this.children.forEach(child => {
                const childElement = child instanceof VNode ? child.render() : document.createTextNode(child);
                element.appendChild(childElement);
            });
        }

        return element;
    }
}

function createElement(tag, props, children) {
    return new VNode(tag, props, children);
}

class ReactiveSystem {
    constructor(data) {
        this.data = new Proxy(data, {
            set: (target, property, value) => {
                target[property] = value;
                this.updateDOM();
                return true;
            }
        });

        this.components = [];
    }

    updateDOM() {
        const root = document.getElementById('app');
        root.innerHTML = '';
        this.components.forEach(component => {
            const newNode = component.render();
            root.appendChild(newNode);
        });
    }

    mount(component) {
        this.components.push(component);
        this.updateDOM();
    }
}

function Counter() {
    let count = 0;

    function increment() {
        reactiveSystem.data.count++;
    }

    const button = createElement('button', { onclick: increment }, ['Increment']);
    const text = createElement('p', {}, [`Count: ${reactiveSystem.data.count}`]);

    return createElement('div', {}, [button, text]);
}

const reactiveSystem = new ReactiveSystem({ count: 0 });
reactiveSystem.mount(Counter());

//

//
//const Component = {
//    state: {
//        count: 0,
//    },
//    template: `
//    <div>
//      <h2>Counter: <span id="countDisplay">${this.state.count}</span></h2>
//      <button onclick="Component.methods.increment()">Increment</button>
//    </div>
//  `,
//    methods: {
//        increment() {
//            this.state.count++;
//            this.update();
//        },
//        update() {
//            const app = document.getElementById('app');
//            app.innerHTML = this.template;
//        },
//        bind(key, element,) {
//            this.elements[key] = element;
//            element.addEventListener('input', () => {
//                this.proxy[key] = element.value;
//            });
//            this.updateDOM(key);
//        }
//    },
//};
//
//function mount(component, elementId) {
//    const app = document.getElementById(elementId);
//    app.innerHTML = component.template;
//    component.bind()
//    component.update();
//}
//
//// Mount the component
//mount(Component, 'app');
