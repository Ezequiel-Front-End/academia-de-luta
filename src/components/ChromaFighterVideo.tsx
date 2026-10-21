import React, { useEffect, useRef, useState } from 'react';

interface ChromaFighterVideoProps {
  src: string;
  poster?: string;
  className?: string;
  threshold?: number;
  feather?: number;
  scaleX?: number;
  scaleY?: number;
}

export function ChromaFighterVideo({
  src,
  poster,
  className = '',
  threshold = 32,
  feather = 18,
  scaleX = 1,
  scaleY = 1,
}: ChromaFighterVideoProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let isPlaying = false;

    // Processa o frame removendo o fundo preto/escuro pixel a pixel
    const processFrame = () => {
      if (!video || !canvas || video.paused && video.currentTime === 0) return;

      const width = canvas.width;
      const height = canvas.height;
      if (width === 0 || height === 0) return;

      // Desenha o frame atual do vídeo no canvas
      ctx.drawImage(video, 0, 0, width, height);

      try {
        const frame = ctx.getImageData(0, 0, width, height);
        const data = frame.data;
        const len = data.length;

        // Limiar de corte de luminância para remover o preto de estúdio
        const cutThreshold = threshold;
        const cutFeather = feather;

        for (let i = 0; i < len; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Calcula a intensidade máxima do pixel
          const max = r > g ? (r > b ? r : b) : (g > b ? g : b);

          if (max <= cutThreshold) {
            // 100% transparente: fundo do card do site aparece limpo por trás
            data[i + 3] = 0;
          } else if (max < cutThreshold + cutFeather) {
            // Suavização anti-aliasing na transição para não serrilhar
            data[i + 3] = Math.round(((max - cutThreshold) / cutFeather) * 255);
          }
        }

        ctx.putImageData(frame, 0, 0);
      } catch (err) {
        // Fallback silencioso caso ocorra restrição
      }

      // Continua a animação enquanto o vídeo estiver rodando
      if (!video.paused && !video.ended) {
        animFrameRef.current = requestAnimationFrame(processFrame);
      }
    };

    const handlePlay = () => {
      isPlaying = true;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = requestAnimationFrame(processFrame);
    };

    const handleEnded = () => {
      isPlaying = false;
      // Garante que o último frame fique renderizado com fundo transparente
      processFrame();
    };

    const handleLoadedMetadata = () => {
      // Ajusta o tamanho interno do canvas para proporção de alta nitidez
      const targetWidth = video.videoWidth || 480;
      const targetHeight = video.videoHeight || 640;
      canvas.width = Math.min(targetWidth, 540);
      canvas.height = Math.min(targetHeight, 720);
      setIsLoaded(true);

      // Renderiza primeiro frame limpo
      video.currentTime = 0.05;
      setTimeout(processFrame, 100);
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    // Observador de Scroll para iniciar quando o usuário rolar até a seção
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.currentTime = 0;
            video.play().catch(() => {});
          } else {
            video.pause();
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      observer.disconnect();
    };
  }, [threshold, feather]);

  const handleReplay = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={handleReplay}
      className={`relative flex items-end justify-center select-none cursor-pointer ${className}`}
      style={{
        transform: `scale(${scaleX}, ${scaleY})`,
        transformOrigin: 'bottom center',
      }}
      title="Clique para reproduzir novamente a apresentação"
    >
      {/* Elemento de vídeo oculto usado como fonte de dados */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        playsInline
        preload="auto"
        className="hidden"
      />

      {/* Canvas com transparência real em tempo de execução */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain object-bottom drop-shadow-2xl"
      />
    </div>
  );
}
