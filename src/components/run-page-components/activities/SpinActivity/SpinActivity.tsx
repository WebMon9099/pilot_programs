import _ from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import {
  Axis,
  OnScreenJoystickPosition,
} from '../../../../context/ControlsContext';
import { useControls } from '../../../../hooks';
import useTimeActivity from '../../../../hooks/useActivity/useTimeActivity/useTimeActivity';
import { animate, appendClass } from '../../../../lib';
import { ActivityComponent } from '../../../../types';
import { BARRIERS_TYPES } from './constants';
import { BarrierType } from './types';

var scene: THREE.Scene;
var camera = new THREE.PerspectiveCamera();
var renderer = new THREE.WebGLRenderer();
var raycaster = new THREE.Raycaster();

const SpinActivity: ActivityComponent = ({
  activityObject,
  activityState,
  activityActions,
  activityParams,
  ...rest
}) => {
  const {
    leftActiveGamepad,
    mouseSensitivity,
    onScreenJoystickPosition,
    setMouseTrackDiv,
    addControlEventListener,
    removeControlEventListener,
  } = useControls();

  const containerRef = useRef<HTMLDivElement>(null);

  const barriers = useRef<THREE.Mesh[]>([]);
  const speed = useRef(0.25);

  const availableBarriers = useRef<{ [key in BarrierType]?: THREE.Mesh }>({});

  const [showRedOverlay, setShowRedOverlay] = useState(false);

  useTimeActivity(activityObject, activityState, activityActions);

  const generateBarrier = useCallback(() => {
    return availableBarriers.current[
      _.sample(BARRIERS_TYPES.filter((type) => type !== 'barrier-hollow'))!
    ]!.clone();
  }, []);

  const addBarrier = useMemo(() => {
    var currentZ = -10;

    return (barrier: THREE.Mesh) => {
      barrier.rotateX(1.5707963268);
      barrier.position.setZ(currentZ);
      barrier.userData = {
        direction: _.sample([1, -1]),
      };

      currentZ -= 30;

      barriers.current = [...barriers.current, barrier];

      scene.add(barrier);
    };
  }, []);

  const removeBarrier = useCallback(
    (barrier: THREE.Mesh) => {
      barrier.geometry.dispose();
      (barrier.material as THREE.Material).dispose();

      scene.remove(barrier);

      barriers.current.splice(barriers.current.indexOf(barrier), 1);

      addBarrier(generateBarrier());
    },
    [addBarrier, generateBarrier]
  );

  const sceneSetup = useCallback(() => {
    if (!containerRef.current) return;

    scene = new THREE.Scene();

    setMouseTrackDiv(containerRef.current);

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 15;

    renderer.setSize(width, height);
    // renderer.outputEncoding = THREE.sRGBEncoding;

    containerRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff);

    scene.background = new THREE.Color(0x7a7a7a);

    scene.add(ambientLight);

    raycaster.far = 2;
  }, [setMouseTrackDiv]);

  const loadModels = useCallback(() => {
    const gltfLoader = new GLTFLoader();

    gltfLoader.load(require('./models/objects.glb'), function onLoad(glb) {
      glb.scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh && obj.name !== 'tunnel')
          availableBarriers.current[obj.name as BarrierType] = obj;
      });

      const tunnel = glb.scene.getObjectByName('tunnel');

      if (!tunnel || !(tunnel instanceof THREE.Mesh)) return;

      tunnel.rotateX(1.5707963268);
      tunnel.material = new THREE.MeshBasicMaterial({
        color: 0xf9f9f9,
      });
      tunnel.scale.setY(3000);

      scene.add(tunnel);

      for (let i = 0; i < 3; ++i)
        addBarrier(availableBarriers.current['barrier-hollow']!.clone());
    });
  }, [addBarrier]);

  useEffect(() => {
    sceneSetup();

    loadModels();

    return () => {
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh && obj.geometry) {
          (obj.geometry as THREE.BufferGeometry).dispose();

          if (Array.isArray(obj.material))
            obj.material.forEach((mtl) => {
              if (mtl instanceof THREE.Material) mtl.dispose();
            });
          else if (obj.material instanceof THREE.Material)
            obj.material.dispose();
        }
      });
    };
  }, [loadModels, sceneSetup]);

  useEffect(() => {
    function onAxesChange(
      axes: Axis,
      sensitivityX: number,
      sensitivityY: number
    ) {
      if (activityState.paused) return;

      const targetPosition = camera.position.clone();

      targetPosition.x += axes.x * 0.15 * (sensitivityX / 50);
      targetPosition.y += axes.y * 0.15 * (sensitivityY / 50);

      if (!isOutOfBounds(targetPosition)) {
        camera.position.set(
          targetPosition.x,
          targetPosition.y,
          targetPosition.z
        );
      }
    }

    function isOutOfBounds(targetPosition: THREE.Vector3) {
      return !(
        Math.pow(Math.abs(targetPosition.x), 2) +
          Math.pow(Math.abs(targetPosition.y), 2) <
        Math.pow(10, 2)
      );
    }

    var keyPressListener: number;
    if (onScreenJoystickPosition === OnScreenJoystickPosition.Right) {
      keyPressListener = addControlEventListener('arrow-key-press', (keys) => {
        if (activityState.paused) return;

        const targetPosition = camera.position.clone();

        if (keys.up) {
          targetPosition.y += 0.15;
        }
        if (keys.right) {
          targetPosition.x += 0.15;
        }
        if (keys.down) {
          targetPosition.y -= 0.15;
        }
        if (keys.left) {
          targetPosition.x -= 0.15;
        }

        if (!isOutOfBounds(targetPosition)) {
          camera.position.set(
            targetPosition.x,
            targetPosition.y,
            targetPosition.z
          );
        }
      });
    } else if (onScreenJoystickPosition === OnScreenJoystickPosition.Left) {
      keyPressListener = addControlEventListener('wasd-key-press', (keys) => {
        if (activityState.paused) return;

        const targetPosition = camera.position.clone();

        if (keys.w) {
          targetPosition.y += 0.15;
        }
        if (keys.d) {
          targetPosition.x += 0.15;
        }
        if (keys.s) {
          targetPosition.y -= 0.15;
        }
        if (keys.a) {
          targetPosition.x -= 0.15;
        }

        if (!isOutOfBounds(targetPosition)) {
          camera.position.set(
            targetPosition.x,
            targetPosition.y,
            targetPosition.z
          );
        }
      });
    }

    const physicalAxesChangeListener = addControlEventListener(
      'left-physical-axes-change',
      (axes) =>
        onAxesChange(
          axes,
          leftActiveGamepad?.sensitivityX || 0,
          leftActiveGamepad?.sensitivityY || 0
        )
    );

    var onScreenJoystickAxesChangeListener: number;
    if (onScreenJoystickPosition !== OnScreenJoystickPosition.Disabled)
      onScreenJoystickAxesChangeListener = addControlEventListener(
        'on-screen-joystick-axes-change',
        (axes) => onAxesChange(axes, 50, 50)
      );

    var mouseAxesChangeListener: number;
    if (onScreenJoystickPosition === OnScreenJoystickPosition.Disabled)
      mouseAxesChangeListener = addControlEventListener(
        'mouse-axes-change',
        (axes) => onAxesChange(axes, mouseSensitivity, mouseSensitivity)
      );

    const speedChangeListener = addControlEventListener(
      'speed-change',
      (newSpeed) => {
        speed.current = (newSpeed + 2) * 0.15;
      }
    );

    return () => {
      removeControlEventListener(
        keyPressListener,
        physicalAxesChangeListener,
        onScreenJoystickAxesChangeListener,
        mouseAxesChangeListener,
        speedChangeListener
      );
    };
  }, [
    activityState.paused,
    addControlEventListener,
    removeControlEventListener,
    leftActiveGamepad,
    mouseSensitivity,
    onScreenJoystickPosition,
  ]);

  useEffect(() => {
    return animate(() => {
      if (barriers.current.length > 0 && !activityState.paused) {
        raycaster.setFromCamera(
          new THREE.Vector2(camera.position.x, camera.position.y),
          camera
        );

        camera.translateZ(-speed.current);

        const currentBarrier = barriers.current[0];
        if (raycaster.intersectObject(currentBarrier).length !== 0) {
          activityActions.activityIncreaseMaxScore(1);

          setShowRedOverlay(true);

          setTimeout(() => {
            setShowRedOverlay(false);
          }, 1000 / (speed.current * 4));

          removeBarrier(currentBarrier);
        } else if (camera.position.z <= currentBarrier.position.z) {
          activityActions.activityIncreaseMaxScore(1);

          if (currentBarrier.name !== 'barrier-hollow')
            activityActions.activityIncreaseScore(1);
          removeBarrier(currentBarrier);
        }

        if (
          activityState.trainingMode &&
          currentBarrier.name !== 'barrier-hollow'
        ) {
          const material = (currentBarrier.material as THREE.Material).clone();
          material.transparent = true;
          material.opacity = 0.6;
          currentBarrier.material = material;
        }

        barriers.current.forEach((barrier) => {
          if (barrier.parent !== scene) addBarrier(barrier);

          barrier.rotation.y -=
            0.015 * activityState.speed * barrier.userData.direction;
        });
      }

      renderer.render(scene, camera);
    });
  }, [
    activityActions,
    activityState.paused,
    activityState.trainingMode,
    activityState.speed,
    addBarrier,
    removeBarrier,
  ]);

  return (
    <div
      {...rest}
      className={appendClass('activity spin-activity', rest.className)}
      ref={containerRef}
    >
      {showRedOverlay && (
        <div
          className="red-overlay"
          style={{
            animationDuration: `${1000 / (speed.current * 4) / 1000}s`,
          }}
        />
      )}
      <img
        className="crosshair"
        src={require('./images/svgs/target.svg').default}
        alt="target"
      />
    </div>
  );
};

export default SpinActivity;
