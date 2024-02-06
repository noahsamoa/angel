    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Create angel geometry and material
    const angelGeometry = new THREE.TextBufferGeometry("A", {
      font: "helvetiker",
      size: 5,
      height: 1
    });
    const angelMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const angelMesh = new THREE.Mesh(angelGeometry, angelMaterial);
    scene.add(angelMesh);

    // Create rings of different sizes
    const ringSizes = [20, 18, 16, 14, 12]; // Different ring sizes

    for (let i = 0; i < ringSizes.length; i++) {
      // Gold material
      const goldMaterial = new THREE.MeshPhongMaterial({ color: 0xffd700, shininess: 100, emissive: 0xffd700, emissiveIntensity: 0.5 });
      const goldGeometry = new THREE.TorusGeometry(ringSizes[i] - 0.5, 0.5, 16, 100); // Decrease the radius by 0.5
      const goldMesh = new THREE.Mesh(goldGeometry, goldMaterial);
      goldMesh.castShadow = true; // Enable cast shadow
      goldMesh.receiveShadow = true; // Enable receive shadow
      scene.add(goldMesh);

      // Flame effect material
      const flameMaterial = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('https://threejs.org/examples/textures/lava/lavatile.jpg'), transparent: true, opacity: 0.5 });
      const flameGeometry = new THREE.TorusGeometry(ringSizes[i], 1, 16, 100);
      const flameMesh = new THREE.Mesh(flameGeometry, flameMaterial);
      flameMesh.position.y = 0.1; // Position slightly above the gold mesh
      scene.add(flameMesh);

      const ringGroup = new THREE.Group();
      ringGroup.add(goldMesh);
      ringGroup.add(flameMesh);

      scene.add(ringGroup);

      // Randomize initial orientation
      ringGroup.rotation.x = Math.random() * Math.PI * 2;
      ringGroup.rotation.y = Math.random() * Math.PI * 2;

      // Adjust rotation speed for all rings
      ringGroup.rotationSpeed = 0.015; // Make rotation slightly slower
    }

    // Create white eye geometry and material
    const eyeShape = new THREE.Shape();
    eyeShape.moveTo(0, 0);
    eyeShape.quadraticCurveTo(6, 6, 12, 0);
    eyeShape.quadraticCurveTo(6, -6, 0, 0);

    const eyeGeometry = new THREE.ShapeGeometry(eyeShape);
    const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const eyeMesh = new THREE.Mesh(eyeGeometry, eyeMaterial);
    scene.add(eyeMesh);

    // Center the white eye within the rings and make it bigger
    eyeMesh.position.set(-7, 0, 0);
    eyeMesh.scale.set(1.2, 1.2, 1.2); // Slightly bigger than the original eye

    // Create golden eye geometry and material
    const goldenEyeShape = new THREE.Shape();
    goldenEyeShape.moveTo(0, 0);
    goldenEyeShape.quadraticCurveTo(7, 7, 14, 0);
    goldenEyeShape.quadraticCurveTo(7, -7, 0, 0);

    const goldenEyeGeometry = new THREE.ShapeGeometry(goldenEyeShape);
    const goldenEyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, emissive: 0xffd700, emissiveIntensity: 0.5 });
    const goldenEyeMesh = new THREE.Mesh(goldenEyeGeometry, goldenEyeMaterial);
    scene.add(goldenEyeMesh);

    // Position the golden eye behind the white eye and slightly larger
    goldenEyeMesh.position.set(-9, 0, -0.1);
    goldenEyeMesh.scale.set(1.3, 1.3, 1.3); // Slightly bigger than the white eye


    // Create pupil geometry and material
    const pupilGeometry = new THREE.CircleGeometry(1, 32);
    const pupilMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const pupilMesh = new THREE.Mesh(pupilGeometry, pupilMaterial);
    pupilMesh.scale.set(2.1, 2.1, 2.1); // Scale up the eye
    pupilMesh.position.set(0, 0, 1); // Set pupil position relative to the eye
    scene.add(pupilMesh);

    // Create monospace text geometry and material
    const textGeometry = new THREE.TextGeometry("Behind Text", {
      font: "monospace",
      size: 2,
      height: 0.2
    });
    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.z = -10; // Position the text behind the main elements
    textMesh.position.y = 0; // Center the text vertically
    textMesh.position.x = 0; // Center the text horizontally
    scene.add(textMesh);

    // Set initial camera position
    camera.position.z = 100; // Change the distance of the camera from the subject

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Function to animate the scene
    function animate() {
      requestAnimationFrame(animate);

      // Rotate the angel mesh
      angelMesh.rotation.x += 0.005;
      angelMesh.rotation.y += 0.005;

      // Iterate over each ring group
      scene.children.forEach(child => {
        if (child instanceof THREE.Group) {
          // Rotate the child
          child.rotation.x += child.rotationSpeed;
          child.rotation.y += child.rotationSpeed;

          // Calculate the position on a circular path
          const time = Date.now() * 0.001; // Get current time in seconds
          const radius = 4; // Radius of the circular path
          const angle = time * 0.5; // Adjust the speed of rotation
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          child.position.set(x, 0, z);
        }
      });

      // Wobble the eye shapes up and down
      eyeMesh.position.y = Math.sin(Date.now() * 0.001) * 0.2; // Adjust the amplitude as needed
      pupilMesh.position.y = Math.sin(Date.now() * 0.001) * 0.2; // Adjust the amplitude as needed
      goldenEyeMesh.position.y = Math.sin(Date.now() * 0.001) * 0.2;
      renderer.render(scene, camera);
    }

    // Start animation
    animate();
