declare namespace YT {
  interface PlayerOptions {
    height?: string | number;
    width?: string | number;
    videoId?: string;
    playerVars?: {
      autoplay?: 0 | 1;
      controls?: 0 | 1;
      enablejsapi?: 0 | 1;
      fs?: 0 | 1;
      rel?: 0 | 1;
      showinfo?: 0 | 1;
      start?: number;
      end?: number;
      modestbranding?: 1;
      playsinline?: 0 | 1;
      [key: string]: any;
    };
    events?: {
      onReady?: (event: YT.PlayerEvent) => void;
      onStateChange?: (event: YT.OnStateChangeEvent) => void;
      onPlaybackQualityChange?: (event: YT.PlaybackQualityEvent) => void;
      onPlaybackRateChange?: (event: YT.PlaybackRateEvent) => void;
      onError?: (event: YT.OnErrorEvent) => void;
      onApiChange?: (event: YT.ApiChangeEvent) => void;
    };
  }

  interface PlayerEvent {
    target: YT.Player;
  }

  interface OnStateChangeEvent extends PlayerEvent {
    data: number;
  }

  interface PlaybackQualityEvent extends PlayerEvent {
    data: string;
  }

  interface PlaybackRateEvent extends PlayerEvent {
    data: number;
  }

  interface OnErrorEvent extends PlayerEvent {
    data: number;
  }

  interface ApiChangeEvent extends PlayerEvent {}

  class Player {
    constructor(elementId: string | HTMLElement, options: YT.PlayerOptions);
    loadVideoById(videoId: string, startSeconds?: number): void;
    cueVideoById(videoId: string, startSeconds?: number): void;
    playVideo(): void;
    pauseVideo(): void;
    stopVideo(): void;
    seekTo(seconds: number, allowSeekAhead: boolean): void;
    getPlayerState(): number;
    getCurrentTime(): number;
    getDuration(): number;
    getVideoUrl(): string;
    getVideoEmbedCode(): string;
    getVolume(): number;
    setVolume(volume: number): void;
    mute(): void;
    unMute(): void;
    isMuted(): boolean;
    setSize(width: number, height: number): void;
    getPlaybackRate(): number;
    setPlaybackRate(rate: number): void;
    getAvailablePlaybackRates(): number[];
    getPlaybackQuality(): string;
    setPlaybackQuality(quality: string): void;
    getAvailableQualityLevels(): string[];
    getCurrentTime(): number;
    getDuration(): number;
    removeEventListener(event: string, listener: (event: any) => void): void;
    addEventListener(event: string, listener: (event: any) => void): void;
    destroy(): void;
  }

  const PlayerState: {
    UNSTARTED: number;
    ENDED: number;
    PLAYING: number;
    PAUSED: number;
    BUFFERING: number;
    CUED: number;
  };
}

interface Window {
  YT: typeof YT;
  onYouTubeIframeAPIReady: () => void;
}
