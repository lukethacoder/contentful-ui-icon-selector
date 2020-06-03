import * as React from 'react';
import { render } from 'react-dom';
import {
  TextInput,
  Dropdown,
  Button,
  DropdownList,
  DropdownListItem
} from '@contentful/forma-36-react-components';
import { init, FieldExtensionSDK } from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';

import { Caravan, FighterJet, Pram, ShoppingCart, Truck } from './icons';

const ICONS: IconItem[] = [
  {
    title: 'Caravan',
    id: 'CARAVAN',
    svg: Caravan
  },
  {
    title: 'Fighter Jet',
    id: 'FIGHTER_JET',
    svg: FighterJet
  }
];

const App: React.FC<AppMain> = props => {
  console.log('props ', props);

  const [value_number_one, setValueNumberOne] = React.useState('');
  const [value_number_two, setValueNumberTwo] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);

  let detachExternalChangeHandler: Function | null = null;

  function onExternalChange(value: any) {
    if (value) {
      setValueNumberOne(value.value);
      setValueNumberTwo(value.value_two);
    }
  }

  React.useEffect(() => {
    props.sdk.window.startAutoResizer();
    let initial_value = props.sdk.field.getValue();

    if (initial_value) {
      setValueNumberOne(initial_value.value);
      setValueNumberTwo(initial_value.value_two);
    }

    // Handler for external field value changes (e.g. when multiple authors are working on the same entry).
    if (detachExternalChangeHandler === null) {
      detachExternalChangeHandler = props.sdk.field.onValueChanged(onExternalChange);
    }
  }, []);

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const current_value = e.currentTarget.value;
    setValueNumberOne(current_value);

    if (current_value) {
      await props.sdk.field.setValue({ value: current_value, value_two: value_number_two });
    } else {
      await props.sdk.field.removeValue();
    }
  }

  async function onChangeTwo(e: React.ChangeEvent<HTMLInputElement>) {
    const current_value = e.currentTarget.value;
    setValueNumberTwo(current_value);

    if (current_value) {
      await props.sdk.field.setValue({ value: value_number_one, value_two: current_value });
    } else {
      await props.sdk.field.removeValue();
    }
  }

  return (
    <React.Fragment>
      <TextInput
        width="large"
        type="text"
        id="value-juan"
        value={value_number_one}
        onChange={onChange}
      />
      <TextInput
        width="large"
        type="text"
        id="value-two"
        value={value_number_two}
        onChange={onChangeTwo}
      />

      <Dropdown
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        key={Date.now()} // Force Reinit
        style={{ minHeight: '128px' }}
        thumbnailElement={
          <div
            style={{
              height: '100%',
              width: '100%'
            }}
          />
        }
        toggleElement={
          <Button
            size="medium"
            buttonType="muted"
            indicateDropdown
            onClick={() => setIsOpen(!isOpen)}>
            Choose Icon
          </Button>
        }>
        <DropdownList maxHeight={175}>
          {ICONS.map(icon => (
            <DropdownListItem onClick={e => console.log(e.currentTarget.value)}>
              {icon.title}
            </DropdownListItem>
          ))}
        </DropdownList>
      </Dropdown>
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
  title: string;
  id: string;
  svg: React.FC;
}
