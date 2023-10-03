import React, { useRef, useState, useEffect } from 'react';
import {
    Page,
    Input, Toast,
    List, Checkbox,
    ListItem, Dialog,
    Row,
    Col, Radio,
    Button
} from 'react-onsenui';

import OrderInfoRegisterComponent from '../user/OrderInfoRegister';
import BusinessMenuComponent from '../user/BusinessMenu';
import App from '../App';
/*受注登録確認  Component*/
const OrderInfoRegisterConfirmPage = (props) => {
    const [popupOpened, setPopupOpened] = useState(false);
    const [orderinfodetailproductobjectList, setorderinfodetailproductobjectList] = useState([]);
    const navigateToOrderInfoRegisterConfirmation = () => {
        // 新しいオブジェクトを作成
        const orderobjectProductData = {
            quantity: parseInt(props.orderinfoproductobjectList[0].quantity),
            description1: props.orderinfoproductobjectList[0].description1,
            description2: props.orderinfoproductobjectList[0].description2,
            summary_code: props.orderinfoproductobjectList[0].summary_code,
            order_number: props.orderinfoobjectList[0].order_number,
            product_number: props.selectedProductItemList[0].product_number,


        };
        //受注明細 List にオブジェクトを設定する
        orderinfodetailproductobjectList.push(orderobjectProductData);
        /*  受注登録関数呼び出し*/
        postOrderDataAPI();
    }

    /*  受注登録関数*/
    const postOrderDataAPI = async () => {
        try {
            console.log('受注登録リストの印刷', props.orderinfoobjectList);
            /*  受注登録API呼び出し*/
            const response = await fetch("http://127.0.0.1:3000/order/registerorder", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(props.orderinfoobjectList),
            });

            if (response.status === 200) {
                console.log("登録に成功:", await response.json());
                /*  備考更新関数呼び出し*/
                /*  Parameter→受注データList*/
                updateRemarkDataAPI(props.orderinfoobjectList);
                /*  受注明細登録関数呼び出し*/
                /*  Parameter→受注明細List*/
                postOrderDetailDataAPI(orderinfodetailproductobjectList);
                setPopupOpened(true);

            } else {
                console.log("データ取得エラー", await response.json());

            }

        } catch (error) {
            console.error("ネットワークエラーが発生しました。", error);
        }

    };
    /*  受注明細登録関数*/
    /*  Input Parameter→受注明細List*/
    const postOrderDetailDataAPI = async (orderinfodetailproductobjectList) => {
        try {
            console.log('受注明細リストの印刷>>>>>', orderinfodetailproductobjectList);
            /* 受注明細登録API呼び出し*/
            const response = await fetch("http://127.0.0.1:3000/order/registerorderdetail", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderinfodetailproductobjectList),
            });

            if (response.status === 200) {
                console.log("登録に成功:", await response.json());
            } else {
                console.log("データ取得エラー", await response.json());

            }
            /*  摘要更新関数呼び出し*/
            /*  Parameter→受注明細データList*/
            updateSummaryDataAPI(orderinfodetailproductobjectList);
        } catch (error) {
            console.error("ネットワークエラーが発生しました。", error);
        }


    };
    /*  摘要更新関数*/
    /*  Input Parameter→受注明細データList*/
    const updateSummaryDataAPI = async (orderinfodetailproductobjectList) => {
        console.log('受注明細リストの印刷>>>>>', orderinfodetailproductobjectList);
        try {
            /* 摘要更新API呼び出し*/
            const response = await fetch('http://127.0.0.1:3000/summary/updatesummarydata', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderinfodetailproductobjectList),
            });

            if (response.status === 200) {
                console.log("登録に成功:", await response.json());
            } else {
                console.log("データ取得エラー", await response.json());

            }

        } catch (error) {
            console.error("ネットワークエラーが発生しました。", error);
        }

    }
    /*  備考更新関数*/
    /*  Input Parameter→受注データList*/
    const updateRemarkDataAPI = async (updatedRemarkOrderList) => {
        console.log('受注リストの印刷>>>>>', updatedRemarkOrderList);

        try {
            /* 備考更新API呼び出し*/
            const response = await fetch('http://127.0.0.1:3000/remark/updateremarkdata', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedRemarkOrderList),
            });

            if (response.status === 200) {
                console.log("登録に成功:", await response.json());
            } else {
                console.log("データ取得エラー:", await response.json());

            }

        } catch (error) {
            console.error("ネットワークエラーが発生しました。", error);
        }

    }

    /*  受注情報の登録成功ポップアップ開く*/
    const openPopup = () => {
        setPopupOpened(true);
    };
    /* 受注情報の登録成功ポップアップ閉じる*/
    const closePopup = () => {
        setPopupOpened(false);
    };
    // 営業用メニューの移行
    const navigateToBusinessMenu = () => {
        closePopup();
        // 営業用メニューcomponentのナビゲート
        props.navigator.resetPage({
            component: BusinessMenuComponent

        });
        //localStorage.clear(); //ローカルストレージをクリア
        localStorage.removeItem('orderInfoData');
        localStorage.removeItem('orderInfoProductData');
        localStorage.removeItem('orderinfoobjectList');
        localStorage.removeItem('selectedProductItem');
        localStorage.removeItem('selectedProductItem');
    }
    //受注情報登録画面の移行
    const navigateToOrderInfoRegister = () => {
        // 受注情報登録componentのナビゲート
        props.navigator.resetPage({ component: OrderInfoRegisterComponent });
    }
    // ログイン画面の移行
    const navigateToLogin = () => {
        props.navigator.resetPage({ component: App });
    };
    return (
        <Page contentStyle={{
            overflowY: 'scroll', // Enable vertical scrolling
            height: '100%', // Set the height to ensure the page takes up the full viewport
        }}>
            <Row>
                <Col width="60">
                </Col>
                <Col width="40">
                    <Button large raised fill className='businessBtn' style={{ marginTop: '10px' }} onClick={navigateToLogin}>
                        ログアウト
                    </Button>
                </Col>
            </Row>
            <p style={{ fontSize: 'x-large', textAlign: 'center', color: '#000' }}>受注情報の登録確認

            </p>
            <p style={{ padding: '10px', textAlign: 'center', color: '#000' }}>受注情報の登録内容を確認してください。
            </p>
            <Row className="custom-row">

                <Row>
                    <label className="custom-label">受注情報（得意先）</label>
                </Row>

                <table className="custom-table">
                    <tr> <th className="custom-tableth">
                        受注日付
                    </th>

                        <td className="custom-tabletd">
                            <span className="custom-span">  {props.orderinfoobjectList[0].order_date}</span>
                        </td>
                    </tr>
                    <tr>
                        <th className="custom-tableth"> 売掛区分</th>


                        <td className="custom-tabletd">
                            <span className="custom-span">   {props.orderinfoobjectList[0].account_type} : {props.orderinfoobjectList[0].account_type_name}</span>
                        </td>

                    </tr>


                    <tr>
                        <th className="custom-tableth"> 倉庫コード</th>

                        <td className="custom-tabletd">

                            <span className="custom-span">    {props.orderinfoobjectList[0].warehouse_code} : {props.orderinfoobjectList[0].warehouse_name}</span>
                        </td>

                    </tr>

                    <tr>
                        <th className="custom-tableth">納品日</th>
                        <td className="custom-tabletd">
                            <span className="custom-span">  {props.orderinfoobjectList[0].delivery_date}</span>
                        </td>
                    </tr>

                    <tr>
                        <th className="custom-tableth"> 納品先コード</th>

                        <td className="custom-tabletd">

                            <span className="custom-span">   {props.orderinfoobjectList[0].delivery_destination_code} : {props.orderinfoobjectList[0].delivery_destination_name}</span>
                        </td>

                    </tr>

                    <tr>
                        <th className="custom-tableth">備考コード</th>
                        <td className="custom-tabletd">
                            <span className="custom-span">   {props.orderinfoobjectList[0].remark_code} : {props.orderinfoobjectList[0].remarks}</span>
                        </td>

                    </tr>
                    <tr>
                        <th className="custom-tableth">備考</th>
                        <td className="custom-tabletd">
                            <span className="custom-span"> {props.orderinfoobjectList[0].remarks}</span>
                        </td>

                    </tr>
                    <tr>
                        <th className="custom-tableth">
                            受注メモ
                        </th>
                        <td className="custom-tabletd">

                            <span className="custom-span">   {props.orderinfoobjectList[0].order_memo}</span>
                        </td>

                    </tr>

                </table>
            </Row>


            <Row className="custom-row">
                <label className="custom-label">受注登録商品
                </label>
            </Row>



            {props.selectedProductItemList &&
                <Row className="custom-row">
                    <Col>

                        <List className="custom-list">
                            <ListItem>

                                <div className="item-title">商品コード</div>
                                <div className="item-title">商品名</div>

                            </ListItem>


                            <ListItem key={props.selectedProductItemList[0].product_code} >

                                <div className="item-title">{props.selectedProductItemList[0].product_code}</div>
                                <div className="item-title">{props.selectedProductItemList[0].product_name}</div>

                            </ListItem>



                        </List>

                    </Col>

                </Row>
            }

            <Row className="custom-row">

                <Row>
                    <label className="custom-label">受注情報（商品）
                    </label>
                </Row>

                <table className="custom-table">
                    <tr>
                        <th className="custom-tableth">
                            数量
                        </th>
                        <td className="custom-tabletd">
                            <span className="custom-span">    {props.orderinfoproductobjectList[0].quantity}</span>
                        </td>

                    </tr>



                    <tr>
                        <th className="custom-tableth"> 摘要コード</th>

                        <td className="custom-tabletd">

                            <span className="custom-span">  {props.orderinfoproductobjectList[0].summary_code} :  {props.orderinfoproductobjectList[0].description1}</span>
                        </td>

                    </tr>
                    <tr>
                        <th className="custom-tableth">
                            摘要1

                        </th>
                        <td className="custom-tabletd">
                            <span className="custom-span">   {props.orderinfoproductobjectList[0].description1}</span>
                        </td>
                    </tr>
                    <tr>
                        <th className="custom-tableth">
                            摘要2

                        </th>
                        <td className="custom-tabletd">
                            <span className="custom-span"> {props.orderinfoproductobjectList[0].description2}</span>
                        </td>
                    </tr>

                </table>
            </Row>
            <Row>
                <Col>
                    <Button large raised fill className='return_nextBtn' onClick={navigateToOrderInfoRegister}>
                        戻る
                    </Button>

                </Col>
                <Col>
                    <Button large raised fill className='return_nextBtn' onClick={navigateToOrderInfoRegisterConfirmation} >
                        登録

                    </Button>
                </Col>
            </Row>





            {/* 成功ポップアップ */}
            <Dialog isOpen={popupOpened} className='successDialog'>

                <p style={{ fontSize: 'medium', marginTop: '50px', textAlign: 'center', color: '#000' }}>受注情報の登録に成功しました。
                </p>
                <Row style={{ marginTop: '30px' }}>
                    <Col></Col>
                    <Col></Col>
                    <Col>
                        <Button large raised fill onClick={navigateToBusinessMenu} className="OKBtn">OK
                        </Button>
                    </Col>
                    <Col></Col>
                    <Col></Col>
                </Row>

            </Dialog>

        </Page>
    );
};
export default OrderInfoRegisterConfirmPage;