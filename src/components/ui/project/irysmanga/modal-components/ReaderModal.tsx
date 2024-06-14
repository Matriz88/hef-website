import { RefObject, useState } from 'react';
import { languages } from '@/lib/i18n/settings';
import useTranslation from '@/lib/i18n/client';
import ModalTab from './ModalTab';
import ModalTabGeneral from './ModalTabGeneral';
import ModalTabStory from './ModalTabStory';
import ModalTabReader from './ModalTabReader';
import { getNextOption } from '../utils/helper';
import { useMangaContext } from '../context/MangaContext';

interface IProps {
	modalRef: RefObject<HTMLDialogElement>;
}

export default function ReaderModal({ modalRef }: IProps) {
	const [selected, setSelected] = useState('General');
	const { readerLanguage, setReaderLanguage } = useMangaContext();
	const { t } = useTranslation('reader');

	return (
		<dialog id="info_modal" className="modal" ref={modalRef}>
			<div className="modal-box flex h-[90%] min-w-[50%] max-w-[70%] flex-col justify-between overflow-hidden">
				<div className="flex max-h-[87%] grow flex-col">
					<div className="tabs-lifted flex self-center">
						<ModalTab
							label="General"
							selected={selected}
							setSelected={setSelected}
						/>
						<ModalTab
							label="Story"
							selected={selected}
							setSelected={setSelected}
						/>
						<ModalTab
							label="Reader"
							selected={selected}
							setSelected={setSelected}
						/>
					</div>

					{selected === 'General' && <ModalTabGeneral />}
					{selected === 'Story' && <ModalTabStory />}
					{selected === 'Reader' && <ModalTabReader />}
				</div>
				<div className="modal-action justify-between">
					<button
						type="button"
						className="flex h-12 min-h-12 items-center gap-2 whitespace-nowrap rounded-md bg-skin-primary p-4 text-sm font-semibold leading-4 text-skin-primary-foreground transition-all hover:bg-[color-mix(in_srgb,rgb(var(--color-primary))_90%,black)] disabled:cursor-not-allowed disabled:bg-[color-mix(in_srgb,rgb(var(--color-primary))_90%,black)] dark:bg-skin-primary-dark dark:text-skin-primary-foreground-dark dark:hover:bg-[color-mix(in_srgb,rgb(var(--color-primary-dark))_90%,black)]"
						onClick={() => setReaderLanguage(
							getNextOption(readerLanguage, languages),
						)}
					>
						{readerLanguage.toLocaleUpperCase()}
					</button>
					<button
						type="button"
						className="flex h-12 min-h-12 items-center gap-2 whitespace-nowrap rounded-md bg-skin-primary p-4 text-sm font-semibold leading-4 text-skin-primary-foreground transition-all hover:bg-[color-mix(in_srgb,rgb(var(--color-primary))_90%,black)] disabled:cursor-not-allowed disabled:bg-[color-mix(in_srgb,rgb(var(--color-primary))_90%,black)] dark:bg-skin-primary-dark dark:text-skin-primary-foreground-dark dark:hover:bg-[color-mix(in_srgb,rgb(var(--color-primary-dark))_90%,black)]"
						onClick={() => (selected === 'Reader'
							? modalRef.current?.close()
							: setSelected(
								getNextOption(selected, [
									'General',
									'Story',
									'Reader',
								]),
							))}
					>
						{selected === 'Reader' ? t('close') : t('next')}
					</button>
				</div>
			</div>
			<form method="dialog" className="modal-backdrop">
				<button
					type="submit"
					className="hover:cursor-default"
				>
					Close
				</button>
			</form>
		</dialog>
	);
}