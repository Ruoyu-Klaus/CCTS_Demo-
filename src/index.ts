import { ProjectStatus } from './utils/enum'
function AutoBind(_: any, _1: string, descriptor: PropertyDescriptor) {
  return {
    configurable: true,
    enumerable: false,
    get() {
      return descriptor.value.bind(this)
    },
  }
}

const validate = (obj: any, ValidateConfigs: ValidateConfigs) => {
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

const ValidateConfigs: ValidateConfigs = {}
function ValidateWith(validateConfig: ValidateConfig) {
  return function (_: any, proName: string) {
    ValidateConfigs[proName] = {
      ...ValidateConfigs[proName],
      ...validateConfig,
    }
  }
}

abstract class BaseState<T> {
  protected listeners: listenerFn<T>[] = []
  addListener(listenerFn: listenerFn<T>) {
    this.listeners.push(listenerFn)
  }
}

class Project {
  id: string
  title: string
  description: string
  people: number
  status: ProjectStatus
  constructor(
    id: string,
    title: string,
    description: string,
    people: number,
    status: ProjectStatus = ProjectStatus.ACTIVE
  ) {
    this.id = id
    this.title = title
    this.description = description
    this.people = people
    this.status = status
  }
}

class ProjectState extends BaseState<Project> {
  private projects: Project[] = []
  private static instance: ProjectState
  constructor() {
    super()
  }

  static getInstance(): ProjectState {
    if (this.instance) {
      return this.instance
    }
    this.instance = new ProjectState()
    return this.instance
  }

  addProject(title: string, description: string, people: number) {
    const project = new Project(
      Math.random().toString() + Date.now(),
      title,
      description,
      people
    )
    this.projects.push(project)
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice())
    }
  }

  getState() {
    return this.projects
  }
}

abstract class BaseComponent<T extends HTMLElement, U extends HTMLElement> {
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

const projectState = ProjectState.getInstance()

class ProjectInput extends BaseComponent<HTMLDivElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement
  descriptionInputElement: HTMLInputElement
  peopleInputElement: HTMLInputElement

  @ValidateWith({ required: true, maxLength: 20 })
  title: string = ''
  @ValidateWith({ required: true, maxLength: 100, minLength: 2 })
  description: string = ''
  @ValidateWith({ required: true, max: 20, min: 0 })
  people: number = 0

  validateConfigs: ValidateConfigs = {}

  constructor() {
    super('project-input', 'app', true, 'project-form')
    this.titleInputElement = this.targetElement.querySelector('#title')!
    this.descriptionInputElement =
      this.targetElement.querySelector('#description')!
    this.peopleInputElement = this.targetElement.querySelector('#people')!
    this.configure()
  }

  getInputValue(): [title: string, description: string, people: number] | void {
    const title: string = this.titleInputElement.value
    const description: string = this.descriptionInputElement.value
    const people: number = +this.peopleInputElement.value

    this.title = title
    this.description = description
    this.people = people

    if (!validate(this, ValidateConfigs)) {
      console.log(ValidateConfigs)
      throw new Error('Please enter correct value')
    }
    return [title, description, people]
  }
  clearInput() {
    this.titleInputElement.value = ''
    this.descriptionInputElement.value = ''
    this.peopleInputElement.value = ''
  }

  @AutoBind
  submitHandler(e: Event) {
    e.preventDefault()
    const project = this.getInputValue()
    project && projectState.addProject.apply(projectState, project)
    this.clearInput()
  }
  configure() {
    this.targetElement.addEventListener('submit', this.submitHandler)
  }
  renderContent() {}
}

class ProjectList extends BaseComponent<HTMLDivElement, HTMLElement> {
  projectStatus: ProjectStatus
  projects: Project[] = []

  constructor(projectStatus: ProjectStatus) {
    super('project-list', 'app', false, 'projectLists')
    this.projectStatus = projectStatus
    this.configure()
  }

  configure(): void {
    const title = this.targetElement.querySelector(
      'header > h2'
    )! as HTMLTitleElement
    title.innerText = this.projectStatus + ' ' + 'PROJECTS'

    projectState.addListener((items: Project[]) => {
      this.projects = items.filter(item => item.status === this.projectStatus)
      this.renderContent()
    })
  }
  renderContent(): void {
    const list = this.targetElement.querySelector('ul')! as HTMLUListElement
    list.innerHTML = ''
    this.projects.forEach(project => {
      const li = document.createElement('li')
      li.innerText = `${project.title} + ${project.description} + ${project.people}`
      list.appendChild(li)
    })
  }
}

new ProjectInput()
new ProjectList(ProjectStatus.ACTIVE)
new ProjectList(ProjectStatus.DONE)
