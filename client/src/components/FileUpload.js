import React, { useState } from 'react';
import axios from 'axios'

const FileUpload = () => {
  const [ file, setFile ] = useState('');
  const [ filename, setFilename ] = useState('Choose File');
  const [ uploadedFile, setUploadedFile ] = useState({});

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
      console.log('File uploaded: ', uploadedFile);

    } catch(err) {
        console.error(err);
        if (err.response.status === 500) {
          console.warn('There was a problem with the server');
        } else { 
          console.warn(err.response.data.msg);
        }
    }
  }
  return (
    <>
      <form onSubmit={onSubmit}>
        <div className="custom-file">
          <input type="file" className="custom-file-input" id="customFile" onChange={onChange} />
          <label className="custom-file-label" htmlFor="customFile">
            {filename}
          </label>
        </div>
        <input type="submit" value="Upload" className="btn btn-primary btn-block mt-4" />
      </form>
      {!uploadedFile ? (
        <div className="row mt-5">
          <h3 className="text-center">{uploadedFile.fileName}</h3>
          <img style={{width: '100%'}} src={uploadedFile.filePath} alt={'Uploaded File '+ uploadedFile.filename} />
        </div>
       ) : null }
    </>
  )
}

export default FileUpload;