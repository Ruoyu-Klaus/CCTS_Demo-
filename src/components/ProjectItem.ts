import { BaseComponent } from '../core/index'
import AutoBind from '../core/decorators/autoBind'

export default class ProjectItem
  extends BaseComponent<HTMLUListElement, HTMLLIElement>
  implements Draggable
{
  private _project: Project

  constructor(hookElementId: string, project: Project) {
    super('single-project', hookElementId, false, project.id)
    this._project = project
    this.configure()
    this.renderContent()
  }
  configure() {
    this.targetElement.setAttribute('draggable', 'true')
    this.targetElement.addEventListener('dragstart', this.dragStartHandler)
    this.targetElement.addEventListener('dragend', this.dragEndHandler)
  }
  renderContent() {
    this.targetElement.querySelector('h2')!.textContent = this._project.title
    this.targetElement.querySelector('h3')!.textContent =
      this._project.people.toString()
    this.targetElement.querySelector('p')!.textContent =
      this._project.description
  }

  @AutoBind
  dragStartHandler(event: DragEvent) {
    event.dataTransfer?.setData('text/plain', this._project.id)
    event.dataTransfer!.effectAllowed = 'move'
  }
  @AutoBind
  dragEndHandler(_: DragEvent) {
    console.log('end')
  }
}
