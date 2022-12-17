import { Submission as ISubmission, SubmissionMedia } from 'types/payload-types';
import ReactPlayerWrapper from 'ui/project/ReactPlayerWrapper';
import Image from 'ui/Image';

interface IProps {
	submission: Omit<ISubmission, 'media' | 'srcIcon'> & { media: SubmissionMedia; srcIcon: SubmissionMedia };
	index: number;
}

export default function Submission({ submission, index }: IProps) {
	return (
		<div className="w-full max-h-full text-black dark:text-white">
			<div className="w-full flex mt-4 h-14">
				{submission.srcIcon && (
					<Image
						className="object-cover w-14 h-14 rounded-full"
						src={submission.srcIcon.url!}
						width={
							submission.srcIcon.width! < 56 ? submission.srcIcon.width : 56
						}
						height={
							submission.srcIcon.width! < 56
								? submission.srcIcon.height!
								: (submission.srcIcon.height! / submission.srcIcon.width!) * 56
						}
						alt={`Profile picture of ${submission.author}`}
					/>
				)}
				{submission.author && (
					<div className="text-lg mt-3 ml-4">
						From:
						{' '}
						<span className="font-bold">{submission.author}</span>
					</div>
				)}
				<div className="flex-grow" />
				<p className="text-xl mt-3 mr-4">{`#${index + 1}`}</p>
			</div>
			<div className="w-full mt-3">
				{submission.type === 'video' && (
					<ReactPlayerWrapper
						width="100%"
						height="100%"
						url={submission.url!}
						controls
						light
						className="mb-4 mt-4"
					/>
				)}
				{submission.type === 'image' && (
					<div className="mt-4 mb-2 w-full h-full max-h-[750px] flex justify-center">
						<Image
							className="max-w-10/12 object-contain mb-4"
							src={submission.media.url!}
							width={
								submission.media.width! < 1024 ? submission.media.width : 1024
							}
							height={
								submission.media.width! < 1024
									? submission.media.height!
									: (submission.media.height! / submission.media.width!) * 1024
							}
							alt={`Image submission from ${submission.author}`}
						/>
					</div>
				)}
				{submission.message && (
					<p className="mx-4 mb-4 w-auto h-full overflow-auto whitespace-pre-line dark:text-gray-300">
						{submission.message}
					</p>
				)}
				<hr className="border-t-1 border-dashed border-gray-400" />
			</div>
		</div>
	);
}