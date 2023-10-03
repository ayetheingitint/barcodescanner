import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import App from '../App';
import {
  Page,
  Toolbar,
  Button,
  List,
  ListItem
} from 'react-onsenui';

import { Navigator } from 'react-onsenui';

// Sample sub-pages for the dashboard
import CustomerMasterRegister from './CustomerMasterRegister';
import CustomerMasterRegisterSuccess from './CustomerMasterRegisterSuccess';
import CustomerMasterList from './CustomerMasterList';
import ProductMasterRegister from './ProductMasterRegister';
import UserRegisterComponent from './UserRegister';
import LogConfirmComponent from './LogConfirm';
import OrderInfoOutputComponent from './OrderInfoOutput';
import Page2 from './Page2';

const Dashboard = (props) => {
  // const [activeComponent, setActiveComponent] = useState(<CustomerMasterRegister  />);
  const [activeComponent, setActiveComponent] = useState(() => <CustomerMasterRegister navigator={props.navigator} />);

  

  const handleLogout = () => {
    props.navigator.resetPage({ component: App });
  };

  const renderRow = (row) => {
    return (
      <div key={row.title} className='menu-items' onClick={() => {
        setActiveComponent(row.component());
      }} >
        {row.title}
      </div>
    );
  }

  // Sample menu items
  const menuItems = [
    // { title: '得意先マスター登録', component: <CustomerMasterRegister  /> },
    // { title: '得意先マスター確認', component: <Page2 /> },
    // { title: '得意先マスター登録', component: () => <CustomerMasterRegister navigator={props.navigator} /> },
    { title: '得意先マスター登録', component: () => <CustomerMasterRegister navigator={props.navigator} changeActiveComponent={changeActiveComponent} /> },
    { title: '得意先マスター確認', component: () => <CustomerMasterList navigator={props.navigator} /> },
    { title: '商品マスター登録', component: () => <ProductMasterRegister navigator={props.navigator} /> },
    { title: '商品マスター確認・編集', component: () => <Page2 navigator={props.navigator} /> },
    { title: '受注情報出力', component: () => <OrderInfoOutputComponent navigator={props.navigator} /> },
    { title: 'ユーザー登録', component: () => <UserRegisterComponent navigator={props.navigator} /> },
    { title: 'ログ確認', component: () => <LogConfirmComponent navigator={props.navigator} /> },
  ];

  const changeActiveComponent = (newComponent) => {
    setActiveComponent(newComponent);
  };

  return (
    <Page>
      <div className="dashboard-container">
        <div className="custom-sidebar">
          <div style={{backgroundColor: '#2c3e50', padding: '15px', textAlign: 'center', fontWeight: 'bold', fontSize: '20px', color: '#fff'}}> 
            KOSHIMIZU 
          </div>
          <List
            dataSource={menuItems}
            renderRow={renderRow}
          />
          <Button onClick={handleLogout} className='logout-btn'>ログアウト</Button>
        </div>
        
        <div className="main-content">
          {activeComponent}
        </div>
      </div>
    </Page>
  );
};

export default Dashboard;
