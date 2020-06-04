import * as React from 'react';
import { render } from 'react-dom';
import Select, { components } from 'react-select';
import { init, FieldExtensionSDK } from 'contentful-ui-extensions-sdk';
import './index.css';

import { Caravan, FighterJet, Pram, ShoppingCart, Truck } from './icons';

const ICON_COLOR = '#878787';

const ICONS: IconItem[] = [
  {
    label: 'Caravan',
    value: 'CARAVAN',
    svg: Caravan
  },
  {
    label: 'Fighter Jet',
    value: 'FIGHTER_JET',
    svg: FighterJet
  },
  {
    label: 'Pram',
    value: 'PRAM',
    svg: Pram
  },
  {
    label: 'Shopping Cart',
    value: 'SHOPPING_CART',
    svg: ShoppingCart
  },
  {
    label: 'Truck',
    value: 'TRUCK',
    svg: Truck
  }
];

const App: React.FC<AppMain> = props => {
  const [iconName, setIconName] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeIconObj, setActiveIconObj] = React.useState({});

  let detachExternalChangeHandler: Function | null = null;

  function onExternalChange(value: any) {
    if (value) {
      setIconName(value);
    }
  }

  React.useEffect(() => {
    let initial_value = props.sdk.field.getValue();

    if (initial_value) {
      setIconName(initial_value);
    }

    // Handler for external field value changes (e.g. when multiple authors are working on the same entry).
    if (detachExternalChangeHandler === null) {
      detachExternalChangeHandler = props.sdk.field.onValueChanged(onExternalChange);
    }
  }, []);

  React.useEffect(() => {
    props.sdk.window.updateHeight(420);
  }, [isOpen]);

  const { Option } = components;
  const select_ref = React.useRef();

  async function handleChangeIcon(e: any) {
    let current_value = e.value;
    setIconName(current_value);

    let icon_obj = ICONS.find(icon => icon.value === current_value);
    setActiveIconObj(icon_obj);

    setIsOpen(false);

    if (current_value) {
      await props.sdk.field.setValue(current_value);
    } else {
      await props.sdk.field.removeValue();
    }
  }

  function handleClickSelect(e: any) {
    setIsOpen(!isOpen);
    props.sdk.window.updateHeight();
  }

  const IconOption = props => (
    <Option {...props}>
      <div
        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer' }}>
        <div
          style={{
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: ICON_COLOR
          }}>
          <props.data.svg />
        </div>
        <p style={{ marginLeft: '8px' }}>{props.data.label}</p>
      </div>
    </Option>
  );

  return (
    <React.Fragment>
      {activeIconObj ? JSON.stringify(activeIconObj) : 'choose an icon'}
      <p>test: {iconName}</p>

      <Select
        value={activeIconObj}
        menuIsOpen={isOpen}
        onFocus={handleClickSelect}
        onChange={handleChangeIcon}
        options={ICONS}
        isSearchable
        ref={select_ref}
        components={{ Option: IconOption }}
        theme={theme => ({
          ...theme,
          borderRadius: 0,
          colors: {
            ...theme.colors,
            primary: '#4a90e2'
          }
        })}
      />
    </React.Fragment>
  );
};

init(sdk => {
  render(<App sdk={sdk as FieldExtensionSDK} />, document.getElementById('root'));
});

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }

interface AppMain {
  sdk: FieldExtensionSDK;
  value?: string;
}

interface IconItem {
  label: string;
  value: string;
  svg: React.FC;
}
