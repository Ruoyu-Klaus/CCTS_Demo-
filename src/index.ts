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
}
@Singleton
export class ProjectState extends BaseState<Project> {
  private projects: Project[] = []

  constructor() {
    super()
  }

  add(payload: Partial<Project>) {
    const { title, description, people } = payload
    if (title && description && people) {
      const project = new ProjectImplementation(
        Math.random().toString() + Date.now(),
        title,
        description,
        people
      )
      this.projects.push(project)
    } else {
      return
    }
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
