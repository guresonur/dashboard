import { Routes } from '../../config'
import { get } from '../../services/api'
import { ResourceListListResponse } from './Types'

export const getKindList = (): Promise<ResourceListListResponse> => {
    return get(Routes.MANIFEST)
}

export const getResourceList = (clusterId: string): Promise<ResourceListListResponse> => {
    return Promise.resolve({
        code: 200,
        status: 'true',
        result: [
            {
                name: 'string',
                status: 'string',
                namespace: 'string',
                age: 'string',
                ready: 'string',
                restarts: 'string',
            },
        ],
    })
    return get(`${Routes.MANIFEST}/${clusterId}`)
}
