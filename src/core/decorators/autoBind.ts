export function AutoBind(_: any, _1: string, descriptor: PropertyDescriptor) {
  return {
    configurable: true,
    enumerable: false,
    get() {
      return descriptor.value.bind(this)
    },
  }
}
export default AutoBind
