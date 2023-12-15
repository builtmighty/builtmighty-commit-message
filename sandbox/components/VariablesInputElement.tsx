import React, { FC, useContext, useEffect, useState } from 'react';
import styles from '../styles/VariableInput.module.css';
import { Select } from '@chakra-ui/select';
import VariableArrayInput from './core/VariableArrayInput';
import VariableMergeInput from './core/VariableMergeInput';
import VariablePredefinedInput from './core/VariablePredefinedInput';
import { Store } from '../utils/store';
import VariableFileInput from './core/VariableFileInput';
import VariableBranchInput from './core/VariableBranchInput';

interface IProps {
  name: string;
  mergeItems: string[];
}

const VariableInputElement: FC<IProps> = (props) => {
  const { name, mergeItems } = props;

  const { variables, setVariable } = useContext(Store);
  const value = variables[name];

  const [type, setType] = useState<
    'string' | 'array' | 'merge' | 'predefined' | 'files' | 'branch'
  >('string');

  const mergeItemsWithoutSelf = mergeItems.filter((a) => a !== name);

  // Update from bottom
  const handleChangeType = (e: any) => {
    const newVal = e.target.value as
      | 'string'
      | 'array'
      | 'merge'
      | 'predefined'
      | 'files'
      | 'branch';
    setType(newVal);
    if (newVal === 'string' || newVal === 'predefined' || newVal === 'files') {
      setVariable(name, undefined);
    } else {
      setVariable(name, []);
    }
  };

  useEffect(() => {
    if (typeof value === 'string') {
      if (value === 'branch') {
        setType('branch');
      } else if (value.startsWith('files')) {
        setType('files');
      } else {
        setType('predefined');
      }
    } else if (typeof value === 'object' && value.length > 0) {
      if (typeof value[0] === 'string') {
        setType('merge');
      } else {
        setType('array');
      }
    }
  }, [value]);

  return (
    <>
      <h3 className={styles.name} key={name}>
        {name}
      </h3>
      <div className={styles.content} key={name}>
        <div className={styles.contentLeft}>
          <Select
            size="sm"
            value={type}
            onChange={handleChangeType}
            variant="filled"
          >
            <option value="string">String</option>
            <option value="array">Array</option>
            <option value="merge">Merge</option>
            <option value="predefined">Predefined</option>
            <option value="files">Files</option>
            <option value="branch">Branch</option>
          </Select>
        </div>
        <div className={styles.contentRight}>
          {type === 'array' && <VariableArrayInput name={name} />}
          {type === 'merge' && (
            <VariableMergeInput
              mergeItems={mergeItemsWithoutSelf}
              name={name}
            />
          )}
          {type === 'predefined' && <VariablePredefinedInput name={name} />}
          {type === 'files' && <VariableFileInput name={name} />}
          {type === 'branch' && <VariableBranchInput name={name} />}
        </div>
      </div>
    </>
  );
};

export default VariableInputElement;
