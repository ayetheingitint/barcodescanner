import React, { useState, useRef, useEffect } from 'react';
import { Page, Button } from 'react-onsenui';
import { BrowserMultiFormatReader } from '@zxing/library';
import OrderInfoRegisterComponent from '../user/OrderInfoRegister';

/*バーコードスキャナComponent*/
const BarcodeScannerPage = (props) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [result, setResult] = useState('');
    const [showResultbtn, setShowResultbtn] = useState(false);
    const [showscanRec, setshowscanRec] = useState(false);
    const [searchjancode, setsearchjancode] = useState('');
    const [showBarcode, setShowBarcode] = useState(false);
    const [showQRCode, setShowQRCode] = useState(false);
    // 受注情報登録画面の移行
    const navigateToOrderInfoRegister = () => {
        const videoElement = document.getElementById('video');
        const stream = videoElement.srcObject;
        // video Elementあるかどうか確認
        if (stream) {
            // あるかどうか確認
            // video閉じる
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            videoElement.srcObject = null;
            videoElement.style.display = 'none';

        }
        // 受注情報登録componentのナビゲート
        props.navigator.resetPage({
            component: OrderInfoRegisterComponent,
            props: { searchjancode },
        });

    }

    // video開ける
    const startVideo = () => {
        // BrowserMultiFormatReader作成
        const codeReader = new BrowserMultiFormatReader();
        codeReader.decodeFromVideoDevice(undefined, videoRef.current, (result, error) => {
            // Barcode Scanner結果あるかどうか確認
            if (result) {
                // 有場合
                setsearchjancode(result.text);//Barcode Scanner結果を設定
                setshowscanRec(true);
                setShowResultbtn(true);//結果Button表示
            }
        }, videoRef.current);

    }
    //Barcodeスキャナー関数
    const handleBarcodeButtonClick = () => {
        setResult('');//結果クリア
        setShowResultbtn(false);//結果Buttonを無効にする
        startVideo();//video開ける関数
        setShowBarcode(true);
        setShowQRCode(false);
    };

    //QRスキャナー関数
    const handleQRCodeButtonClick = () => {
        setResult('');//結果クリア
        setShowResultbtn(false);//結果Buttonを無効にする
        startVideo();//video開ける関数
        setShowBarcode(false);
        setShowQRCode(true);
    };

    return (
        <Page>
            <div id="barcode-scanner" style={{ display: showscanRec ? "block" : "none" }}>
                <video ref={videoRef} autoPlay playsInline style={{ width: '100%' }} id="video" />
                <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0 }} id="canvas" />
                {showBarcode && (
                    <div class="scan-rectangle" style={{ display: showBarcode ? "block" : "none" }}>
                        <div class="laser"></div>
                        <div class="corner top-left" style={{ display: showBarcode ? "block" : "none" }}></div>
                        <div class="corner top-right" style={{ display: showBarcode ? "block" : "none" }}></div>
                        <div class="corner bottom-left" style={{ display: showBarcode ? "block" : "none" }}></div>
                        <div class="corner bottom-right" style={{ display: showBarcode ? "block" : "none" }}></div>

                    </div>

                )}
                {showQRCode && (
                    <div class="scan-rectangle-qr" style={{ display: showQRCode ? "block" : "none" }}>
                        <div class="laser"></div>
                        <div class="corner top-left" style={{ display: showscanRec ? "block" : "none" }}></div>
                        <div class="corner top-right" style={{ display: showscanRec ? "block" : "none" }}></div>
                        <div class="corner bottom-left" style={{ display: showscanRec ? "block" : "none" }}></div>
                        <div class="corner bottom-right" style={{ display: showscanRec ? "block" : "none" }}></div>

                    </div>

                )}
            </div>
            <div style={{ textAlign: 'center', padding: '10px' }}>
                <Button onClick={handleBarcodeButtonClick} style={{ marginRight: '10px' }}>Barcode Scanner</Button>
                <Button onClick={handleQRCodeButtonClick}>QR Code Scanner</Button>
            </div>
            <div style={{ textAlign: 'center', padding: '10px' }}>
                <Button onClick={navigateToOrderInfoRegister} style={{ display: showResultbtn ? "block" : "none" }}>
                    スキャナー 結果
                </Button>
            </div>
        </Page >
    );
};

export default BarcodeScannerPage;
