import React, { useRef, useState, useEffect } from 'react';
import { Page, Button } from 'react-onsenui';

const CustomerMasterRegister = (props) => {
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
      const rows = content.split(/\r?\n/);
      let invalidRows = [];
  
      // Ensure there are headers and at least one data row
      if (rows.length < 3) {
          setErrorMsg("The file is missing headers or data.");
          return;
      }
  
      // Extracting header and mapping columns to validate to their respective index.
      const headerRow = rows[0].split('\t');
      const columnsToCheck = ['得意先ｺｰﾄﾞ', '得意先名１', '得意先名索引', '得意先分類０ｺｰﾄﾞ'];
      const columnIndex = {};
      columnsToCheck.forEach(column => {
          columnIndex[column] = headerRow.indexOf(column);
      });
  
      // Start from third row for validation
      for (let rowIndex = 2; rowIndex < rows.length; rowIndex++) {
          const columns = rows[rowIndex].split('\t');
          const errors = [];
  
          for (const [column, index] of Object.entries(columnIndex)) {
              if (!columns[index] || !columns[index].trim()) {
                errors.push(`行${rowIndex - 1}で${column}が不足しています`);
                  // errors.push(`Row ${rowIndex + 1} is missing ${column}`);
              } else {
                  // Additional condition for specific column
                  if (column === '得意先ｺｰﾄﾞ' && isNaN(Number(columns[index]))) {
                      // errors.push(`Row ${rowIndex + 1} has a wrong format for ${column}`);
                      errors.push(`行${rowIndex - 1}で${column}の形式が正しくありません`);
                  }
              }
          }
  
          if (errors.length) {
              invalidRows.push({
                  rowNumber: rowIndex + 1, // +1 because arrays are 0-indexed
                  errors: errors
              });
          }
      }
  
      if (invalidRows.length) {
          setInvalidRows(invalidRows);
          setShowErrorBox(true);
          fileInputRef.current.value = '';
      }
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
          const response = await fetch('http://localhost:3000/customer_masters/import', {
            method: 'POST',
            body: formData,
          });

          const data = await response.json(); // assuming server responds with json
          console.log(data);

          if (response.ok) {
            console.log("File successfully uploaded to the backend.");
            setImportSuccess(true); 
            // props.navigator.resetPage({ component: CustomerMasterRegisterSuccess });
          } else {
            console.error("There was an issue uploading the file.");
          }
        } catch (error) {
          console.error("Error uploading the file:", error);
        }
    };

  

  return (
    <Page>
      <h1>{importSuccess ? '得意先マスターの登録完了' : showErrorBox ? '得意先Mエラー登録' : '得意先M登録'}</h1>
      {showErrorBox && (
        <div style={{ padding: '10px', marginTop: '20px', border: '1px solid red', borderRadius: '5px', backgroundColor: '#ffe6e6' }}>
          <h2>エラー</h2>
          <p>得意先マスターにエラーが発生しました。</p>
          <ul>
            {invalidRows.map((invalidRow, index) => (
                <li key={index}>
                    {invalidRow.errors.join(', ')}
                </li>
            ))}
          </ul>
        </div>
      )}
      
      <p>{showErrorBox ? '修正した得意先マスターのUNIファイルを指定してください。' : importSuccess ? '得意先マスターの登録に成功しました。' : '得意先マスターのUNIファイルを指定してください。'}</p>

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

export default CustomerMasterRegister;
