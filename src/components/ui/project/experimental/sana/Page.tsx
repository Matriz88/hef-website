import {
	Guild, Project, Submission as ISubmission, Submission, SubmissionMedia,
} from '@/types/payload-types';
import Header from '@/components/ui/old/Header';
import ProjectSubmissions from '@/components/ui/project/experimental/sana/Submissions';
import ProjectAbout from '@/components/ui/project/experimental/sana/About';
import ProjectBackgroundMusic from '@/components/ui/project/experimental/sana/BackgroundMusic';
import ProjectCredits from '@/components/ui/project/experimental/sana/Credits';
import ProjectTab from '@/components/ui/project/experimental/sana/Tab';
import ProjectTabs from '@/components/ui/project/experimental/sana/Tabs';
import ProjectTimeline from '@/components/ui/project/experimental/sana/Timeline';
import DarkModeFlag from '@/components/ui/project/experimental/sana/DarkModeFlag';
import PayloadResponse from '@/types/PayloadResponse';
import { getImageUrl } from '../../../old/Image';

const GUILD_TO_OSHI = Object.assign(Object.create(null), {
	'CGeclp7hLj-lpprbhKxX5': 'calli',
	hirD8XHurcDYFoNQOFh7p: 'calli',
	jnTqYPtoPDKlvXKuBcHuo: 'kiara',
	J9600ROFekClHLwtzquhd: 'kiara',
	rZNhEJYuseKIKkeSaUSD6: 'ina',
	rWykVp0wwqJfqVOiiwuHC: 'ina',
	BSq6epH_Y1ffq0j1ZWOLT: 'gura',
	'0RdYs2xMNnjmHpIX3CvH6': 'gura',
	mnFswH44ZCTyQiC8LPgRH: 'ame',
	pnJc6y2SRMbNunt1vOUkR: 'ame',
	'hpTi3BFuM46B5SBCyrc-5': 'irys',
	LHYI_i9eFfDYXksaKKxLB: 'irys',
	RYpamVJXs76uWEept42Td: 'sana',
	'94mdRp-j2N8spCx-6UyRE': 'sana',
	h_LNkS8pI64naLiWSafDj: 'fauna',
	'BPyt7-SyXPhyTR9m5i6P2': 'fauna',
	B5vtBaIkfuys1Ln3XMoOY: 'kronii',
	'-JoyPM46syqox0jp7NXG5': 'kronii',
	'-ew0gw2u7gk8GdFyxP1-u': 'kronii',
	_0S7wwTwY17pDkHzWF9QH: 'kronii',
	vCy2Gob7GNK3SOFufaV7K: 'mumei',
	c8FUeIsD1jP6a4xUMBubS: 'mumei',
	lTv1XHPYI8tt7Lzh7g6qk: 'mumei',
	CesQIHnCRvh9RWkhC_XN_: 'mumei',
	VkCh1E0PGq8swBN3h7sse: 'bae',
	jBX00De0x_fJWg7UhDkOK: 'bae',

	// Payload ID's
	'62f23b24333a65054af560d9': 'sana',
	'63209a0af2be5d1c9590fb62': 'sana',
});

export interface ProjectPageProps {
	project: Omit<Project, 'flags' | 'devprops'> & {
		flags: string[];
		devprops: {
			[key: string]: string;
		};
	};
}

