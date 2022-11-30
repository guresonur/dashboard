import { History } from '../cicdHistory/types'
import { CIMaterial } from '../triggerView/ciMaterial'

export interface CIPipeline {
    name: string
    id: number
    parentCiPipeline: number
    parentAppId: number
    pipelineType: string
}
export interface BuildDetails {
  triggerHistory: Map<number, History>
  fullScreenView: boolean
  synchroniseState: (triggerId: number, triggerDetails: History) => void
  isSecurityModuleInstalled: boolean
  isBlobStorageConfigured: boolean
}