import * as React from 'react'
import { render } from 'react-dom'
import { init, FieldExtensionSDK } from 'contentful-ui-extensions-sdk'
import Select, { components } from 'react-select'

import './index.css'
import { ICONS, IconItem } from './icons'

/* Config */
const ICON_COLOR: string = '#878787'
const ICON_SIZE: string = '24px'
const LABEL_LEFT_MARGIN: string = '8px'
const DROP_DOWN_MAX_HEIGHT: number = 248

const findIcon = (icon_name: string) =>
  ICONS.find((icon) => icon.value === icon_name)

/* Main App */
export const App: React.FC<AppMain> = (props) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [activeIconObj, setActiveIconObj] = React.useState<
    IconItem | undefined
  >(undefined)

  const { Option, SingleValue } = components
  const select_ref = React.useRef()
  const select_parent_ref = React.useRef()

  let detachExternalChangeHandler: Function | null = null

  function onExternalChange(external_value: any) {
    if (external_value) {
      let icon_obj = findIcon(external_value)
      setActiveIconObj(icon_obj)
    }
  }

  React.useEffect(() => {
    let initial_value = props.sdk.field.getValue()

    // Set initial value, if there is one
    if (initial_value) {
      let icon_obj = findIcon(initial_value)

      // Check the existing value is legit
      if (icon_obj) {
        setActiveIconObj(icon_obj)
      }
    }

    /**
     * Handler for external field value changes
     * (e.g. when multiple authors are working on the same entry).
     */
    if (detachExternalChangeHandler === null) {
      detachExternalChangeHandler = props.sdk.field.onValueChanged(
        onExternalChange
      )
    }
  }, [])

  React.useEffect(() => {
    // Handle adjusting the height of the wrapper component
    props.sdk.window.updateHeight(isOpen ? DROP_DOWN_MAX_HEIGHT + 20 : 80)
  }, [isOpen])

  async function handleChangeIcon(e: any) {
    if (e === null) {
      setActiveIconObj(undefined)
      setIsOpen(false)

      await props.sdk.field.removeValue()
    } else {
      let current_value = e.value
      let icon_obj = ICONS.find((icon) => icon.value === current_value)
      setActiveIconObj(icon_obj)

      setIsOpen(false)

      if (current_value) {
        await props.sdk.field.setValue(current_value)
      } else {
        await props.sdk.field.removeValue()
      }
    }
  }

  /**
   *
   * @param props - React Select based props
   * ref: https://react-select.com/components#replacing-components
   */
  const IconAndValue = (props: any) => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          width: ICON_SIZE,
          height: ICON_SIZE,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: ICON_COLOR,
        }}
      >
        {props.data.svg ? <props.data.svg /> : null}
      </div>
      <p style={{ marginLeft: LABEL_LEFT_MARGIN }}>
        {props.data.label ? props.data.label : ''}
      </p>
    </div>
  )

  const IconOption = (props: any) => (
    <Option {...props}>
      <IconAndValue {...props} />
    </Option>
  )

  const SingleValueContainer = (props: any) => (
    <SingleValue {...props}>
      <IconAndValue {...props} />
    </SingleValue>
  )

  return (
    <React.Fragment>
      <Select
        value={activeIconObj}
        menuIsOpen={isOpen}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        onChange={handleChangeIcon}
        options={ICONS}
        isSearchable
        ref={select_ref}
        isClearable={true}
        components={{
          Option: IconOption,
          SingleValue: SingleValueContainer,
        }}
        maxMenuHeight={DROP_DOWN_MAX_HEIGHT}
        theme={(theme: any) => ({
          ...theme,
          borderRadius: 0,
          colors: {
            ...theme.colors,
            primary: '#4a90e2', // Contentful Blue
          },
        })}
      />
    </React.Fragment>
  )
}

init((sdk) => {
  render(
    <App sdk={sdk as FieldExtensionSDK} />,
    document.getElementById('root')
  )
})

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }

interface AppMain {
  sdk: FieldExtensionSDK
  value?: string
}
