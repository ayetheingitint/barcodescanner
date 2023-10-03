import React, { useRef, useState, useEffect } from 'react';

import {
    Page,
    Row,
    Col,
    Button
} from 'react-onsenui';

import OrderRegisterComponent from '../user/OrderRegister';
import OrderInfoConfirmComponent from '../user/OrderInfoConfirm';
import App from '../App';
/* 営業用メニュー Component*/
const BusinessMenuPage = (props) => {
    // 受注登録画面の移行
    const navigateToOrderRegister = () => {
        // 受注登録componentのナビゲート
        props.navigator.resetPage({ component: OrderRegisterComponent });

    };
   // 受注情報確認画面の移行
    const navigateToOrderInfoConfirm = () => {
        // 受注情報確認componentのナビゲート
        props.navigator.resetPage({ component: OrderInfoConfirmComponent });

    };
    // ログイン画面の移行
    const navigateToLogin = () => {
        props.navigator.resetPage({ component: App });
    };
    return (
        <Page>
            <Row>
                <Col width="60">
                </Col>
                <Col width="40">
                    <Button large raised fill className='businessBtn' style={{ marginTop: '10px' }} onClick={navigateToLogin}>
                        ログアウト
                    </Button>
                </Col>
            </Row>
            <p style={{ fontSize: 'x-large', marginTop: '25px', padding: '10px', textAlign: 'center', color: '#000' }}>メインメニュー

            </p>


            <Row style={{ marginTop: '10px' }}>
                <Col width="20">
                </Col>
                <Col width="60">

                    <Button large raised fill className='menuBtn' onClick={navigateToOrderRegister}>
                        受注登録
                    </Button>
                </Col>
                <Col width="20">
                </Col>
            </Row>
            <Row style={{ marginTop: '10px' }}>
                <Col width="20">
                </Col>
                <Col width="60">
                    <Button large raised fill className='menuBtn' >
                        受注情報確認・編集
                    </Button>
                </Col>
                <Col width="20">
                </Col>
            </Row>

        </Page>
    );
};

export default BusinessMenuPage;
