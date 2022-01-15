// state
type listenerFn<T> = (items: T[]) => void

// validation
type ValidateConfig = {
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  error?: string
}

interface ValidateConfigs {
  [propName: string]: ValidateConfig
}

interface Project {
  id: string
  title: string
  description: string
  people: number
  status: ProjectStatus
}

interface Draggable {
  dragStartHandler: (event: DragEvent) => void
  dragEndHandler: (event: DragEvent) => void
}
interface DragTarget {
  dragOverHandler: (event: DragEvent) => void
  dropHandler: (event: DragEvent) => void
  dragLeaveHandler: (event: DragEvent) => void
}

enum ProjectStatus {
  ACTIVE = 'ACTIVE',
  DONE = 'DONE',
}
