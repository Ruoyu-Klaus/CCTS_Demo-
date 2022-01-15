import { BaseComponent } from '../core/index'
import { ProjectStatus } from '../utils/enum'
import { ProjectState } from '../index'
import ProjectItem from './ProjectItem'
import AutoBind from '../core/decorators/autoBind'

export default class ProjectList
  extends BaseComponent<HTMLDivElement, HTMLElement>
  implements DragTarget
{
  projectStatus: ProjectStatus
  projects: Project[] = []

  projectState: ProjectState

  constructor(projectState: ProjectState, projectStatus: ProjectStatus) {
    super(
      'project-list',
      'app',
      false,
      projectStatus === ProjectStatus.ACTIVE
        ? 'projectLists'
        : 'finished-projects'
    )
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

    this.targetElement.addEventListener('dragover', this.dragOverHandler)
    this.targetElement.addEventListener('drop', this.dropHandler)
    this.targetElement.addEventListener('dragleave', this.dragLeaveHandler)
  }
  renderContent(): void {
    const list = this.targetElement.querySelector('ul')! as HTMLUListElement
    const listId = this.projectStatus + '-ul'
    list.id = listId
    list.innerHTML = ''
    this.projects.forEach(project => {
      new ProjectItem(listId, project)
    })
  }

  @AutoBind
  dragOverHandler(event: DragEvent) {
    if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
      event.preventDefault()
      const listElement = this.targetElement.querySelector(
        'ul'
      )! as HTMLUListElement
      listElement.classList.add('droppable')
    }
  }
  @AutoBind
  dropHandler(event: DragEvent) {
    const projectId = event.dataTransfer?.getData('text/plain')
    const status =
      this.projectStatus === ProjectStatus.ACTIVE
        ? ProjectStatus.ACTIVE
        : ProjectStatus.DONE
    this.projectState.update({ id: projectId, status })
  }
  @AutoBind
  dragLeaveHandler(event: DragEvent) {
    const listElement = this.targetElement.querySelector(
      'ul'
    )! as HTMLUListElement
    listElement.classList.remove('droppable')
  }
}
