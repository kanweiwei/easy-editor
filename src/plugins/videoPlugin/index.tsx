import React, { useRef, useState, useEffect } from "react";
import videojs, { VideoJsPlayerOptions, VideoJsPlayer } from "video.js";
import "video.js/dist/video-js.css";
import "./style.less";

type VideoPlayerProps = VideoJsPlayerOptions;

export const VideoPlayer: React.FC<VideoPlayerProps> = (options) => {
  const videoNode = useRef(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [player, setPlayer] = useState<VideoJsPlayer | undefined>(undefined);
  const handlePlayerReady = () => console.log("Video Player Ready");

  useEffect(() => {
    let width = wrapperRef.current?.clientWidth ?? options.width ?? 500;
    width = Math.min(width, 1200);
    setPlayer(
      videojs(
        videoNode.current,
        {
          ...options,
          width,
          html5: {
            hls: {
              overrideNative: true,
            },
            vhs: {
              overrideNative: true,
            },
            nativeAudioTracks: false,
            nativeVideoTracks: false,
          },
        },
        handlePlayerReady
      )
    );
  }, []);

  useEffect(() => {
    return () => {
      if (player) {
        player.dispose();
      }
    };
  }, [player]);
  // wrap the player in a div with a `data-vjs-player` attribute
  // so videojs won't create additional wrapper in the DOM
  // see https://github.com/videojs/video.js/pull/3856
  return (
    <div className={"video-player"} ref={wrapperRef}>
      <div data-vjs-player>
        <video ref={videoNode} className="video-js"></video>
      </div>
    </div>
  );
};
