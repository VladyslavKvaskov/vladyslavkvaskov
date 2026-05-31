import { useEffect, RefObject } from "react";
import * as THREE from "three";

export interface WebGLWaveOptions {
  waveSpeed?: number;
  waveFrequency?: number;
  waveAmplitude?: number;
  wireframe?: boolean;
  alwaysAnimate?: boolean;
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
    alwaysAnimate = false,
  } = options;

  useEffect(() => {
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
        uEffectIntensity: { value: alwaysAnimate ? 1.0 : 0.0 },
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

      // Initial render frame execution to draw the base image safely
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

      // Re-trigger static snapshot draw on width changes
      renderer.render(scene, camera);
    });

    resizeObserver.observe(img);

    // 5. Smart Loop Management Engine Properties
    let targetIntensity = alwaysAnimate ? 1.0 : 0.0;
    let currentIntensity = alwaysAnimate ? 1.0 : 0.0;
    let isLoopRunning = false;
    let animationFrameId: number;
    const timer = new THREE.Timer();

    // The conditional frame executor engine
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      timer.update();

      material.uniforms.uTime.value = timer.getElapsed() * waveSpeed;

      if (!alwaysAnimate) {
        currentIntensity += (targetIntensity - currentIntensity) * 0.15;
        material.uniforms.uEffectIntensity.value = currentIntensity;

        // CRITICAL PERFORMANCE FIX:
        // Break out and kill the requestAnimationFrame loop once the mesh settles completely flat
        if (targetIntensity === 0.0 && currentIntensity < 0.001) {
          currentIntensity = 0.0;
          material.uniforms.uEffectIntensity.value = 0.0;
          renderer.render(scene, camera); // Final flat snapshot draw
          cancelAnimationFrame(animationFrameId);
          isLoopRunning = false;
          return;
        }
      }

      renderer.render(scene, camera);
    };

    // Helper method to safely spin up loop routines
    const startAnimationLoop = () => {
      if (!isLoopRunning) {
        isLoopRunning = true;
        animate();
      }
    };

    // 6. Interaction Listeners
    const handleMouseEnter = (): void => {
      if (!alwaysAnimate) {
        targetIntensity = 1.0;
        startAnimationLoop(); // Wake loop context up instantly
      }
    };

    const handleMouseLeave = (): void => {
      if (!alwaysAnimate) {
        targetIntensity = 0.0; // The loop will auto-kill inside animate() once flat
      }
    };

    const triggerElement = container.closest(".wave-effect-trigger");

    if (!alwaysAnimate && triggerElement) {
      triggerElement.addEventListener("mouseenter", handleMouseEnter);
      triggerElement.addEventListener("mouseleave", handleMouseLeave);
    }

    // Spin up permanently only if alwaysAnimate property is true
    if (alwaysAnimate) {
      startAnimationLoop();
    }

    // 7. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();

      if (!alwaysAnimate && triggerElement) {
        triggerElement.removeEventListener("mouseenter", handleMouseEnter);
        triggerElement.removeEventListener("mouseleave", handleMouseLeave);
      }

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
    alwaysAnimate,
  ]);
};
