import React, { useState } from 'react'
import { components } from 'react-select'
import CreatableSelect from 'react-select/creatable'
import { ReactComponent as PluginIcon } from '../../assets/icons/ic-plugin.svg'
import { ReactComponent as Dropdown } from '../../assets/icons/ic-chevron-down.svg'
import { ReactComponent as WarningIcon } from '../../assets/icons/ic-warning.svg'
import { ReactComponent as Cross } from '../../assets/icons/ic-cross.svg'
import { ReactComponent as QuestionIcon } from '../v2/assets/icons/ic-question.svg'
import { ReactComponent as HelpIcon } from '../../assets/icons/ic-help.svg'
import { TARGET_PLATFORM_LIST, tempMultiSelectStyles } from './CIConfig.utils'
import { CIAdvancedConfigProps } from './types'
import TippyWhite from '../common/TippyWhite'

export default function CIAdvancedConfig({
    configOverrideView,
    allowOverride,
    args,
    setArgs,
    isBuildpackType,
    selectedTargetPlatforms,
    setSelectedTargetPlatforms,
    targetPlatformMap,
    showCustomPlatformWarning,
    setShowCustomPlatformWarning,
}: CIAdvancedConfigProps) {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const updateNotAllowed = configOverrideView && !allowOverride

    const toggleCollapse = (): void => {
        setIsCollapsed(!isCollapsed)
    }

    const addArg = (e) => {
        if (updateNotAllowed) {
            return
        }

        setArgs((args) => [{ k: '', v: '', keyError: '', valueError: '' }, ...args])
    }

    const handleArgsChange = (e): void => {
        if (updateNotAllowed || !e.target) {
            return
        }

        const isKey = e.target.name === 'arg-key',
            id = e.target.dataset.id,
            k = isKey ? e.target.value : e.target.dataset.value,
            v = isKey ? e.target.dataset.value : e.target.value

        setArgs((arr) => {
            arr[id] = { k: k, v: v, keyError: '', valueError: '' }
            return Array.from(arr)
        })
    }

    const deleteArgs = (e) => {
        if (updateNotAllowed) {
            return
        }

        const argsTemp = [...args]
        argsTemp.splice(e.target.dataset.id, 1)
        setArgs(argsTemp)
    }

    const platformMenuList = (props): JSX.Element => {
        return (
            <components.MenuList {...props}>
                <div className="cn-5 pl-12 pt-4 pb-4 dc__italic-font-style">
                    Type to enter a target platform. Press Enter to accept.
                </div>
                {props.children}
            </components.MenuList>
        )
    }

    const noMatchingPlatformOptions = (): string => {
        return 'No matching options'
    }

    const platformOption = (props): JSX.Element => {
        const { selectOption, data } = props
        return (
            <div
                onClick={(e) => selectOption(data)}
                className="flex left pl-12"
                style={{ background: props.isFocused ? 'var(--N100)' : 'transparent' }}
            >
                {!data.__isNew__ && (
                    <input
                        checked={props.isSelected}
                        type="checkbox"
                        style={{ height: '16px', width: '16px', flex: '0 0 16px' }}
                    />
                )}
                <div className="flex left column w-100">
                    <components.Option className="w-100 option-label-padding" {...props} />
                </div>
            </div>
        )
    }
    const handlePlatformChange = (selectedValue): void => {
        setSelectedTargetPlatforms(selectedValue)
    }

    const handleCreatableBlur = (event): void => {
        if (event.target.value) {
            setSelectedTargetPlatforms([
                ...selectedTargetPlatforms,
                {
                    label: event.target.value,
                    value: event.target.value,
                },
            ])
            if (!showCustomPlatformWarning) {
                setShowCustomPlatformWarning(!targetPlatformMap.get(event.target.value))
            }
        } else {
            setShowCustomPlatformWarning(
                selectedTargetPlatforms.some((targetPlatform) => !targetPlatformMap.get(targetPlatform.value)),
            )
        }
    }

    const handleKeyDown = (event): void => {
        if (event.key === 'Enter' || event.key === 'Tab') {
            event.target.blur()
        }
    }

    const renderBuildArgs = (isDockerArgsSection?: boolean) => {
        return (
            <div>
                <div className="flex left fs-13 fw-6 mb-8">
                    {isDockerArgsSection ? 'Docker Build Arguments' : 'Build Env Arguments'}
                    <TippyWhite
                        className="w-300"
                        placement="top"
                        Icon={HelpIcon}
                        iconClass="fcv-5"
                        heading={isDockerArgsSection ? 'Docker Build Arguments' : 'Build Env Arguments'}
                        infoText={`Key/value pair will be appended as
                                ${
                                    isDockerArgsSection
                                        ? ' docker build arguments (--build-args).'
                                        : ' buildpack env arguments (--env).'
                                }`}
                        showCloseButton={true}
                        trigger="click"
                        interactive={true}
                    >
                        <QuestionIcon className="icon-dim-16 fcn-6 ml-4 cursor" />
                    </TippyWhite>
                </div>
                {!updateNotAllowed && (
                    <div className="add-parameter fs-14 mb-8 cb-5 cursor" onClick={addArg}>
                        <span className="fa fa-plus mr-8"></span>Add{isDockerArgsSection ? ' parameter' : ' argument'}
                    </div>
                )}
                {args &&
                    args.map((arg, idx) => (
                        <div className="flexbox justify-space" key={`build-${idx}`}>
                            <div className="mt-8 w-100">
                                <input
                                    name="arg-key"
                                    className={`w-100 dc__top-radius-4 pl-10 pr-10 pt-6 pb-6 en-2 bw-1 ${
                                        updateNotAllowed ? 'cursor-not-allowed' : ''
                                    }`}
                                    autoComplete="off"
                                    placeholder="Key"
                                    type="text"
                                    value={arg.k}
                                    data-id={idx}
                                    data-value={arg.v}
                                    onChange={handleArgsChange}
                                    disabled={updateNotAllowed}
                                />
                                <textarea
                                    name="arg-value"
                                    className={`build__value w-100 dc__bottom-radius-4 dc__no-top-border pl-10 pr-10 pt-6 pb-6 en-2 bw-1 ${
                                        updateNotAllowed ? 'cursor-not-allowed' : ''
                                    }`}
                                    value={arg.v}
                                    data-id={idx}
                                    data-value={arg.k}
                                    onChange={handleArgsChange}
                                    placeholder="Value"
                                    disabled={updateNotAllowed}
                                />
                            </div>
                            {!updateNotAllowed && (
                                <Cross data-id={idx} className="icon-dim-24 mt-6 ml-6 cursor" onClick={deleteArgs} />
                            )}
                        </div>
                    ))}
            </div>
        )
    }

    if (configOverrideView && !isBuildpackType) {
        return null
    }

    return isBuildpackType ? (
        renderBuildArgs()
    ) : (
        <>
            <div onClick={toggleCollapse} className="flex left cursor mb-20">
                <div className="icon-dim-40 mr-16">
                    <PluginIcon />
                </div>
                <div>
                    <div className="fs-14 fw-6 ">Advanced options</div>
                    <div className="form-row__add-parameters">
                        <span className="fs-13 fw-4 cn-7">Set target platform for build, Docker build arguments</span>
                    </div>
                </div>
                <span className="ml-auto">
                    <Dropdown
                        className="icon-dim-32 rotate "
                        style={{ ['--rotateBy' as any]: isCollapsed ? '180deg' : '0deg' }}
                    />
                </span>
            </div>
            {isCollapsed && (
                <>
                    <div className="mb-20">
                        <div className="fs-13 fw-6">Set target platform for the build</div>
                        <div className="fs-13 fw-4 cn-7 mb-12">
                            If target platform is not set, Devtron will build image for architecture and operating
                            system of the k8s node on which CI is running
                        </div>
                        <CreatableSelect
                            value={selectedTargetPlatforms}
                            isMulti={true}
                            components={{
                                ClearIndicator: null,
                                IndicatorSeparator: null,
                                Option: platformOption,
                                MenuList: platformMenuList,
                            }}
                            styles={tempMultiSelectStyles}
                            closeMenuOnSelect={false}
                            name="targetPlatform"
                            placeholder="Type to select or create"
                            options={TARGET_PLATFORM_LIST}
                            className="basic-multi-select mb-4"
                            classNamePrefix="target-platform__select"
                            onChange={handlePlatformChange}
                            hideSelectedOptions={false}
                            noOptionsMessage={noMatchingPlatformOptions}
                            onBlur={handleCreatableBlur}
                            isValidNewOption={() => false}
                            onKeyDown={handleKeyDown}
                            captureMenuScroll={false}
                        />
                        {showCustomPlatformWarning && (
                            <span className="flexbox cy-7">
                                <WarningIcon className="warning-icon-y7 icon-dim-16 mr-5 mt-2" />
                                You have entered a custom target platform, please ensure it is valid.
                            </span>
                        )}
                    </div>
                    {renderBuildArgs(true)}
                </>
            )}
        </>
    )
}