async function fetchSubmissions(project: ProjectPageProps['project']) {
	// Create an array for all the submissions
	let moreSubmissions = true;
	let page = 1;
	const submissions: Submission[] = [];

	async function fetchNextSubmissions() {
		// Fetch next page
		const submissionsRes = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL!}/api/submissions?where[project][equals]=${project.id}&limit=100&page=${page}&depth=0`, {
			headers: {
				'X-RateLimit-Bypass': process.env.PAYLOAD_BYPASS_RATE_LIMIT_KEY ?? undefined,
				Authorization: process.env.PAYLOAD_API_KEY ? `users API-Key ${process.env.PAYLOAD_API_KEY}` : undefined,
			} as Record<string, string>,
		});
		const body: PayloadResponse<Submission> = await submissionsRes.json();

		// Process submissions
		const tasks = body.docs.map(async (submission) => {
			// Fetch media if needed
			if (submission.srcIcon) {
				const mediaFetch = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL!}/api/submission-media/${submission.srcIcon as string}`, {
					headers: {
						'X-RateLimit-Bypass': process.env.PAYLOAD_BYPASS_RATE_LIMIT_KEY ?? undefined,
						Authorization: process.env.PAYLOAD_API_KEY ? `users API-Key ${process.env.PAYLOAD_API_KEY}` : undefined,
					} as Record<string, string>,
				});
				// eslint-disable-next-line no-param-reassign
				submission.srcIcon = await mediaFetch.json();
				// eslint-disable-next-line no-param-reassign,max-len
				(submission.srcIcon as SubmissionMedia).url = getImageUrl({ src: (submission.srcIcon as SubmissionMedia).url!, width: 56 });
			}

			const mediaDocs: ISubmission['media'] = [];
			await Promise.all(submission.media!.map(async (item, index) => {
				if (item.type !== 'image') {
					mediaDocs[index] = item;
					return;
				}

				const mediaFetch = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL!}/api/submission-media/${item.image as string}`, {
					headers: {
						'X-RateLimit-Bypass': process.env.PAYLOAD_BYPASS_RATE_LIMIT_KEY ?? undefined,
						Authorization: process.env.PAYLOAD_API_KEY ? `users API-Key ${process.env.PAYLOAD_API_KEY}` : undefined,
					} as Record<string, string>,
				});
				mediaDocs[index] = {
					...item,
					image: await mediaFetch.json(),
				};
			}));

			// eslint-disable-next-line no-param-reassign
			submission.media = mediaDocs;

			submissions.push(submission);
		});
		await Promise.all(tasks);

		// Set variables for next fetch
		page += 1;
		moreSubmissions = body.hasNextPage;
	}

	while (moreSubmissions) {
		// eslint-disable-next-line no-await-in-loop
		await fetchNextSubmissions();
	}

	return submissions;
}

export default async function ProjectPage({ project }: ProjectPageProps) {
	const submissions = await fetchSubmissions(project);

	return (
		<>
			<DarkModeFlag project={project} />

			{/* Hypothetically this could label the div with a nonexistant 'theme-' */}
			{/* class but CSS just ignores nonexistant classes, so who cares? */}
			<div className={`theme-${GUILD_TO_OSHI[(project.organizer as Guild).id]}`}>
				{project.devprops.backgroundMusic && (
					<ProjectBackgroundMusic backgroundMusic={project.devprops.backgroundMusic!} />
				)}

				<div className="bg-skin-background-1 dark:bg-skin-dark-background-1 flex h-full min-h-screen flex-col">
					<Header
						title={project.title ?? 'unknown'}
						description={project.shortDescription ?? ''}
						background={project.flags?.includes('sanaSendoff') ? '/assets/sanasendoff/background.png' : undefined}
					/>
					<div className="grow pb-16">
						<div className="my-32 flex w-full flex-col items-center">
							<div className="mx-4 w-full max-w-4xl break-words md:break-normal">
								{(!project.flags?.includes('disableTabs') && (
									<ProjectTabs defaultTab="About">
										<ProjectTab label="About">
											<ProjectAbout project={project} />
											{project.flags?.includes('sanaSendoff') && (
												// something something next/image something something
												// L + ratio, idc rn
												<img className="sana-letter" src="/assets/sanasendoff/letter.png" alt="Letter to Sana" />
											)}
										</ProjectTab>
										<ProjectTab label="Timeline">
											<ProjectTimeline />
										</ProjectTab>
										{submissions.length > 0 && (
											(project.flags?.includes('sectionedSubmissions') && (() => {
												// the submissions prop will never change; it's statically
												// assigned on the server side, so we don't need to
												// memorize this.
												const [artwork, pictures, videos, messages] = submissions
													.reduce(([_artwork, _pictures, _videos, _messages], submission) => {
														if (submission.media!.length > 0) {
															switch (submission.media![0].type) {
																case 'image':
																	switch (submission.media![0].subtype) {
																		case 'artwork':
																			_artwork.push(submission);
																			break;
																		case 'picture':
																			_pictures.push(submission);
																			break;
																		default:
																			_pictures.push(submission);
																			break;
																	}
																	break;
																case 'video':
																	_videos.push(submission);
																	break;
																default:
																	// eslint-disable-next-line no-console
																	console.warn('Unreachable code reached');
																	break;
															}
														} else {
															_messages.push(submission);
														}

														return [_artwork, _pictures, _videos, _messages];
													}, [[], [], [], []] as Submission[][]);
												return (
													<>
														{artwork.length > 0 && (
															<ProjectTab label="Artwork">
																<ProjectSubmissions
																	submissions={artwork}
																	project={project}
																/>
															</ProjectTab>
														)}
														{pictures.length > 0 && (
															<ProjectTab label="Pictures">
																<ProjectSubmissions
																	submissions={pictures}
																	project={project}
																/>
															</ProjectTab>
														)}
														{videos.length > 0 && (
															<ProjectTab label="Videos">
																<ProjectSubmissions
																	submissions={videos}
																	project={project}
																/>
															</ProjectTab>
														)}
														{messages.length > 0 && (
															<ProjectTab label="Messages">
																<ProjectSubmissions
																	submissions={messages}
																	project={project}
																/>
															</ProjectTab>
														)}
													</>
												);
											})()) || (
												<ProjectTab label="Submissions">
													<ProjectSubmissions submissions={submissions} project={project} />
												</ProjectTab>
											)
										)}
										{project.devprops.credits != null && (
											<ProjectTab label="Credits">
												<ProjectCredits credits={JSON.parse(project.devprops.credits)} />
											</ProjectTab>
										)}
									</ProjectTabs>
								)) || (
									<>
										<ProjectAbout project={project} />
										{/* PS: the ProjectTabs component provides a context -- use can use a */}
										{/* useContext hook to conditionally show headings on these components */}
										<ProjectTimeline />
										{submissions.length > 0 && (
											<ProjectSubmissions submissions={submissions} project={project} />
										)}
									</>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
