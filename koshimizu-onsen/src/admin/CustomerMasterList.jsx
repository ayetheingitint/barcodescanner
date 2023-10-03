import React, { useState, useEffect } from 'react';
import { Page } from 'react-onsenui';
import axios from 'axios';

const CustomerMasterList = () => {
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [codeSearchTerm, setCodeSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [displayedCustomers, setDisplayedCustomers] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/customers')
        .then(response => response.json())
        .then(data => {
            setCustomers(data);
            setDisplayedCustomers(data); // Initially, display all customers
        })
        .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handleCustomerClick = (customer) => {
        setSelectedCustomer(customer);
    };

    const handleSearchByName = async () => {
        try {
          const response = await axios.get('http://localhost:3000/customermaster/search_by_name', {
            params: {
              name: searchTerm
            }
          });
      
          const foundCustomers = response.data;
          if (foundCustomers && foundCustomers.length > 0) {
            setDisplayedCustomers(foundCustomers); 
            setSearchResult(foundCustomers[0]);
            setNoSearchResult(false);
          } else {
            setDisplayedCustomers([]);
            setSearchResult(null); 
            setNoSearchResult(true);
          }
        } catch (error) {
          console.error("Error fetching customers:", error);
        }
    };

    const handleSearchByCode = async () => {
        try {
            const response = await axios.get('http://localhost:3000/customermaster/search_by_code', {
                params: {
                    code: codeSearchTerm
                }
            });
    
            const foundCustomers = response.data;
            if (foundCustomers && foundCustomers.length > 0) {
                setDisplayedCustomers(foundCustomers); 
                setSearchResult(foundCustomers[0]);
                setNoSearchResult(false);
            } else {
                setDisplayedCustomers([]);
                setSearchResult(null); // or however you want to handle no results
                setNoSearchResult(true);
            }
        } catch (error) {
            console.error("Error fetching customers by code:", error);
        }
    };

  return (
    <Page>
        <h1>得意先マスター確認</h1>
        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '16px' }}>
            <label>得意先名で検索:</label>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <input 
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="スペースで区切るとAND検索されます。"
                    style={{ flex: 1, padding: '8px', border: '1px solid #ccc', marginRight: '8px', borderRadius: '4px' }}
                />
                <button onClick={handleSearchByName} style={{ backgroundColor: '#007BFF', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    検索
                </button>
            </div>
            
            <label>得意先コードで検索:</label>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <input 
                    type="text"
                    value={codeSearchTerm}
                    onChange={e => setCodeSearchTerm(e.target.value)}
                    placeholder="得意先コードを指定してください。"
                    style={{ flex: 1, padding: '8px', border: '1px solid #ccc', marginRight: '8px', borderRadius: '4px' }}
                />
                <button onClick={handleSearchByCode} style={{ backgroundColor: '#007BFF', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    検索
                </button>
            </div>
        </div>

        <div style={{ maxHeight: 'calc(11 * 1.5rem)', overflowY: 'auto' }}> {/* Assuming each row is approximately 1.5rem in height */}
            <table>
                <thead>
                    <tr>
                        <th>得意先ｺｰﾄﾞ</th>
                        <th>得意先名１</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(displayedCustomers) && displayedCustomers.map(customer => (
                        <tr key={customer.id}>
                            <td>
                                <a href="#" onClick={(e) => { e.preventDefault(); handleCustomerClick(customer); }}>
                                    {customer.customer_code}
                                </a>
                            </td>
                            <td>{customer.customer_name1}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {selectedCustomer && (
            <div>
                <h2>得意先情報</h2>
                <table>
                    <tbody>
                        <tr>
                            <td>得意先ｺｰﾄﾞ</td>
                            <td>{selectedCustomer.customer_code}</td>
                        </tr>
                        <tr>
                            <td>得意先名１</td>
                            <td>{selectedCustomer.customer_name1}</td>
                        </tr>
                        <tr>
                            <td>得意先名索引</td>
                            <td>{selectedCustomer.customer_name_index}</td>
                        </tr>
                        <tr>
                            <td>請求先分類名</td>
                            <td>{selectedCustomer.billing_classification_master.billing_name}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )}
    </Page>
  );
};

export default CustomerMasterList;
