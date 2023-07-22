'use client';

import { Project } from 'types/payload-types';
import { Stage } from '@pixi/react';
import React, { useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';
import OS from 'phaser/src/device/OS';
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/solid';
import PixiPuzzleContainer from './PixiPuzzleContainer';
import Message from './puzzle/Message';
import usePuzzleStore from './puzzle/PuzzleStore';

interface IProps {
	project: Omit<Project, 'flags' | 'devprops'> & {
		flags: string[];
		devprops: {
			[key: string]: string;
		};
	};
	submissions: Message[];
}

export interface StageSize {
	width: number;
	height: number;
}

export default function PixiWrapper({ project, submissions }: IProps) {
	const [stageSize, setStageSize] = useState<StageSize | null>(null);
	const [ready, setReady] = useState(false);
	const [loadProgress, setLoadProgress] = useState(0);
	const [orientation, setOrientation] = useState('');

	const { volume, muted } = usePuzzleStore((state) => state.audio);
	const [setVolume, setMuted] = usePuzzleStore((state) => [state.setVolume, state.setMuted]);

	// Resize logic
	useEffect(() => {
		const onResize = () => {
			// TODO: properly resize the canvas
			setStageSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};

		onResize();

		window.addEventListener('resize', onResize);

		return () => {
			window.removeEventListener('resize', onResize);
		};
	}, []);

	useEffect(() => {
		const onOrientationChange = () => {
			setOrientation(window.screen.orientation.type);
		};

		onOrientationChange();

		window.addEventListener('orientationchange', onOrientationChange);

		return () => {
			window.removeEventListener('orientationchange', onOrientationChange);
		};
	}, []);

	useEffect(() => {
		(async () => {
			await PIXI.Assets.init({ manifest: '/assets/kroniipuzzle/manifest.json' });
			await PIXI.Assets.loadBundle('puzzle', (progress) => {
				setLoadProgress(progress * 100);
			});

			setReady(true);
		})();
	}, []);
	if (!stageSize) return null;

	// TODO: Proper loading screen
	if (!ready) {
		return (
			<p>
				Loading...
				{' '}
				{loadProgress.toFixed(0)}
				%
			</p>
		);
	}

	// TODO: Enforce aspect ratio of 16:9
	return (
		<>
			{!OS.desktop && orientation.startsWith('portrait') && (
				<button
					className="text-center z-10 min-h-screen min-w-screen h-full w-full bg-black text-white absolute"
					type="button"
					onClick={() => {
						document.documentElement.requestFullscreen().then(() => {
							window.screen.orientation.lock('landscape');
						});
					}}
				>
					Click to screen to fullscreen
				</button>
			)}
			<Stage
				options={{
					backgroundColor: 0x5599ff,
				}}
				className={!OS.desktop && orientation.startsWith('portrait') ? 'hidden' : ''}
			>
				<PixiPuzzleContainer
					project={project}
					stageSize={stageSize}
					submissions={submissions}
				/>
			</Stage>

			<div className="fixed right-4 bottom-4 z-50 text-black dark:text-white bg-skin-card dark:bg-skin-dark-card rounded-lg w-64 h-16 flex justify-between items-center gap-2 px-4 py-2">
				<label className="swap swap-flip">
					<input
						type="checkbox"
						className="text-black dark:text-white"
						checked={muted}
						onChange={() => setMuted(!muted)}
					/>

					<SpeakerWaveIcon className="swap-off w-6 h-6" />
					<SpeakerXMarkIcon className="swap-on w-6 h-6" />
				</label>
				<input
					type="range"
					disabled={muted}
					max={1}
					min={0}
					step={0.05}
					value={volume}
					onChange={(e) => setVolume(Number.parseFloat(e.target.value))}
					className="range range-accent range-s disabled:range-xs"
				/>
			</div>
		</>
	);
}
