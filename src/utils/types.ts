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

enum ProjectStatus {
  ACTIVE = 'ACTIVE',
  DONE = 'DONE',
}
