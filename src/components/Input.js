import React, {useState, useEffect} from 'react';
import './Input.css'

let array = [];

const Input = () => {
    const [text, setText] = useState('');
    const [isFileUploaded, setIsFileUploaded] = useState(false);
    const [url, setUrl] = useState('');
    const [columnData, setColumnData] = useState([]);
    const [fieldCounter, setFieldCounter] = useState(0);
    const [addData, setAddData] = useState(false);
    const [flag, setFlag] = useState(false);
    const [canDownload, setCanDownload] = useState(false);

    function handleUploadFile(event) {
        if (validateFileType(event.target.files[0].name)) {
            let file = event.target.files[0];
            let reader = new FileReader();
            reader.onload = function(event) {
                // The file text will be printed here
                const result = event.target.result;
                const resultColumn = event.target.result.split('\n');
                resultColumn.splice(-1,1);
                setText(event.target.result);
                setColumnData(resultColumn);
                setFieldCounter(result.split('\n')[0].split(';').length);
                setIsFileUploaded(true);
            };
            reader.readAsText(file, 'windows-1251');
        }
    }

    console.log(columnData);

    useEffect(() => {
        for (let i = 0; i < fieldCounter; i++) {
            array.push(' ');
        }
    }, [fieldCounter]);

    const validateFileType = name => {
        const fileNameArray = name.split('.');
        return(fileNameArray[fileNameArray.length - 1 ] === 'txt')
    };

    const downloadTextFile = () => {
        const file = new File([columnData.join('\n')], 'test.txt');
        setUrl(URL.createObjectURL(file));
    };

    return (
        <React.Fragment>
            {/*<input type={'file'} onChange={handleUploadFile} />*/}
            <input type="file" name="file" id="file" className="input-file" onChange={handleUploadFile}/>
                <label htmlFor="file" className="btn btn-tertiary js-labelFile">
                    <i className="icon fa fa-check"></i>
                    <span className="js-fileName">Загрузить файл</span>
                </label>
            <table>
                {columnData.map((item, index) => {
                    return (
                        <tr key={index}>
                            {item.split(';').map((childItem, childIndex) => {
                                return <td key={childIndex}>{childItem}</td>
                            })}
                        </tr>
                    )
                })}
            </table>
            <div className={'add-inputs-container'}>
                {addData ?
                    array.map((item, index) => {
                        return (
                            <input onChange={(event) => array[index] = event.target.value} />
                        )
                    }) : null}
            </div>

            <button onClick={() => setAddData(true)} className={'addData'}
                    style={addData || !isFileUploaded ? {'display':'none'} : {'display':'block'}}>Добавить запись</button>
            <button style={addData ? {'display':'block'} : {'display':'none'}} onClick={() => {
                columnData.push(array.join(';'));
                setColumnData(columnData);
                setAddData(false);
                setFlag(!flag);
                setCanDownload(true);
                downloadTextFile();
            }}>Сохранить</button>
            <a href={url} style={canDownload ? {'display' : 'block'} : {'display' : 'none'}}
               download={'test'} className={'downloadLink'} onClick={() => {
                downloadTextFile()
            }}>Скачать</a>
        </React.Fragment>

    )
};

export default Input;