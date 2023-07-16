import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Progressing, showError } from '@devtron-labs/devtron-fe-common-lib'
import { getAppChartRefForAppAndEnv } from '../../../services/service'
import { DOCUMENTATION } from '../../../config'
import { ConfigMapSecretContainer } from '../ConfigMapSecret.components'
import InfoIconWithTippy from '../InfoIconWithTippy'
import { getConfigMapList } from '../service'
import './ConfigMap.scss'
import { ConfigMapListProps } from '../Types'
import { ComponentStates } from '../../EnvironmentOverride/EnvironmentOverrides.type'

export default function ConfigMapList({ isOverrideView, parentState, setParentState }: ConfigMapListProps) {
    const { appId, envId } = useParams<{ appId; envId }>()
    const [configMap, setConfigMap] = useState<{ id: number; configData: any[]; appId: number }>()
    const [configMapLoading, setConfigMapLoading] = useState(true)
    const [appChartRef, setAppChartRef] = useState<{ id: number; version: string; name: string }>()

    useEffect(() => {
        init(true)
    }, [appId])

    async function init(isInit?: boolean) {
        try {
            const [{ result: appChartRefRes }, { result: configMapRes }] = await Promise.all([
                isInit ? getAppChartRefForAppAndEnv(appId, envId) : { result: null },
                getConfigMapList(appId, envId),
            ])
            setConfigMap({
                appId: configMapRes.appId,
                id: configMapRes.id,
                configData: configMapRes.configData || [],
            })
            if (appChartRefRes) {
                setAppChartRef(appChartRefRes)
            }
            setParentState && setParentState(ComponentStates.loaded)
        } catch (error) {
            setParentState && setParentState(ComponentStates.failed)
            showError(error)
        } finally {
            setConfigMapLoading(false)
        }
    }

    function update(index, result) {
        if (!index && !result) {
            init()
            return
        }
        try {
          setConfigMap((list) => {
                let configData = list.configData
                if (result === null) {
                    //delete
                    configData.splice(index, 1)
                    list.configData = [...configData]
                    return { ...list }
                } else if (typeof index !== 'number' && Array.isArray(result.configData)) {
                    //insert after create success
                    configData.unshift({
                        ...result.configData[0],
                        data: result.configData[0].data,
                    })
                    list.configData = [...configData]
                    return { ...list }
                } else {
                    list.configData[index] = {
                        ...list.configData[index],
                        data: result.configData[0].data,
                    }
                    return { ...list }
                }
            })
        } catch (err) {}
    }

    if (parentState === ComponentStates.loading || !configMap || configMapLoading)
        return <Progressing fullHeight size={48} styles={{ height: 'calc(100% - 80px)' }} />

    return (
        <div className={!isOverrideView ? 'form__app-compose' : ''}>
            {!isOverrideView && (
                <h1 data-testid="configmaps-heading" className="form__title form__title--artifacts flex left">
                    ConfigMaps
                    <InfoIconWithTippy
                        infoText="ConfigMap is used to store common configuration variables, allowing users to unify environment variables for different modules in a distributed system into one object."
                        documentationLink={DOCUMENTATION.APP_CREATE_CONFIG_MAP}
                    />
                </h1>
            )}
            <div className="mt-20">
                <ConfigMapSecretContainer
                    key="Add ConfigMap"
                    title=""
                    appChartRef={appChartRef}
                    update={update}
                    componentType="configmap"
                    id={configMap?.id ?? 0}
                    isOverrideView={isOverrideView}
                />
                {configMap?.configData.map((cm, idx) => {
                    return (
                        <ConfigMapSecretContainer
                            key={cm.name}
                            title={cm.name}
                            appChartRef={appChartRef}
                            update={update}
                            componentType="configmap"
                            data={cm}
                            index={idx}
                            id={configMap?.id}
                            isOverrideView={isOverrideView}
                        />
                    )
                })}
            </div>
        </div>
    )
}
