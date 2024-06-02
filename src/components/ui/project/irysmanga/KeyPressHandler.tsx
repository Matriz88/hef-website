import { useEffect, useRef } from 'react';
import { useMangaContext } from './context/MangaContext';
import {
	getNextOption,
	handleChapterNavigation,
	handlePageNavigation,
} from './utils/helper';
import {
	directions,
	fitModes,
	headerVisibilities,
	languages,
	pageLayouts,
	progressVisibilities,
	readerThemes,
} from './utils/types';

interface Props {
	setOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
	readerContainerRef: React.RefObject<HTMLDivElement>;
}

function KeyPressHandler({ setOpenSidebar, readerContainerRef }: Props) {
	const {
		setPage,
		setChapter,
		setPageLayout,
		setFitMode,
		setDirection,
		setProgressVisibility,
		setReaderTheme,
		setMangaLanguage,
		setReaderLanguage,
		page,
		chapter,
		pageLayout,
		direction,
		mangaLanguage,
		manga,
		setHeaderVisibility,
	} = useMangaContext();
	const scrollIntervalRef = useRef<any>();
	const scrollDirectionRef = useRef<number>();

	useEffect(() => {
		const handleKeyPress = (event: KeyboardEvent) => {
			if (event.key === 'ArrowLeft') {
				if (direction === 'ltr') {
					handlePageNavigation(
						page - 1,
						pageLayout,
						setPage,
						setChapter,
						chapter,
						mangaLanguage,
						manga,
					);
				} else {
					handlePageNavigation(
						page + 1,
						pageLayout,
						setPage,
						setChapter,
						chapter,
						mangaLanguage,
						manga,
					);
				}
			}
			if (event.key === 'ArrowRight') {
				if (direction === 'ltr') {
					handlePageNavigation(
						page + 1,
						pageLayout,
						setPage,
						setChapter,
						chapter,
						mangaLanguage,
						manga,
					);
				} else {
					handlePageNavigation(
						page - 1,
						pageLayout,
						setPage,
						setChapter,
						chapter,
						mangaLanguage,
						manga,
					);
				}
			}
			if (event.key === ',') {
				if (direction === 'ltr') {
					handleChapterNavigation(
						setChapter,
						setPage,
						chapter - 1,
						mangaLanguage,
						manga,
					);
				} else {
					handleChapterNavigation(
						setChapter,
						setPage,
						chapter + 1,
						mangaLanguage,
						manga,
					);
				}
			}
			if (event.key === '.') {
				if (direction === 'ltr') {
					handleChapterNavigation(
						setChapter,
						setPage,
						chapter + 1,
						mangaLanguage,
						manga,
					);
				} else {
					handleChapterNavigation(
						setChapter,
						setPage,
						chapter - 1,
						mangaLanguage,
						manga,
					);
				}
			}
			if (event.key === 'm') {
				setOpenSidebar((prev) => !prev);
			}
			if (event.key === 'h') {
				setHeaderVisibility((prev) => getNextOption(prev, headerVisibilities));
			}
			if (event.key === 't') {
				setReaderTheme((prev) => getNextOption(prev, readerThemes));
			}
			if (event.key === 'f') {
				setFitMode((prev) => getNextOption(prev, fitModes));
			}
			if (event.key === 's') {
				setPageLayout((prev) => getNextOption(prev, pageLayouts));
			}
			if (event.key === 'l') {
				setDirection((prev) => getNextOption(prev, directions));
			}
			if (event.key === 'p') {
				setProgressVisibility((prev) => getNextOption(prev, progressVisibilities));
			}
			if (event.key === 'j') {
				setMangaLanguage((prev) => getNextOption(prev, languages));
			}
			if (event.key === 'k') {
				setReaderLanguage((prev) => getNextOption(prev, languages));
			}
		};

		window.addEventListener('keydown', handleKeyPress);
		return () => {
			window.removeEventListener('keydown', handleKeyPress);
		};
	}, [
		chapter,
		direction,
		mangaLanguage,
		manga,
		page,
		pageLayout,
		scrollIntervalRef,
		scrollDirectionRef,
		setChapter,
		setPage,
		setHeaderVisibility,
		setDirection,
		setFitMode,
		setMangaLanguage,
		setReaderLanguage,
		setOpenSidebar,
		setPageLayout,
		setProgressVisibility,
		setReaderTheme,
	]);
	useEffect(() => {
		const startScrolling = (scrollDirection: number) => {
			if (!scrollIntervalRef.current) {
				scrollDirectionRef.current = scrollDirection;
				scrollIntervalRef.current = setInterval(() => {
					// eslint-disable-next-line
                    readerContainerRef.current!.scrollTop +=
                        scrollDirectionRef.current! * 10; // Adjust scrolling speed as needed
				}, 10); // Adjust interval as needed for smoother scrolling
			}
		};
		const stopScrolling = () => {
			if (scrollIntervalRef.current) {
				clearInterval(scrollIntervalRef.current);
				scrollIntervalRef.current = undefined;
				scrollDirectionRef.current = undefined;
			}
		};
		const handleKeyRelease = () => {
			stopScrolling();
		};
		const handleKeyPressUpDown = (event: KeyboardEvent) => {
			if (event.key === 'ArrowUp') {
				event.preventDefault();
				startScrolling(-1);
			}
			if (event.key === 'ArrowDown') {
				event.preventDefault();
				startScrolling(1);
			}
		};
		window.addEventListener('keydown', handleKeyPressUpDown);
		window.addEventListener('keyup', handleKeyRelease);
		return () => {
			window.removeEventListener('keydown', handleKeyPressUpDown);
			window.removeEventListener('keyup', handleKeyRelease);
			stopScrolling();
		};
	}, [readerContainerRef]);
	return null;
}

export default KeyPressHandler;