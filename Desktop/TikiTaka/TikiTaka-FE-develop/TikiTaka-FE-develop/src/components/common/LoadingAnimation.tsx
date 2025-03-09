import {motion} from 'framer-motion';

export default function LoadingAnimation() {
  return (
    <div className="flex items-center justify-center gap-3">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{
            rotate: [0, 360],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.2,
            ease: 'easeInOut',
            delay: i * 0.3,
          }}
          className="w-4 h-4 bg-main rounded-full"
        />
      ))}
    </div>
  );
}
