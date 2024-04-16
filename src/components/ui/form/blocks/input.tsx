import { TSerializeTypes } from '@tripetto/runner/module/serializer';
import {
	cancelUITimeout, castToString, DateTime, Num, scheduleUITimeout,
} from '@tripetto/runner';
import {
	ChangeEvent, KeyboardEvent, useEffect, useRef, useState,
} from 'react';
import { setReturnValue } from '../helpers';

interface InputProps {
	readonly type: 'text' | 'email' | 'url' | 'password' | 'tel' | 'number';
	readonly id?: string;
	readonly placeholder?: string;
	readonly required?: boolean;
	readonly disabled?: boolean;
	readonly readOnly?: boolean;
	readonly error?: boolean;
	readonly tabIndex?: number;
	readonly maxLength?: number;
	readonly value?:
	| string
	| {
		pristine: TSerializeTypes;
		readonly string: string;
		readonly isLocked: boolean;
		readonly isFrozen: boolean;
	};
	readonly ariaDescribedBy?: string;

	/**
	 * https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inputmode
	 */
	readonly inputMode?: 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';

	/**
	 * https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
	 */
	readonly autoComplete?: string;
	readonly list?: string;
	readonly onChange?: (value: string) => string | void;
	readonly onAutoFocus?: (el: HTMLInputElement | null) => void;
	readonly onSubmit?: () => void;
	readonly onCancel?: () => void;
}

export default function Input({
	type,
	id,
	placeholder,
	required,
	disabled,
	readOnly,
	error,
	tabIndex,
	maxLength,
	value: valueRef,
	ariaDescribedBy,
	inputMode,
	autoComplete,
	list,
	onChange,
	onAutoFocus,
	onSubmit,
	onCancel,
}: InputProps) {
	const debounceRef = useRef<{
		duration: number;
		handle: number;
		update?:() => void;
	}>(
			{
				duration: 0,
				handle: 0,
			});
	const [focus, setFocus] = useState(false);
	const [focusValue, setFocusValue] = useState(typeof valueRef === 'object' ? castToString(valueRef.pristine) : valueRef || '');
	const [value, setValue] = typeof valueRef === 'object'
		? [
			focus ? focusValue : valueRef.string,
			(val: string) => {
				cancelUITimeout(debounceRef.current.handle);

				setFocusValue(val);

				const nTimeout = Num.range(debounceRef.current.duration * 2, 15, 1000);

				debounceRef.current.handle = scheduleUITimeout(() => {
					const start = DateTime.precise;

					debounceRef.current.handle = 0;
					debounceRef.current.update = () => {
						debounceRef.current.duration = DateTime.elapsed(start, true);
						debounceRef.current.update = undefined;
					};

					if (type === 'url' && val && val.toLowerCase().indexOf('://') === -1) {
						// eslint-disable-next-line no-param-reassign
						valueRef.pristine = `https://${val}`;
					} else {
						// eslint-disable-next-line no-param-reassign
						valueRef.pristine = val || undefined;
					}
				}, nTimeout);
			},
		]
		: [focusValue, setFocusValue];
	const ref = useRef<HTMLInputElement | null>();
	const setRef = (el: HTMLInputElement | null) => {
		if (onAutoFocus) {
			onAutoFocus(el);
		}

		ref.current = el;
	};

	useEffect(() => {
		if (ref.current && !focus) {
			ref.current.value = value;
		}
	}, [value]);

	useEffect(() => () => {
		cancelUITimeout(debounceRef.current.handle);
	}, []);

	if (debounceRef.current.update) {
		debounceRef.current.update();
	}

	return (
		<input
			id={id}
			className={`rounded-lg px-4 py-2 ${error ? 'border-2 border-red-600' : 'border border-black'}`}
			ref={setRef}
			type={type ?? 'text'}
			list={list}
			tabIndex={tabIndex}
			placeholder={placeholder}
			required={required ?? false}
			disabled={disabled ?? false}
			readOnly={readOnly || (typeof valueRef === 'object' && (valueRef.isFrozen || valueRef.isLocked)) || false}
			maxLength={maxLength ?? undefined}
			defaultValue={value}
			name={autoComplete}
			autoComplete={autoComplete ?? 'off'}
			inputMode={inputMode ?? 'text'}
			aria-describedby={ariaDescribedBy}
			onChange={(e: ChangeEvent<HTMLInputElement>) => {
				setValue(e.target.value);

				if (onChange) {
					setReturnValue(setValue, onChange(e.target.value));
				}
			}}
			onFocus={() => setFocus(true)}
			onBlur={() => setFocus(false)}
			onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
				if (e.key === 'Enter' && onSubmit) {
					e.preventDefault();

					onSubmit();
				} else if (e.key === 'Escape') {
					e.currentTarget.blur();
				} else if (e.key === 'Tab') {
					if (e.shiftKey) {
						if (onCancel) {
							e.preventDefault();

							onCancel();
						}
					} else if (onSubmit) {
						e.preventDefault();

						onSubmit();
					}
				}
			}}
		/>
	);
}
