const SINGLETON_KEY = Symbol()

interface constructor {
  new (...args: any[]): any
}

type Singleton<T extends constructor> = T & {
  [SINGLETON_KEY]: T extends new (...args: any[]) => infer I ? I : never
}

export function Singleton<T extends constructor>(originalConstructor: T) {
  return new Proxy(originalConstructor, {
    // this will hijack the constructor
    construct(target: Singleton<T>, argsList, newTarget) {
      // we should skip the proxy for children of our target class
      if (target.prototype !== newTarget.prototype) {
        return Reflect.construct(target, argsList, newTarget)
      }
      // if our target class does not have an instance, create it
      if (!target[SINGLETON_KEY]) {
        target[SINGLETON_KEY] = Reflect.construct(target, argsList, newTarget)
      }
      // return the instance we created!
      return target[SINGLETON_KEY]
    },
  })
}

export default Singleton
