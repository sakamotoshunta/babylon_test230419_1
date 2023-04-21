// main.js
import * as BABYLON from "babylonjs";
import "babylonjs-loaders";
import * as GUI from "babylonjs-gui";
import * as Materials from "babylonjs-materials";
// var parseSVG = require("svg-path-parser");
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

// import SVG from "svg.js";
//ammo.jsはindex.htmlの<script>内でインポート

// async function main() {
const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas);
var text1;

// async function createScene() {
const scene = new BABYLON.Scene(engine);
// scene.debugLayer.show({
//   physicsEngine: true,
// });
scene.clearColor = new BABYLON.Color3.FromHexString("#ff2f00"); //背景色をHEXで指定。

// カメラを作成
const camera = new BABYLON.ArcRotateCamera(
  "camera",
  -Math.PI / 2,
  Math.PI / 2.5,
  3,
  new BABYLON.Vector3(0, 0, 0),
  scene
);
// カメラがユーザからの入力で動くように
camera.attachControl(canvas, true);
camera.setPosition(new BABYLON.Vector3(0, 0, -10));

// ライトを作成
const light = new BABYLON.HemisphericLight(
  "light",
  new BABYLON.Vector3(0, 1, 0),
  scene
);

//GUIの表示 //サイズの指定などは別途関数でまとめる。
let advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI(
  "GUI",
  true,
  scene
);
var button1 = GUI.Button.CreateSimpleButton("but1", "Click Me");
button1.width = "150px";
button1.height = "40px";
button1.color = "white";
button1.cornerRadius = 20;
button1.background = "green";
button1.onPointerUpObservable.add(function () {
  alert("you did it!");
});
advancedTexture.addControl(button1);
text1 = new GUI.TextBlock();
text1.transformCenterX = 0;
text1.transformCenterY = 0;
text1.text = "MENU";
text1.color = "white";
text1.fontSize = (window.innerWidth / 1920) * 150;
text1.fontFamily = "OstentRounded-Regular";
text1.top = (-1 * window.innerHeight) / 2;
text1.left = (-1 * window.innerHeight) / 2;
advancedTexture.addControl(text1);

// Ammo.jsを非同期で初期化
const AmmoInstance = await Ammo();

// Ammo.jsを使用するためにプラグインを設定する
const ammoPlugin = new BABYLON.AmmoJSPlugin(true, AmmoInstance);
scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), ammoPlugin);

// 箱 (豆腐) を作成
const box = BABYLON.MeshBuilder.CreateBox("box", {}, scene);
box.position._y = 2;
// 物理ボディを作成
box.physicsImpostor = new BABYLON.PhysicsImpostor(
  box,
  BABYLON.PhysicsImpostor.BoxImpostor,
  { mass: 1, friction: 0.5, restitution: 0.7 },
  scene
);
// box.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(1, 0, 0));

// // glTFファイルを読み込む
// const result = await BABYLON.SceneLoader.ImportMeshAsync(
//   null,
//   "./assets/",
//   "test.gltf",
//   scene
// );
// const importedMesh = result.meshes[0]; // メッシュを取得

// const impostor = new BABYLON.PhysicsImpostor(
//   importedMesh,
//   BABYLON.PhysicsImpostor.MeshImpostor,
//   { mass: 0, friction: 0.5, restitution: 0.7 },
//   scene
// );

// glTFファイルを読み込む
const result = await BABYLON.SceneLoader.ImportMeshAsync(
  null,
  "./assets/",
  "test.gltf",
  scene
);
const importedMesh = result.meshes[0]; // メッシュを取得

importedMesh.physicsImpostor = new BABYLON.PhysicsImpostor(
  importedMesh,
  BABYLON.PhysicsImpostor.MeshImpostor,
  { mass: 0, friction: 0.5, restitution: 0.7 },
  scene
);

let mountain = await createExtrudedShapeFromSvg(
  "mountain",
  "./assets/mountain.svg",
  {
    closeShape: true,
    updatable: true,
    cap: BABYLON.Mesh.CAP_ALL,
    sideOrientation: BABYLON.Mesh.DOUBLESIDE,
  },
  0,
  0,
  scene,
  (extrudedShape) => {
    console.log("Extruded shape created:", extrudedShape);
  }
);

