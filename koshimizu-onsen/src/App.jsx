import React, { useState } from 'react';
import { Page, Button, Toolbar, Input } from 'react-onsenui';
import { notification } from 'onsenui';
import './css/login.css';
import './css/custom.css';
import Dashboard from './admin/Dashboard';
// import Dashboard from './user/BusinessMenu';
export default function App(props) {
    const [username, setUsername] = useState('');
    const [userAgent, setUserAgent] = useState(navigator.userAgent);

    const [password, setPassword] = useState('');
  //  const [inchargeData, setinchargeData] = useState([]);
    const [maskedPassword, setMaskedPassword] = useState('');
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);

    const handlePasswordChange = (e) => {
        const updatedPassword = e.target.value;
        setPassword(updatedPassword);
        setMaskedPassword('*'.repeat(updatedPassword.length));
    }
   
    const handleLogin = async () => {
        localStorage.clear();
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ in_charge_name: username, password: password }),
            });

            if (response.ok) {
                // notification.alert('Login successful!');
                const jsonData = await response.json();
                console.log('response', jsonData);
                if (jsonData) {
                    
                  
                    localStorage.setItem('inchargeData', JSON.stringify(jsonData.token[1]));
                }
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('loginTimestamp', Date.now().toString());

                console.log('{getBrowserAndDevice()}', getBrowserAndDevice());
                props.navigator.resetPage({ component: Dashboard }); // Navigate to the Dashboard
            } else {
                // Handle errors returned from the server
                const errorData = await response.json();
                notification.alert(errorData.message || 'Invalid credentials!');
            }
        } catch (error) {
            // Handle network errors or other issues
            notification.alert('Network error or server is not responding.');
        }
    };

    const getBrowserAndDevice = () => {
        const ua = navigator.userAgent;
        let browserName = "Unknown browser";
        let deviceType = "PC";

        // Detect browser
        if (ua.indexOf("Edg") !== -1) browserName = "Edge";  // Edge detection should come before Chrome
        else if (ua.indexOf("Chrome") !== -1) browserName = "Chrome";
        else if (ua.indexOf("Safari") !== -1) browserName = "Safari";
        else if (ua.indexOf("Firefox") !== -1) browserName = "Firefox";
        else if (ua.indexOf("MSIE") !== -1 || !!document.documentMode === true) browserName = "IE";

        // Detect device
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) deviceType = "Smartphone";

        return `${browserName} on ${deviceType}`;
    };

    return (
        <Page>
            <div className="login-container">
                <h1 className='main-title'>ログイン画面</h1>

                <div className="user-agent-info">
                    {getBrowserAndDevice()}
                </div>

                <label className="login-label">ユーザー名</label>
                <Input value={username} onChange={(e) => setUsername(e.target.value)} className="login-input" />

                <label className="login-label">パスワード</label>
                <Input
                    type="text"
                    value={isPasswordFocused ? password : maskedPassword}
                    onChange={handlePasswordChange}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.keyCode === 13) {
                            setIsPasswordFocused(false);
                            e.target.blur();
                        }
                    }}
                    onCompositionEnd={(e) => {
                        if (e.data && e.data.length > 0) {
                            setIsPasswordFocused(false);
                            e.target.blur();
                        }
                    }}
                    className="login-input"
                />
                <Button onClick={handleLogin} className="login-button">ログイン</Button>
            </div>
        </Page>
    );
}
