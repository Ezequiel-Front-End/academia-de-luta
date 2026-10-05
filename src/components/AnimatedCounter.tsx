import { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  value: string;
}

export function AnimatedCounter({ value }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  const numericMatch = value.match(/\d+/);
  const target = numericMatch ? parseInt(numericMatch[0], 10) : 0;
  const suffix = value.replace(/\d+/g, '');

  useEffect(() => {
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          
          let startTimestamp: number | null = null;
          const duration = 2000; // 2 seconds

          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // easeOutExpo curve for smooth slow down at the end
            const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            
            setCount(Math.floor(easeOutExpo * target));
            
            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              setCount(target);
            }
          };
          
          window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [target, hasAnimated]);

  if (!numericMatch) return <span>{value}</span>;

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
}