console.log("mountain is " + mountain);
let river = await createExtrudedShapeFromSvg(
  "river",
  "./assets/riverLine.svg",
  {
    closeShape: true,
    updatable: true,
    cap: BABYLON.Mesh.CAP_ALL,
    sideOrientation: BABYLON.Mesh.DOUBLESIDE,
  },
  1,
  1,
  scene,
  (extrudedShape) => {
    console.log("Extruded shape created:", extrudedShape);
  }
);
var riverTransform = new BABYLON.TransformNode("riverTransform", scene);
river.setParent(riverTransform);

//ドラッグについて
var dragBehavior = new BABYLON.PointerDragBehavior({
  dragAxis: new BABYLON.Vector3(1, 0, 0),
});
box.addBehavior(dragBehavior);

dragBehavior.onDragObservable.add(function (eventData) {
  box.position.addInPlace(eventData.delta);
});

engine.resize();
//   return scene;
// }

// const scene = await createScene();
// アニメーションの設定
scene.registerBeforeRender(function () {
  riverTransform.rotate(BABYLON.Axis.Y, Math.PI * 0.01, BABYLON.Space.LOCAL);
});
engine.runRenderLoop(() => {
  text1.top = ((-1 * window.innerHeight) / 2) * 0.9;
  text1.left = ((-1 * window.innerHeight) / 2) * 0.9;
  text1.fontSize = (window.innerWidth / 1920) * 150;

  scene.render();
});

window.addEventListener("resize", () => {
  engine.resize();
});
// }

// //DOMがロードされたらmain()を呼び出す。
// window.addEventListener("DOMContentLoaded", main);

//クリックでmain関数が呼ばれるようにする。Tonejsを使う場合
// window.addEventListener("click", main);

function convertThreePathToBabylonVectors(path) {
  const shapes = path.toShapes(true);
  const babylonVectors = [];

  for (let j = 0; j < shapes.length; j++) {
    const shape = shapes[j];
    const shapePoints = shape.getPoints();

    for (const point of shapePoints) {
      babylonVectors.push(
        new BABYLON.Vector3(point.x * 0.01, -point.y * 0.01, 0) // Y座標を反転
      );
    }
  }

  return babylonVectors;
}

async function createExtrudedShapeFromSvg(
  name,
  url,
  extrusionOptions,
  isLine,
  lineWidth,
  scene,
  callback
) {
  let myShape;
  let myPath;
  console.log(isLine);
  if (isLine === 1) {
    // isLineが1の場合は正円を作成する
    const circleShape = new THREE.Shape();
    const radius = lineWidth / 2;
    circleShape.moveTo(radius, 0);
    circleShape.absarc(0, 0, radius, 0, Math.PI * 2, false);
    circleShape.closePath();

    // 正円からBabylon.Vector3配列を作成する
    const babylonVectors = circleShape.getPoints().map((point) => {
      return new BABYLON.Vector3(point.x * 0.01, -point.y * 0.01, 0);
    });

    myShape = babylonVectors;
    myPath = await new Promise((resolve) => {
      const loader = new SVGLoader();
      loader.load(url, (data) => {
        const paths = data.paths;
        resolve(convertThreePathToBabylonVectors(paths[0]));
      });
    });
    // ExtrudeShapeオプションのshape,pathプロパティを設定
    extrusionOptions.shape = myShape;
    extrusionOptions.path = myPath;

    console.log("this is Line");
    console.log(myShape);
    console.log(myPath);
  } else {
    // isLineが0の場合はSVGファイルからパスを取得する
    myShape = await new Promise((resolve) => {
      const loader = new SVGLoader();
      loader.load(url, (data) => {
        const paths = data.paths;
        resolve(convertThreePathToBabylonVectors(paths[0]));
      });
    });
    myPath = [new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, 0, 0.1)];
    // ExtrudeShapeオプションのshape,pathプロパティを設定
    extrusionOptions.shape = myShape;
    extrusionOptions.path = myPath;
    console.log(myShape);
  }

  // // ExtrudeShapeオプションのshapeプロパティを設定
  // extrusionOptions.shape = babylonVectors;

  // ExtrudeShapeを作成
  const extrudedShape = BABYLON.MeshBuilder.ExtrudeShape(
    name,
    extrusionOptions,
    scene
  );

  // コールバック関数を実行
  if (callback) {
    callback(extrudedShape);
  }

  return extrudedShape;
}
