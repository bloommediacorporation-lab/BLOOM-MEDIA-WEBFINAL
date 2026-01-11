<script lang="ts">
  import { T } from '@threlte/core';
  import { BackSide, DoubleSide } from 'three';
  import { RoundedBoxGeometry } from 'three-stdlib';
  import { Environment } from '@threlte/extras';

  type Props = {
    width?: number;
    height?: number;
    depth?: number;
    radius?: number;
    radiusSegments?: number;
    position?: [number, number, number];
    rotation?: [number, number, number];
    envMapIntensity?: number;
    color?: string;
  };

  let {
    width = 25,
    height = 1.2,
    depth = 0.12,
    radius = 0.75,
    radiusSegments = 64,
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    envMapIntensity = 1.5,
    color = '#ffffff'
  }: Props = $props();

  let clampedRadiusSegments = $derived(radiusSegments === 32 ? 32 : 64);
</script>

<!-- HDRI Environment -->
<Environment
  url="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/aerodynamics_workshop_1k.hdr"
  isBackground={false}
/>

<T.Group position={position} rotation={rotation}>
  <!-- Main Glass Mesh -->
  <T.Mesh>
    <T is={RoundedBoxGeometry} args={[width, height, depth, clampedRadiusSegments, radius]} />
    <T.MeshPhysicalMaterial
      {color}
      transmission={1.0}
      thickness={2.0}
      roughness={0.05}
      envMapIntensity={envMapIntensity}
      metalness={0.0}
      ior={1.55}
      dispersion={5.0}
      clearcoat={1.0}
      clearcoatRoughness={0.05}
      attenuationColor="#ffffff"
      attenuationDistance={1.0}
      side={DoubleSide}
      transparent={true}
    />
  </T.Mesh>

  <!-- Rim/Edge Highlight (Fake Caustics/Glow) -->
  <T.Mesh scale={[1.005, 1.005, 1.005]}>
    <T is={RoundedBoxGeometry} args={[width, height, depth, clampedRadiusSegments, radius]} />
    <T.MeshBasicMaterial
      color="#ffffff"
      side={BackSide}
      transparent={true}
      opacity={0.15}
    />
  </T.Mesh>
</T.Group>
