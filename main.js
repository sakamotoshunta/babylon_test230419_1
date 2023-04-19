// main.js
import * as BABYLON from "babylonjs";
import "babylonjs-loaders";
// import * as Ammo from "ammo.js";
// async function loadAmmo() {
//   return await import("ammo.js");
// }

async function main() {
  const canvas = document.getElementById("renderCanvas");
  const engine = new BABYLON.Engine(canvas);

  async function createScene() {
    const scene = new BABYLON.Scene(engine);
    scene.debugLayer.show({
      physicsEngine: true,
    });
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

    // 箱 (豆腐) を作成
    const box = BABYLON.MeshBuilder.CreateBox("box", {}, scene);
    box.position._y = 2;

    // glTFファイルを読み込む
    const result = await BABYLON.SceneLoader.ImportMeshAsync(
      null,
      "./assets/",
      "test.gltf",
      scene
    );
    const importedMesh = result.meshes[0]; // メッシュを取得

    // Ammo.jsを非同期で初期化
    const AmmoInstance = await Ammo();

    // Ammo.jsを使用するためにプラグインを設定する
    const ammoPlugin = new BABYLON.AmmoJSPlugin(true, AmmoInstance);
    scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), ammoPlugin);

    // 物理ボディを作成
    box.physicsImpostor = new BABYLON.PhysicsImpostor(
      box,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 1, friction: 0.5, restitution: 0.7 },
      scene
    );
    box.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(1, 0, 0));

    const impostor = new BABYLON.PhysicsImpostor(
      importedMesh,
      BABYLON.PhysicsImpostor.MeshImpostor,
      { mass: 0, friction: 0.5, restitution: 0.7 },
      scene
    );

    var dragBehavior = new BABYLON.PointerDragBehavior({
      dragAxis: new BABYLON.Vector3(1, 0, 0),
    });
    box.addBehavior(dragBehavior);

    dragBehavior.onDragObservable.add(function (eventData) {
      box.position.addInPlace(eventData.delta);
    });

    return scene;
  }

  const scene = await createScene();

  engine.runRenderLoop(() => {
    scene.render();
  });

  window.addEventListener("resize", () => {
    engine.resize();
  });
}

//DOMがロードされたらmain()を呼び出す。
window.addEventListener("DOMContentLoaded", main);

//クリックでmain関数が呼ばれるようにする。Tonejsを使う場合
// window.addEventListener("click", main);
