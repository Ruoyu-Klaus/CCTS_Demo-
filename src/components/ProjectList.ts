import { BaseComponent } from '../core/index'
import { ProjectStatus } from '../utils/enum'
import { ProjectState } from '../index'

export default class ProjectList extends BaseComponent<
  HTMLDivElement,
  HTMLElement
> {
  projectStatus: ProjectStatus
  projects: Project[] = []

  projectState: ProjectState

  constructor(projectState: ProjectState, projectStatus: ProjectStatus) {
    super('project-list', 'app', false, 'projectLists')
    this.projectStatus = projectStatus
    this.projectState = projectState
    this.configure()
  }

  configure(): void {
    const title = this.targetElement.querySelector(
      'header > h2'
    )! as HTMLTitleElement
    title.innerText = this.projectStatus + ' ' + 'PROJECTS'

    this.projectState.addListener((items: Project[]) => {
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
