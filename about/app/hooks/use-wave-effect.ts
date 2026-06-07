import { useEffect, RefObject, useRef, useCallback } from "react";
import * as THREE from "three";

export interface WebGLWaveOptions {
  waveSpeed?: number;
  waveFrequency?: number;
  waveAmplitude?: number;
  wireframe?: boolean;
  pauseWhenOffscreen?: boolean;
  offscreenThreshold?: number;
  lazyInit?: boolean;
  lazyInitThreshold?: number;
}

export const useWebGLImageWave = (
  containerRef: RefObject<HTMLElement | null>,
  imageRef: RefObject<HTMLElement | null>,
  options: WebGLWaveOptions = {},
): void => {
  const {
    waveSpeed = 2.0,
    waveFrequency = 3.0,
    waveAmplitude = 12.0,
    wireframe = false,
    pauseWhenOffscreen = true,
    offscreenThreshold = 0.1,
    lazyInit = true,
    lazyInitThreshold = 0.1,
  } = options;

  // Use refs instead of state to avoid re-renders
  const hasInitializedRef = useRef(false);
  const initObserverRef = useRef<IntersectionObserver | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  // Store animation state in refs for persistence
  const animationStateRef = useRef({
    isPlaying: true,
    isLoopRunning: false,
    isInitialized: false,
  });

  // Define initializeWebGL with useCallback to prevent recreation
  const initializeWebGL = useCallback(() => {
    // Prevent duplicate initialization
    if (animationStateRef.current.isInitialized) return;
    animationStateRef.current.isInitialized = true;

    const container = containerRef?.current;
    if (!container) return;

    const currentRef = imageRef?.current;
    const img =
      currentRef?.tagName === "IMG"
        ? (currentRef as HTMLImageElement)
        : (currentRef?.querySelector("img") as HTMLImageElement | null);

    if (!img) return;

    const currentContainerWidth = img.clientWidth || 100;
    const currentContainerHeight = img.clientHeight || 100;

    // 1. Scene, Camera, Renderer Setup
    const scene = new THREE.Scene();
    const fov = 45;

    let width = currentContainerWidth;
    let height = currentContainerHeight;

    const camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);

    const canvasElement = renderer.domElement;
    canvasElement.style.position = "absolute";
    canvasElement.style.pointerEvents = "none";
    canvasElement.style.top = `${img.offsetTop}px`;
    canvasElement.style.left = `${img.offsetLeft}px`;
    container.appendChild(canvasElement);

    // 2. Wave Shaders
    const vertexShader = `
      uniform float uTime;
      uniform float uFrequency;
      uniform float uAmplitude;
      uniform float uEffectIntensity;
      varying vec2 vUv;
      
      void main() {
        vUv = uv;
        vec3 pos = position;
        
        float freqX = uFrequency * 0.05;
        float globalWave = sin(pos.x * freqX + uTime) * uAmplitude;
        
        pos.z += globalWave * uEffectIntensity;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    const fragmentShader = `
      uniform sampler2D uTexture;
      uniform vec2 uPlaneResolution;
      uniform vec2 uTextureResolution;
      varying vec2 vUv;
      
      void main() {
        float planeRatio = uPlaneResolution.x / uPlaneResolution.y;
        float textureRatio = uTextureResolution.x / uTextureResolution.y;
        
        vec2 uvCover = vUv;
        if (planeRatio > textureRatio) {
          float scale = planeRatio / textureRatio;
          uvCover.y = (uvCover.y - 0.5) / scale + 0.5;
        } else {
          float scale = textureRatio / planeRatio;
          uvCover.x = (uvCover.x - 0.5) / scale + 0.5;
        }
        
        gl_FragColor = texture2D(uTexture, uvCover);
      }
    `;

    // 3. Geometry & Shader Material Setup
    const textureLoader = new THREE.TextureLoader();
    let geometry = new THREE.PlaneGeometry(width, height, 32, 32);

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0.0 },
        uFrequency: { value: waveFrequency },
        uAmplitude: { value: waveAmplitude },
        uEffectIntensity: { value: 1.0 },
        uPlaneResolution: { value: new THREE.Vector2(width, height) },
        uTextureResolution: { value: new THREE.Vector2(100, 100) },
        uTexture: { value: new THREE.Texture() },
      },
      wireframe,
      transparent: true,
    });

    let mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let textureLoaded = false;
    textureLoader.load(img.src, (loadedTexture: THREE.Texture) => {
      loadedTexture.minFilter = THREE.LinearFilter;
      loadedTexture.generateMipmaps = false;
      loadedTexture.needsUpdate = true;

      const texImage = loadedTexture.image as HTMLImageElement | null;
      const imgWidth = texImage?.naturalWidth || texImage?.width || 100;
      const imgHeight = texImage?.naturalHeight || texImage?.height || 100;

      material.uniforms.uTexture.value = loadedTexture;
      material.uniforms.uTextureResolution.value.set(imgWidth, imgHeight);

      const targetImageElement = img;
      targetImageElement.style.opacity = "0";
      textureLoaded = true;

      renderer.render(scene, camera);
    });

    // 4. Object-Fit Responsive Resize Observer Engine
    const resizeObserver = new ResizeObserver(() => {
      width = img.clientWidth || 100;
      height = img.clientHeight || 100;

      renderer.setSize(width, height);
      camera.aspect = width / height;

      const cameraDistance = height / (2 * Math.tan((fov * Math.PI) / 360));
      camera.position.z = cameraDistance;
      camera.updateProjectionMatrix();

      canvasElement.style.top = `${img.offsetTop}px`;
      canvasElement.style.left = `${img.offsetLeft}px`;

      material.uniforms.uPlaneResolution.value.set(width, height);

      scene.remove(mesh);
      geometry.dispose();

      geometry = new THREE.PlaneGeometry(width, height, 32, 32);
      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      if (textureLoaded) {
        (material.uniforms.uTexture.value as THREE.Texture).needsUpdate = true;
      }

      if (animationStateRef.current.isPlaying) {
        renderer.render(scene, camera);
      }
    });

    resizeObserver.observe(img);

    // 5. Intersection Observer for Offscreen Detection
    let intersectionObserver: IntersectionObserver | null = null;

    if (pauseWhenOffscreen) {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const isVisible = entry.isIntersecting;

            if (isVisible && !animationStateRef.current.isPlaying) {
              animationStateRef.current.isPlaying = true;
            } else if (!isVisible && animationStateRef.current.isPlaying) {
              animationStateRef.current.isPlaying = false;
            }
          });
        },
        {
          threshold: offscreenThreshold,
          rootMargin: "0px",
        },
      );

      intersectionObserver.observe(img);
    }

    // 6. Animation Loop
    let animationFrameId: number | undefined;
    let lastTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (animationStateRef.current.isPlaying) {
        const currentTime = performance.now();
        const delta = (currentTime - lastTime) / 1000;
        lastTime = currentTime;

        material.uniforms.uTime.value += delta * waveSpeed;
        renderer.render(scene, camera);
      } else {
        renderer.render(scene, camera);
      }
    };

    animate();
    animationStateRef.current.isLoopRunning = true;

    // Store cleanup function
    cleanupRef.current = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      if (intersectionObserver) {
        intersectionObserver.disconnect();
      }

      resizeObserver.disconnect();

      const targetImageElement = img;
      if (targetImageElement) targetImageElement.style.opacity = "1";

      if (container.contains(canvasElement)) {
        container.removeChild(canvasElement);
      }

      if (material.uniforms.uTexture.value) {
        (material.uniforms.uTexture.value as THREE.Texture).dispose();
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [
    containerRef,
    imageRef,
    waveSpeed,
    waveFrequency,
    waveAmplitude,
    wireframe,
    pauseWhenOffscreen,
    offscreenThreshold,
  ]);

  // Lazy initialization effect
  useEffect(() => {
    if (!lazyInit) {
      // Initialize immediately
      initializeWebGL();
      return;
    }

    const container = containerRef?.current;
    const currentRef = imageRef?.current;
    const img =
      currentRef?.tagName === "IMG"
        ? (currentRef as HTMLImageElement)
        : (currentRef?.querySelector("img") as HTMLImageElement | null);

    if (!container || !img) return;

    // Create observer to wait for element to become visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasInitializedRef.current) {
            hasInitializedRef.current = true;
            observer.disconnect();
            initializeWebGL();
          }
        });
      },
      {
        threshold: lazyInitThreshold,
        rootMargin: "50px",
      },
    );

    observer.observe(img);
    initObserverRef.current = observer;

    return () => {
      if (initObserverRef.current) {
        initObserverRef.current.disconnect();
      }
    };
  }, [lazyInit, lazyInitThreshold, initializeWebGL, containerRef, imageRef]); // Now includes initializeWebGL

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, []);
};
