# babylon_test230419_1

230420_1
GUI の実装　＝＞　できました！

<!-- 230420_2 -->

230420_2
svg の表示
threejs の svgloader を利用して、svg を読み込む。
まずは three の vector2 配列にする。
それを babylon.vector3 配列に push していく。
その shape を babylon.extrudeShape で 0.1 押し出して作る。
ラインの場合は正円を shape に沿って押し出して作る。
詳しくは note に。

svg のコントロール
元の shape を更新して再生成すると変形できる。
ref :https://doc.babylonjs.com/features/featuresDeepDive/mesh/creation/param/extrude_shape
// svg から作ったオブジェクトの更新
mountainOptions = {};
mountainShape[3] = new BABYLON.Vector3(
mountainShape[3].x + 0.0001 \* loopCount,
mountainShape[3].y,
mountainShape[3].z
);
mountainOptions.shape = mountainShape;
mountainOptions.path = [
new BABYLON.Vector3(0, 0, 0),
new BABYLON.Vector3(0, 0, 1),
];
mountainOptions.instance = mountain;
mountain = BABYLON.MeshBuilder.ExtrudeShape("ext", mountainOptions); //No scene parameter when using instance
console.log("mountain is updated");

フォントきちんとロードするには？
FontFaceObserver ライブラリを使用して、フォントの読み込みを待機してみましょう。

プロジェクトに FontFaceObserver をインストールしてください。npm を使用している場合は、以下のコマンドでインストールできます。
Copy code
npm install fontfaceobserver
プロジェクトのメイン JavaScript ファイルで、FontFaceObserver をインポートします。
javascript
Copy code
import FontFaceObserver from "fontfaceobserver";
loadGUI 関数の前に、以下のコードを追加してフォントの読み込みが完了するまで待機します。
javascript
Copy code
async function createScene() {
// ...
await loadCSS("./assets/style.css");

// フォントの読み込みを待機
const fontObserver = new FontFaceObserver("OstentRounded-Regular");
await fontObserver.load();

await loadGUI();
// ...
}
FontFaceObserver を使うことで、指定したフォントが読み込まれるまで待機できます。これにより、フォントが正しく反映されることが期待できます。

これ以降は実制作に映る
