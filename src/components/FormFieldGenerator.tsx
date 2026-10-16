import { Controller } from 'react-hook-form';
import dayjs from 'dayjs';
import { hp } from 'src/utils/cssPrefix';
import AntSelect from './ui/AntSelect';
import Checkbox from './ui/Checkbox';
import DatePickerInput from './ui/DatePickerInput';
import InputText from './ui/InputText';
import TextArea from './ui/TextArea';

export type Type = 'text' | 'number' | 'textarea' | 'select' | 'date' | 'checkbox';

export type FieldData = {
  name: string;
  label: string;
  type: Type;
  placeHolder?: string;
  rows?: number;
  cols?: number;
  required?: boolean;
  onlyNumeric?: boolean;
  options?: { label: string; value: string }[];
  isMandatory?: boolean;
  disabled?: boolean;
  hide?: boolean;
  disabledDate?: (date: dayjs.Dayjs) => boolean;
  format?: string;
  allowFloat?: boolean;
  max?: number;
  min?: number;
};

interface IFormFieldGeneratorProps {
  data: FieldData[];
  // react-hook-form's useForm() return value
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useFormMethods: any;
}

/**
 * Renders a form section from field metadata, the way the SZHP pages do:
 * one Controller per field, errors surfaced on the aegov form control.
 */
const FormFieldGenerator = ({ data, useFormMethods }: IFormFieldGeneratorProps) => {
  return (
    <>
      {data?.map((field) => {
        if (field?.hide) {
          return null;
        }

        const isMandatory = field.isMandatory ?? false;
        const isDisabled = field.disabled ?? false;
        const span = field?.cols ? `col-span-${field.cols}` : '';

        if (field.type === 'textarea') {
          return (
            <div key={field.name} className={hp(span)}>
              <Controller
                name={field.name}
                control={useFormMethods.control}
                render={({ field: { value, onChange }, fieldState: { error } }) => (
                  <TextArea
                    id={field.name}
                    name={field.name}
                    label={field.label}
                    isMandatory={isMandatory}
                    placeholder={field.placeHolder}
                    isError={!!error}
                    errorMessage={error ? error.message : undefined}
                    value={value ?? ''}
                    disabled={isDisabled}
                    rows={field?.rows || 3}
                    onChange={onChange}
                  />
                )}
              />
            </div>
          );
        }

        if (field.type === 'select') {
          return (
            <div key={field.name} className={hp(span)}>
              <Controller
                name={field.name}
                control={useFormMethods.control}
                render={({ field: { value, onChange }, fieldState: { error } }) => (
                  <AntSelect
                    id={field.name}
                    name={field.name}
                    label={field.label}
                    isMandatory={isMandatory}
                    placeholder={field.placeHolder}
                    isError={!!error}
                    errorMessage={error ? error.message : undefined}
                    value={value ?? null}
                    disabled={isDisabled}
                    options={field.options ?? []}
                    onChange={onChange}
                  />
                )}
              />
            </div>
          );
        }

        if (field.type === 'date') {
          return (
            <div key={field.name} className={hp(span)}>
              <Controller
                name={field.name}
                control={useFormMethods.control}
                render={({ field: { value, onChange }, fieldState: { error } }) => (
                  <DatePickerInput
                    id={field.name}
                    name={field.name}
                    label={field.label}
                    isMandatory={isMandatory}
                    placeholder={field.placeHolder}
                    isError={!!error}
                    errorMessage={error ? error.message : undefined}
                    value={value ?? null}
                    disabled={isDisabled}
                    format={field.format}
                    disabledDate={field.disabledDate}
                    onChange={onChange}
                  />
                )}
              />
            </div>
          );
        }

        if (field.type === 'checkbox') {
          return (
            <div key={field.name} className={hp(`${span} flex items-end`)}>
              <Controller
                name={field.name}
                control={useFormMethods.control}
                render={({ field: { value, onChange } }) => (
                  <Checkbox
                    id={field.name}
                    name={field.name}
                    label={field.label}
                    isChecked={Boolean(value)}
                    disabled={isDisabled}
                    onToggle={onChange}
                  />
                )}
              />
            </div>
          );
        }

        return (
          <div key={field.name} className={hp(span)}>
            <Controller
              name={field.name}
              control={useFormMethods.control}
              render={({ field: { value, onChange }, fieldState: { error } }) => (
                <InputText
                  id={field.name}
                  name={field.name}
                  label={field.label}
                  isMandatory={isMandatory}
                  placeholder={field.placeHolder}
                  isError={!!error}
                  errorMessage={error ? error.message : undefined}
                  value={value ?? ''}
                  disabled={isDisabled}
                  onlyNumeric={field.type === 'number' || field.onlyNumeric}
                  allowFloat={field.allowFloat}
                  min={field.min}
                  max={field.max}
                  onInputChange={(event) => onChange(event.target.value)}
                />
              )}
            />
          </div>
        );
      })}
    </>
  );
};

export default FormFieldGenerator;
