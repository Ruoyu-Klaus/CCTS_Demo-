import { ProjectStatus } from './utils/enum'
import { BaseState } from './core/index'
import ProjectInput from './components/ProjectInput'
import ProjectList from './components/ProjectList'
import { Singleton } from './core/decorators/singleton'

class ProjectImplementation implements Project {
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

  update(values: Partial<Project>) {
    Object.assign(this, { ...values })
  }
}
@Singleton
export class ProjectState extends BaseState<Project> {
  private projects: ProjectImplementation[] = []

  constructor() {
    super()
  }

  add(payload: Partial<Project>) {
    const { title, description, people } = payload
    if (!title || !description || !people) {
      return
    }
    const project = new ProjectImplementation(
      Math.random().toString() + Date.now(),
      title,
      description,
      people,
      ProjectStatus.ACTIVE
    )
    this.projects.push(project)
    this._executeListeners()
  }

  update(payload: Partial<Project>) {
    const { id, ...rest } = payload
    const project = this.projects.find(p => p.id === id)
    if (project) {
      project.update(rest)
    }
    this._executeListeners()
  }

  private _executeListeners() {
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice())
    }
  }

  getState() {
    return this.projects
  }
}
const projectState = new ProjectState()

new ProjectInput(projectState)
new ProjectList(projectState, ProjectStatus.ACTIVE)
new ProjectList(projectState, ProjectStatus.DONE)
