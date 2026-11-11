/*
  THREEJS_scene.js
  Programmatic/parametric house scene generator.

  Coordinate convention used by the viewer and JSON exports:
    x = east-west, positive east
    y = down-up, positive up
    z = north-south, positive south

  All dimensions in this sample are metres. Keep your measurement registry in mm
  if you prefer; convert the final result parameters before using them here.
*/
(function () {
  function createNeutralMaterial(THREE, name, color, opacity) {
    const mat = new THREE.MeshStandardMaterial({
      name,
      color,
      roughness: 0.78,
      metalness: 0.0,
      side: THREE.DoubleSide,
      transparent: opacity < 1,
      opacity
    });
    return mat;
  }

  function wallSegment(THREE, spec, material) {
    const dx = spec.x2 - spec.x1;
    const dz = spec.z2 - spec.z1;
    const length = Math.hypot(dx, dz);
    const height = spec.height;
    const thickness = spec.thickness;
    const geometry = new THREE.BoxGeometry(length, height, thickness);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = spec.id;
    mesh.position.set((spec.x1 + spec.x2) / 2, spec.baseY + height / 2, (spec.z1 + spec.z2) / 2);
    mesh.rotation.y = -Math.atan2(dz, dx);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData = {
      type: "parametricWallSegment",
      parameters: spec,
      measurementRefs: spec.measurementRefs || [],
      namedVertices: boxNamedVertices(spec.id, length, height, thickness)
    };
    return mesh;
  }

  function floorPolygon(THREE, spec, material) {
    const shape = new THREE.Shape();
    spec.points.forEach((p, i) => {
      // Shape coordinates are x/y. Use -z so that positive z remains south after rotateX(-PI/2).
      if (i === 0) shape.moveTo(p.x, -p.z);
      else shape.lineTo(p.x, -p.z);
    });
    shape.closePath();

    const geometry = new THREE.ShapeGeometry(shape);
    geometry.rotateX(-Math.PI / 2);
    geometry.translate(0, spec.y || 0, 0);

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = spec.id;
    mesh.receiveShadow = true;
    mesh.userData = {
      type: "parametricFloorPolygon",
      parameters: spec,
      measurementRefs: spec.measurementRefs || [],
      namedVertices: spec.points.map((p, idx) => ({
        id: `${spec.id}_P${idx + 1}`,
        x: p.x,
        y: spec.y || 0,
        z: p.z,
        source: p.source || null
      }))
    };
    return mesh;
  }

  function boxNamedVertices(id, length, height, depth) {
    const lx = length / 2;
    const hy = height / 2;
    const dz = depth / 2;
    return [
      ["LDB", -lx, -hy, -dz], ["RDB", lx, -hy, -dz], ["RTB", lx, hy, -dz], ["LTB", -lx, hy, -dz],
      ["LDF", -lx, -hy, dz],  ["RDF", lx, -hy, dz],  ["RTF", lx, hy, dz],  ["LTF", -lx, hy, dz]
    ].map(([suffix, x, y, z]) => ({ id: `${id}_${suffix}`, localX: x, localY: y, localZ: z }));
  }

  window.buildThreeJSScene = function buildThreeJSScene(ctx) {
    const THREE = ctx.THREE;
    const root = ctx.root;

    const materials = {
      floor: createNeutralMaterial(THREE, "neutral_floor", 0x8a8a8a, 0.65),
      externalWall: createNeutralMaterial(THREE, "neutral_external_wall", 0xd8d8d8, 0.72),
      internalWall: createNeutralMaterial(THREE, "neutral_internal_wall", 0xb8c7d9, 0.58),
      checkpoint: createNeutralMaterial(THREE, "neutral_checkpoint", 0xff9940, 0.9)
    };

    const params = {
      wallHeight: 2.70,
      externalWallThickness: 0.29,
      internalWallThickness: 0.12,
      houseWidthEW: 6.40,
      houseDepthNS: 9.10,
      kitchenDepthNS: 3.60,
      livingDepthNS: 5.50
    };

    const floor = floorPolygon(THREE, {
      id: "GF_Floor_OuterFootprint",
      y: 0,
      points: [
        { id: "NW", x: 0, z: 0, source: "R_FOOTPRINT_NW" },
        { id: "NE", x: params.houseWidthEW, z: 0, source: "R_FOOTPRINT_NE" },
        { id: "SE", x: params.houseWidthEW, z: params.houseDepthNS, source: "R_FOOTPRINT_SE" },
        { id: "SW", x: 0, z: params.houseDepthNS, source: "R_FOOTPRINT_SW" }
      ],
      measurementRefs: ["M001", "M002", "R001", "R002"]
    }, materials.floor);
    root.add(floor);

    const walls = [
      { id: "GF_Wall_NorthFront", x1: 0, z1: 0, x2: params.houseWidthEW, z2: 0, baseY: 0, height: params.wallHeight, thickness: params.externalWallThickness, measurementRefs: ["R001"] },
      { id: "GF_Wall_SouthBack", x1: 0, z1: params.houseDepthNS, x2: params.houseWidthEW, z2: params.houseDepthNS, baseY: 0, height: params.wallHeight, thickness: params.externalWallThickness, measurementRefs: ["R001"] },
      { id: "GF_Wall_WestSide", x1: 0, z1: 0, x2: 0, z2: params.houseDepthNS, baseY: 0, height: params.wallHeight, thickness: params.externalWallThickness, measurementRefs: ["R002"] },
      { id: "GF_Wall_EastSide", x1: params.houseWidthEW, z1: 0, x2: params.houseWidthEW, z2: params.houseDepthNS, baseY: 0, height: params.wallHeight, thickness: params.externalWallThickness, measurementRefs: ["R002"] },
      { id: "GF_Wall_Internal_KitchenLiving", x1: 0.29, z1: params.kitchenDepthNS, x2: params.houseWidthEW - 0.29, z2: params.kitchenDepthNS, baseY: 0, height: 2.55, thickness: params.internalWallThickness, measurementRefs: ["R003"] }
    ];

    walls.forEach((spec) => {
      const mat = spec.id.includes("Internal") ? materials.internalWall : materials.externalWall;
      root.add(wallSegment(THREE, spec, mat));
    });

    // Checkpoint marker: useful for visualising a measured named vertex or a consistency check.
    const markerGeometry = new THREE.SphereGeometry(0.08, 16, 12);
    const marker = new THREE.Mesh(markerGeometry, materials.checkpoint);
    marker.name = "CHK001_BackRightOuterCorner";
    marker.position.set(params.houseWidthEW, 0.08, params.houseDepthNS);
    marker.userData = {
      type: "checkpointMarker",
      checkpointId: "C001",
      formula: "distance(R_FOOTPRINT_SE, GF_Wall_SouthBack_RDF) <= tolerance"
    };
    root.add(marker);

    return {
      root,
      cameraTarget: new THREE.Vector3(params.houseWidthEW / 2, 1.25, params.houseDepthNS / 2)
    };
  };
})();
