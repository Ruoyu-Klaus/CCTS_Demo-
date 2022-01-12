import { BaseComponent } from '../core/index'

export default class ProjectItem extends BaseComponent<
  HTMLUListElement,
  HTMLLIElement
> {
  private _project: Project

  constructor(hookElementId: string, project: Project) {
    super('single-project', hookElementId, false, project.id)
    this._project = project
    this.configure()
    this.renderContent()
  }
  configure() {}
  renderContent() {
    this.targetElement.querySelector('h2')!.textContent = this._project.title
    this.targetElement.querySelector('h3')!.textContent =
      this._project.people.toString()
    this.targetElement.querySelector('p')!.textContent =
      this._project.description
  }
}
