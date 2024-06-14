// LoadingIcon.jsx
import React from 'react';
import { motion } from 'framer-motion';

const outlineVariants = {
	hidden: {
		pathLength: 0,
		opacity: 1,
	},
	visible: {
		pathLength: 1,
		opacity: 1,
		transition: {
			pathLength: {
				duration: 2,
				ease: 'easeInOut',
				repeat: Infinity,
				repeatType: 'reverse',
			},
		},
	},
};

export default function LoadingIcon() {
	const strokeWidth = 100;
	return (
		<motion.svg
			version="1.0"
			xmlns="http://www.w3.org/2000/svg"
			width="150"
			height="150"
			viewBox="0 0 1000 1000"
			preserveAspectRatio="xMidYMid meet"
			initial="hidden" // Start animation from hidden state
			animate="visible"
			className="absolute right-1/2 top-1/2 -translate-y-1/2 translate-x-1/2"
		>
			<motion.g
				transform="translate(0.000000,678.000000) scale(0.100000,-0.100000)"
				fill="#000000"
				stroke="none"
			>
				<motion.path
					d="M6242 6740 c-10 -25 -61 -152 -112 -283 l-94 -238 -202 -152 c-190
-143 -202 -153 -186 -169 17 -17 197 -156 323 -249 l65 -49 58 -147 c32 -82
64 -161 71 -178 7 -16 22 -55 33 -85 39 -107 56 -150 62 -150 6 0 23 43 62
150 11 30 26 69 33 85 7 17 39 97 71 179 l59 149 84 61 c140 102 314 241 313
249 -1 4 -91 75 -200 157 l-199 150 -83 212 c-46 117 -96 245 -111 283 l-27
70 -20 -45z"
					variants={outlineVariants}
					fill="none"
					stroke="black"
					strokeWidth={strokeWidth}
				/>
				<motion.path
					d="M2810 5690 c35 -51 231 -317 324 -440 389 -513 673 -875 692 -883 6
-3 53 6 104 19 184 48 383 28 528 -53 68 -38 182 -137 182 -158 0 -7 -15 -25
-33 -41 -63 -56 -190 -199 -260 -293 -229 -307 -394 -696 -447 -1056 -33 -226
-37 -395 -15 -611 38 -379 148 -700 353 -1029 51 -82 107 -162 123 -175 3 -3
10 -12 15 -22 25 -45 192 -223 294 -312 193 -170 349 -274 567 -378 314 -150
592 -216 956 -225 364 -10 625 37 982 177 125 48 487 259 526 306 22 26 45 14
123 -66 l78 -80 394 0 c217 0 394 4 394 8 0 5 -20 32 -44 60 -211 247 -295
602 -221 928 8 34 37 124 65 200 79 213 121 393 150 639 22 191 4 489 -41 693
-24 108 -33 144 -66 247 -117 367 -326 704 -606 977 -51 50 -77 83 -74 92 8
21 113 103 167 130 137 71 331 87 509 41 98 -25 105 -24 133 10 74 91 389 493
494 630 221 289 537 718 511 695 -3 -3 -72 -71 -154 -151 -171 -168 -248 -236
-428 -375 -432 -334 -967 -613 -1446 -754 l-77 -22 -74 45 c-267 162 -542 260
-893 319 -107 18 -562 18 -665 0 -356 -62 -639 -163 -900 -322 l-85 -52 -50
13 c-241 59 -634 221 -904 371 -58 32 -106 58 -107 58 -7 0 -209 129 -294 188
-237 163 -420 314 -638 527 -84 83 -156 152 -160 155 -3 3 5 -11 18 -30z
m3695 -1475 c199 -29 358 -77 535 -161 497 -237 858 -688 989 -1236 12 -47 21
-94 21 -102 0 -15 -169 -16 -1790 -16 -1698 0 -1790 1 -1790 18 0 36 51 226
86 320 97 260 235 475 429 666 284 280 629 453 1020 511 123 18 377 18 500 0z
m217 -2662 c318 -318 583 -586 588 -595 19 -32 -212 -167 -415 -243 -237 -89
-352 -109 -625 -110 -222 0 -270 6 -400 47 -131 42 -254 121 -338 217 -62 70
-71 84 -120 172 -82 149 -157 403 -212 719 -37 213 -58 355 -54 362 3 5 228 8
501 8 l496 0 579 -577z m1328 560 c0 -35 -61 -258 -94 -342 -64 -166 -201
-411 -230 -411 -12 0 -766 750 -766 762 0 5 245 8 545 8 512 0 545 -1 545 -17z"
					variants={outlineVariants}
					fill="none"
					stroke="black"
					strokeWidth={strokeWidth}
				/>
				<motion.path
					d="M203 3052 c-101 -1 -183 -6 -183 -10 0 -4 48 -34 107 -67 119 -67
241 -151 383 -264 99 -79 359 -333 420 -410 19 -24 49 -60 66 -80 17 -20 57
-73 88 -118 52 -75 62 -84 114 -103 166 -62 428 -103 867 -135 293 -22 973
-30 1330 -15 337 13 395 18 395 32 0 16 -133 169 -221 254 -253 243 -617 454
-1039 602 -147 52 -422 131 -540 155 -14 2 -70 14 -125 25 -488 100 -1030 144
-1662 134z"
					variants={outlineVariants}
					fill="none"
					stroke="black"
					strokeWidth={strokeWidth}
				/>
				<motion.path
					d="M3120 1683 c-340 -26 -723 -98 -1075 -204 -136 -41 -173 -56 -155
-62 8 -3 60 -19 115 -36 168 -53 391 -172 519 -279 27 -22 35 -23 95 -17 142
14 364 88 619 206 46 22 86 39 89 39 18 0 496 250 517 271 15 14 2 20 -81 40
-156 38 -445 57 -643 42z"
					variants={outlineVariants}
					fill="none"
					stroke="black"
					strokeWidth={strokeWidth}
				/>
			</motion.g>
		</motion.svg>
	);
}