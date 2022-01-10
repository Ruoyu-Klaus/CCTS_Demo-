import AutoBind from '../core/decorators/autoBind'
import { BaseComponent, validate } from '../core/index'
import { ProjectState } from '../index'

const ValidateConfigs: ValidateConfigs = {}
function ValidateWith(validateConfig: ValidateConfig) {
  return function (_: any, proName: string) {
    ValidateConfigs[proName] = {
      ...ValidateConfigs[proName],
      ...validateConfig,
    }
  }
}

export default class ProjectInput extends BaseComponent<
  HTMLDivElement,
  HTMLFormElement
> {
  titleInputElement: HTMLInputElement
  descriptionInputElement: HTMLInputElement
  peopleInputElement: HTMLInputElement

  projectState: ProjectState

  @ValidateWith({ required: true, maxLength: 20 })
  title: string = ''
  @ValidateWith({ required: true, maxLength: 100, minLength: 2 })
  description: string = ''
  @ValidateWith({ required: true, max: 20, min: 0 })
  people: number = 0

  validateConfigs: ValidateConfigs = {}

  constructor(projectState: ProjectState) {
    super('project-input', 'app', true, 'project-form')
    this.projectState = projectState
    this.titleInputElement = this.targetElement.querySelector('#title')!
    this.descriptionInputElement =
      this.targetElement.querySelector('#description')!
    this.peopleInputElement = this.targetElement.querySelector('#people')!
    this.configure()
  }

  getInputValue(): Partial<Project> | void {
    const title: string = this.titleInputElement.value
    const description: string = this.descriptionInputElement.value
    const people: number = +this.peopleInputElement.value

    this.title = title
    this.description = description
    this.people = people

    if (!validate(this, ValidateConfigs)) {
      console.log('Please enter correct value')
      return
    }
    return { title, description, people }
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
    project && this.projectState.add.call(this.projectState, project)
    this.clearInput()
  }

  configure() {
    this.targetElement.addEventListener('submit', this.submitHandler)
  }
  renderContent() {}
}
