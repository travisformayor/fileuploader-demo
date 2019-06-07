import React, { useState } from 'react';
import Message from './Message';
import axios from 'axios';


const FileUpload = () => {
  const [ file, setFile ] = useState('');
  const [ filename, setFilename ] = useState('Choose File');
  const [ uploadedFile, setUploadedFile ] = useState({});
  const [ message, setMessage ] = useState('');

  const onChange = e => {
    console.log(e.target)
    setFile(e.target.files[0]); // single file upload, so [0] since it can be an array of files
    setFilename(e.target.files[0].name);
  }

  const onSubmit = async e => {
    e.preventDefault();
    const formData = new FormData(); //js datatype
    formData.append('file', file); // sent as req.files.file in the backend
    
    try {
      const res = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      // save response object into state
      const { fileName, filePath } = res.data; // from the backend
      console.log('response: ', res.data);
      setUploadedFile({fileName, filePath});
      // console.log('File uploaded: ', uploadedFile);
      setMessage('FIle Uploaded')

    } catch(err) {
        console.error(err);
        if (err.response.status === 500) {
          setMessage('There was a problem with the server');
        } else { 
          setMessage(err.response.data.msg);
        }
    }
  }
  return (
    <>
      {message ? <Message msg={message} /> : null}
      <form onSubmit={onSubmit}>
        <div className="custom-file">
          <input type="file" className="custom-file-input" id="customFile" onChange={onChange} />
          <label className="custom-file-label" htmlFor="customFile">
            {filename}
          </label>
        </div>
        <input type="submit" value="Upload" className="btn btn-primary btn-block mt-4" />
      </form>
      {console.log('uploaded file: ', Object.keys(uploadedFile).length)}
      {(Object.keys(uploadedFile).length > 0) ? (
        <div className="row mt-5">
          <h3 className="text-center">{uploadedFile.fileName}</h3>
          <img style={{width: '100%'}} src={uploadedFile.filePath} alt={'Uploaded: ' + uploadedFile.fileName} />
        </div>
       ) : null }
    </>
  )
}

export default FileUpload;