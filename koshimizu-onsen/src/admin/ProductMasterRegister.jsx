import React, { useRef, useState, useEffect } from 'react';
import { Page, Button } from 'react-onsenui';

const ProductMasterRegister = (props) => {
    const [isUTF16, setIsUTF16] = useState(null);
    const fileInputRef = useRef(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [invalidRows, setInvalidRows] = useState([]);
    const [showErrorBox, setShowErrorBox] = useState(false);
    const [importSuccess, setImportSuccess] = useState(false);
    const [uploadedFileName, setUploadedFileName] = useState('');

    useEffect(() => {
      if (isUTF16 === false) {
        setErrorMsg("File is not in UTF-16 format. Please select a valid file.");
      } else {
        setErrorMsg('');
      }
    }, [isUTF16]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) {
            setIsUTF16(null);
            setUploadedFileName('');  // Clear the filename if no file is selected
            return;
        }
        
        // Update the displayed filename when a file is selected
        setUploadedFileName(file.name);
    
        const reader = new FileReader();
        reader.onload = function(event) {
            const buffer = new Uint8Array(event.target.result);
    
            if ((buffer[0] === 0xFF && buffer[1] === 0xFE) || 
                (buffer[0] === 0xFE && buffer[1] === 0xFF)) {
                setIsUTF16(true);
    
                const decodedString = new TextDecoder('utf-16').decode(buffer);
                validateFileContent(decodedString);
            } else {
                setIsUTF16(false);
            }
        };
        
        reader.readAsArrayBuffer(file);
    };

    const validateFileContent = (content) => {
        const errors = [];
        const columnToCheck = "商品名";
        
        const lines = content.trim().split('\n');
    
        if (lines.length < 2) {
            errors.push("File has fewer than 2 lines.");
            return errors;
        }
    
        // Assuming the first line contains headers
        const headers = lines[0].split(',');
    
        const columnIndex = headers.indexOf(columnToCheck);
        if (columnIndex === -1) {
            errors.push(`Column ${columnToCheck} not found.`);
            return errors;
        }
    
        for (let i = 1; i < lines.length; i++) {
            const cells = lines[i].split(',');
            if (!cells[columnIndex].trim()) {
                errors.push(`Row ${i + 1} is missing ${columnToCheck}.`);
            }
        }
        console.log(errors);
        return errors;
        
    };
    

    const handleSubmit = async () => {
        if (!isUTF16) {
          console.warn("Invalid file format. Please upload a UTF-16 encoded file.");
          return;
        }
    
        const file = fileInputRef.current?.files[0];
        if (!file) {
          console.warn("No file selected.");
          return;
        }
    
        const formData = new FormData();
        formData.append('file', file); // 'file' is the parameter name that the server will read
    
        try {
          const response = await fetch('http://localhost:3000/product_masters/import', { // Update the URL for ProductMaster
            method: 'POST',
            body: formData,
          });
    
          const data = await response.json(); // assuming server responds with json
          console.log(data);
    
          if (response.ok) {
            console.log("File successfully uploaded to the backend.");
            setImportSuccess(true); 
            // Adjust this line if there's a different navigation flow or result page for ProductMaster
            // props.navigator.resetPage({ component: ProductMasterRegisterSuccess });
          } else {
            console.error("There was an issue uploading the file.");
          }
        } catch (error) {
          console.error("Error uploading the file:", error);
        }
    };
    

    return (
        <Page>
        <h1>{importSuccess ? '商品マスターの登録完了' : showErrorBox ? '商品Mエラー登録' : '商品M登録'}</h1>
        {showErrorBox && (
          <div style={{ padding: '10px', marginTop: '20px', border: '1px solid red', borderRadius: '5px', backgroundColor: '#ffe6e6' }}>
            <h2>エラー</h2>
            <p>商品マスターにエラーが発生しました。</p>
            <ul>
              {invalidRows.map((invalidRow, index) => (
                  <li key={index}>
                      {invalidRow.errors.join(', ')}
                  </li>
              ))}
            </ul>
          </div>
        )}
        
        <p>{showErrorBox ? '修正した商品マスターのUNIファイルを指定してください。' : importSuccess ? '商品マスターの登録に成功しました。' : '商品マスターのUNIファイルを指定してください。'}</p>
  
        {!importSuccess && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div 
              style={{ 
                flexGrow: 1, 
                padding: '10px', 
                border: '1px solid #ccc', 
                borderRadius: '4px'
              }}
            >
              {uploadedFileName || "ファイルが選択されていません。"}
            </div>
  
            <label htmlFor="fileUpload" style={{ marginLeft: '10px' }}>
              <Button>選択</Button>
              <input 
                id="fileUpload" 
                type="file" 
                accept=".txt" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                style={{ display: 'none' }}
              />
            </label>
          </div>
        )}
        
        {isUTF16 === false && <p style={{color: 'red', marginTop: '10px'}}>ファイルは UTF-16 形式ではありません。 有効なファイルを選択してください。</p>}
        {!importSuccess && (
        <Button onClick={handleSubmit} className='reg-button'>登録</Button>
        )}
        
      </Page>
    );
};

export default ProductMasterRegister;