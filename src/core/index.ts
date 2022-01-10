export abstract class BaseComponent<
  T extends HTMLElement,
  U extends HTMLElement
> {
  protected templateElement: HTMLTemplateElement
  protected hookElement: T
  protected targetElement: U
  constructor(
    templateId: string,
    hookElementId: string,
    insertBegin: boolean = true,
    targetId?: string
  ) {
    this.templateElement = document.getElementById(
      templateId
    )! as HTMLTemplateElement
    this.hookElement = document.getElementById(hookElementId)! as T

    const importedNode = document.importNode(this.templateElement.content, true)
    this.targetElement = importedNode.firstElementChild as U
    if (targetId) {
      this.targetElement.id = targetId
    }
    this.renderTargetElement(insertBegin)
  }
  private renderTargetElement(insertBegin: boolean) {
    this.hookElement.insertAdjacentElement(
      insertBegin ? 'afterbegin' : 'beforeend',
      this.targetElement
    )
  }
  abstract configure(): void
  abstract renderContent(): void
}

export abstract class BaseState<T> {
  protected listeners: listenerFn<T>[] = []

  addListener(listenerFn: listenerFn<T>) {
    this.listeners.push(listenerFn)
  }

  abstract add(payload: Partial<T>): void

  abstract getState(): T | Array<T>
}

export const validate = (obj: any, ValidateConfigs: ValidateConfigs) => {
  if (!ValidateConfigs) return true
  let isValid = true
  for (const propName in ValidateConfigs) {
    const requirements = ValidateConfigs[propName]
    const value = obj[propName]
    const { required, maxLength, minLength, max, min } = requirements
    if (required && !obj[propName]) {
      ValidateConfigs[propName] = {
        ...ValidateConfigs[propName],
        error: 'Not empty',
      }
      isValid = false
    }
    if (typeof value === 'string') {
      if (typeof maxLength === 'number' && value.length > maxLength) {
        ValidateConfigs[propName] = {
          ...ValidateConfigs[propName],
          error: 'Too Long',
        }
        isValid = false
      }
      if (typeof minLength === 'number' && value.length < minLength) {
        ValidateConfigs[propName] = {
          ...ValidateConfigs[propName],
          error: 'Too Short',
        }

        isValid = false
      }
    }
    if (typeof value === 'number') {
      if (typeof max === 'number' && value > max) {
        ValidateConfigs[propName] = {
          ...ValidateConfigs[propName],
          error: 'Bigger than Maximum number',
        }
        isValid = false
      }
      if (typeof min === 'number' && value < min) {
        ValidateConfigs[propName] = {
          ...ValidateConfigs[propName],
          error: 'Lower than Minimum number',
        }
        isValid = false
      }
    }
  }
  return isValid
}
