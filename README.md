# babylon_test230419_1

230420_1
GUI の実装　＝＞　できました！

<!-- 230420_2 -->

230420_2
svg の表示
svg のコントロール
threejs の svgloader を利用して、svg を読み込む。
まずは three の vector2 配列にする。
それを babylon.vector3 配列に push していく。
その shape を babylon.extrudeShape で 0.1 押し出して作る。
ラインの場合は正円を shape に沿って押し出して作る。
詳しくは note に。

コードの整理
元々処理をくくっていた main()とか cresateScene()を排除した。
