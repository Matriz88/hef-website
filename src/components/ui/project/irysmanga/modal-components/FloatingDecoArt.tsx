/* eslint-disable */
import { motion, useDragControls } from 'framer-motion';
import { useState } from 'react';

interface IProps {
    src: string;
    className: string;
    width?: string;
}

export default function FloatingDecoArt({ src, className, width }: IProps) {
    const controls = useDragControls();
    const [state, setState] = useState('initial');
    const [isDragging, setIsDragging] = useState(false);
    const [justDragged, setJustDragged] = useState(false);
    const imgs: { [key: string]: string } = {
        initial: '/assets/irysmanga/chibi/keychainrys.png',
        falling: '/assets/irysmanga/chibi/fallingrys.png',
        flat: '/assets/irysmanga/chibi/flatrys.png',
    };

    const handleDragStart = () => {
        setState('initial');
        setIsDragging(true);
    };

    const handleDragEnd = (event: any, info: any) => {
        setState('falling');
        setIsDragging(false);
    };

    const handleAnimationComplete = () => {
        if (state === 'initial') {
            setJustDragged(true);
            return;
        }
        if (justDragged) {
            setJustDragged(false);
            return;
        }
        setState('flat');
    };
    const strugglingAnimation = {
        x: [0, 20, -20, 15, -15, 10, -10, 5, -5, 0],
    };
    const getAnimation = () => {
        if (state === 'falling' || state === 'flat') {
            return { y: 1000 };
        }
        if (isDragging) {
            return {
                x: [0, 5, -5, 5, -10, 10],
            };
        }
    };
    const getTransition = () => {
        if (state === 'falling' || state === 'flat') {
            return { duration: 1, ease: 'easeInOut' };
        }
        if (isDragging) {
            return {
                transition: {
                    duration: 1,
                    ease: 'easeInOut',
                    repeat: Infinity,
                },
            };
        }
    };
    console.log(isDragging);
    return (
        <motion.div
            drag={true}
            dragElastic={0.5}
            onDragEnd={handleDragEnd}
            dragControls={controls}
            onPointerDown={(e) => {
                controls.start(e);
                handleDragStart();
            }}
            initial={{ y: 0 }}
            animate={getAnimation()} // Animation to fall down
            transition={getTransition()}
            onAnimationComplete={handleAnimationComplete}
        >
            <motion.img
                src={imgs[state]} // Conditionally render the fallen image
                alt="bg-art"
                width={width}
                draggable={false}
            />
        </motion.div>
    );
}
/* eslint-enabled */
