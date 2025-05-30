//Doesn't Allow downloading of excel 
// import 'bootstrap/dist/css/bootstrap.min.css';
// import React, { useState, useEffect } from 'react';
// import { S3Client, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
// import { configureAwsCredentials } from './awsCredentials';

// const REGION = 'us-east-1';
// const BUCKET_NAME = 'xyz-logistics';
// const FOLDER_PREFIX = 'uploads';

// export default function UploadAndList() {
//   const [file, setFile] = useState(null);
//   const [files, setFiles] = useState([]);
//   const [userSub, setUserSub] = useState('');
//   const [s3Client, setS3Client] = useState(null);

//   const setup = async () => {
//     const idToken = localStorage.getItem('idToken');
//     if (!idToken) return alert("Not authenticated");

//     const { credentials } = await configureAwsCredentials(idToken);
//     const s3 = new S3Client({ region: REGION, credentials });
//     setS3Client(s3);

//     const payload = JSON.parse(atob(idToken.split('.')[1]));
//     setUserSub(payload.sub);
//   };

//   useEffect(() => {
//     setup();
//   }, []);

//   const handleUpload = async () => {
//     if (!file || !s3Client || !userSub) return alert("Setup incomplete");

//     const uploadKey = `${FOLDER_PREFIX}/${userSub}/${file.name}`;
//     const command = new PutObjectCommand({
//       Bucket: BUCKET_NAME,
//       Key: uploadKey,
//       Body: await file.arrayBuffer(),
//       ContentType: file.type,
//     });

//     try {
//       await s3Client.send(command);
//       alert("✅ Upload successful!");
//       setFile(null);
//       listFiles();
//     } catch (err) {
//       console.error("Upload error:", err);
//       alert("❌ Upload failed");
//     }
//   };

//   const listFiles = async () => {
//     if (!s3Client || !userSub) return;

//     const command = new ListObjectsV2Command({
//       Bucket: BUCKET_NAME,
//       Prefix: `${FOLDER_PREFIX}/${userSub}/`,
//     });

//     try {
//       const response = await s3Client.send(command);
//       setFiles(response.Contents || []);
//     } catch (err) {
//       console.error("List error:", err);
//       alert("❌ Could not list files");
//     }
//   };

//   return (
//     <div className="container my-5">
//       <div className="card shadow p-4">
//         <h2 className="mb-4">Upload Excel File</h2>

//         <div className="input-group mb-3">
//           <input
//             type="file"
//             accept=".xlsx"
//             className="form-control"
//             onChange={(e) => setFile(e.target.files[0])}
//           />
//           <button
//             className="btn btn-primary"
//             onClick={handleUpload}
//             disabled={!file}
//           >
//             Upload
//           </button>
//         </div>

//         <hr />

//         <div className="d-flex justify-content-between align-items-center mb-3">
//           <h5>Your Files</h5>
//           <button className="btn btn-success" onClick={listFiles}>
//             Refresh List
//           </button>
//         </div>

//         {files.length === 0 ? (
//           <p className="text-muted">No files uploaded yet.</p>
//         ) : (
//           <ul className="list-group">
//             {files.map((f) => (
//               <li key={f.Key} className="list-group-item">
//                 <a
//                   href={`https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${f.Key}`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   {f.Key.split('/').pop()}
//                 </a>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }


//can download files and has styling 
// import 'bootstrap/dist/css/bootstrap.min.css';
// import React, { useState, useEffect } from 'react';
// import { S3Client, PutObjectCommand, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
// import { configureAwsCredentials } from './awsCredentials';

// const REGION = 'us-east-1';
// const BUCKET_NAME = 'xyz-logistics';
// const FOLDER_PREFIX = 'uploads';

// export default function UploadAndList() {
//   const [file, setFile] = useState(null);
//   const [files, setFiles] = useState([]);
//   const [userSub, setUserSub] = useState('');
//   const [s3Client, setS3Client] = useState(null);

//   const setup = async () => {
//     const idToken = localStorage.getItem('idToken');
//     if (!idToken) return alert("Not authenticated");

//     const { credentials } = await configureAwsCredentials(idToken);
//     const s3 = new S3Client({ region: REGION, credentials });
//     setS3Client(s3);

//     const payload = JSON.parse(atob(idToken.split('.')[1]));
//     console.log("✅ Using sub as folder:", payload.sub);
//     setUserSub(payload.sub);
//   };

//   useEffect(() => {
//     setup();
//   }, []);

//   const handleUpload = async () => {
//     if (!file || !s3Client || !userSub) return alert("Setup incomplete");

//     const uploadKey = `${FOLDER_PREFIX}/${userSub}/${file.name}`;
//     const command = new PutObjectCommand({
//       Bucket: BUCKET_NAME,
//       Key: uploadKey,
//       Body: await file.arrayBuffer(),
//       ContentType: file.type,
//     });

//     try {
//       await s3Client.send(command);
//       alert("✅ Upload successful!");
//       setFile(null);
//       listFiles();
//     } catch (err) {
//       console.error("Upload error:", err);
//       alert("❌ Upload failed");
//     }
//   };

//   const listFiles = async () => {
//     if (!s3Client || !userSub) return;

//     const command = new ListObjectsV2Command({
//       Bucket: BUCKET_NAME,
//       Prefix: `${FOLDER_PREFIX}/${userSub}/`,
//     });

//     try {
//       const response = await s3Client.send(command);
//       const fileList = response.Contents || [];

//       const signedFiles = await Promise.all(
//         fileList.map(async (f) => {
//           const url = await getSignedUrl(
//             s3Client,
//             new GetObjectCommand({ Bucket: BUCKET_NAME, Key: f.Key }),
//             { expiresIn: 3600 }
//           );
//           return {
//             name: f.Key.split('/').pop(),
//             url,
//           };
//         })
//       );

//       setFiles(signedFiles);
//     } catch (err) {
//       console.error("List error:", err);
//       alert("❌ Could not list files");
//     }
//   };

//   return (
//     <div className="container my-5">
//       <div className="card shadow p-4">
//         <h2 className="mb-4">Upload Excel File</h2>

//         <div className="input-group mb-3">
//           <input
//             type="file"
//             accept=".xlsx"
//             className="form-control"
//             onChange={(e) => setFile(e.target.files[0])}
//           />
//           <button
//             className="btn btn-primary"
//             onClick={handleUpload}
//             disabled={!file}
//           >
//             Upload
//           </button>
//         </div>

//         <hr />

//         <div className="d-flex justify-content-between align-items-center mb-3">
//           <h5>Your Files</h5>
//           <button className="btn btn-success" onClick={listFiles}>
//             Refresh List
//           </button>
//         </div>

//         {files.length === 0 ? (
//           <p className="text-muted">No files uploaded yet.</p>
//         ) : (
//           <ul className="list-group">
//             {files.map((f, index) => (
//               <li key={index} className="list-group-item">
//                 <a href={f.url} target="_blank" rel="noopener noreferrer">
//                   {f.name}
//                 </a>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }



//Allows downloading of excel and deleting of files with no styling 
// import React, { useState, useEffect } from 'react';
// import { S3Client, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
// import { configureAwsCredentials } from './awsCredentials';
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
// import { GetObjectCommand } from '@aws-sdk/client-s3';
// import { DeleteObjectCommand } from '@aws-sdk/client-s3';

// const REGION = 'us-east-1';
// const BUCKET_NAME = 'xyz-logistics';
// const FOLDER_PREFIX = 'uploads';

// export default function UploadAndList() {
//   const [file, setFile] = useState(null);
//   const [files, setFiles] = useState([]);
//   const [userSub, setUserSub] = useState('');
//   const [s3Client, setS3Client] = useState(null);

//   const setup = async () => {
//     const idToken = localStorage.getItem('idToken');
//     if (!idToken) return alert("Not authenticated");
  
//     const { credentials } = await configureAwsCredentials(idToken);
//     const s3 = new S3Client({ region: REGION, credentials });
//     setS3Client(s3);
  
//     const payload = JSON.parse(atob(idToken.split('.')[1]));
//     console.log("✅ Using sub as folder:", payload.sub);
//     setUserSub(payload.sub);
//   };
  
//   useEffect(() => {
//     setup(); // 👈 THIS CALLS THE FUNCTION ONCE WHEN COMPONENT LOADS
//   }, []);
  

//   const handleUpload = async () => {
//     if (!file || !s3Client || !userSub) return alert("Setup incomplete");
//     console.log("🪪 idToken:", localStorage.getItem("idToken"));
//     console.log("📦 AWS Credentials:", s3Client.config.credentials);
    
//     const uploadKey = `${FOLDER_PREFIX}/${userSub}/${file.name}`;
//     console.log("Uploading to:", uploadKey);

//     const command = new PutObjectCommand({
//       Bucket: BUCKET_NAME,
//       Key: uploadKey,
//       Body: await file.arrayBuffer(),
//       ContentType: file.type,
//     });

//     try {
//       await s3Client.send(command);
//       alert("✅ Upload successful!");
//       setFile(null);
//       listFiles(); // Refresh
//     } catch (err) {
//       console.error("Upload error:", err);
//       alert("❌ Upload failed");
//     }
//   };

//   const listFiles = async () => {
//     if (!s3Client || !userSub) return;
  
//     const command = new ListObjectsV2Command({
//       Bucket: BUCKET_NAME,
//       Prefix: `${FOLDER_PREFIX}/${userSub}/`,
//     });
  
//     try {
//       const response = await s3Client.send(command);
//       const files = response.Contents || [];
  
//       const signedFiles = await Promise.all(
//         files.map(async (f) => {
//           const getObjectParams = {
//             Bucket: BUCKET_NAME,
//             Key: f.Key,
//           };
  
//           const url = await getSignedUrl(s3Client, new GetObjectCommand(getObjectParams), { expiresIn: 3600 });          return {
//             name: f.Key.split('/').pop(),
//             url,
//           };
//         })
//       );
  
//       setFiles(signedFiles);
//     } catch (err) {
//       console.error("List error:", err);
//       alert("❌ Could not list files");
//     }
//   };
  
//   const handleDelete = async (key) => {
//     try {
//       await s3Client.send(new DeleteObjectCommand({
//         Bucket: BUCKET_NAME,
//         Key: key,
//       }));
//       alert("🗑️ File deleted");
//       listFiles(); // Refresh list
//     } catch (err) {
//       console.error("Delete error:", err);
//       alert("❌ Failed to delete file");
//     }
//   };

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>Upload Excel File</h2>
//       <input type="file" accept=".xlsx" onChange={(e) => setFile(e.target.files[0])} />
//       <button onClick={handleUpload} disabled={!file}>Upload</button>
//       <hr />
//             <h3>Your Files</h3>
//             <button onClick={listFiles}>Refresh List</button>
//             <ul>
//             {files.map((f, index) => (
//               <li key={index}>
//                 <a href={f.url} target="_blank" rel="noopener noreferrer">
//                   {f.name}
//                 </a>
//                 <button onClick={() => handleDelete(`${FOLDER_PREFIX}/${userSub}/${f.name}`)}>
//                   🗑️ Delete
//                 </button>
//               </li>
//             ))}
//           </ul>
//     </div>
//   );
// }

import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  GetObjectCommand,
  DeleteObjectCommand
} from '@aws-sdk/client-s3';
import { configureAwsCredentials } from './awsCredentials';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const REGION = 'us-east-1';
const BUCKET_NAME = 'xyz-logistics';
const FOLDER_PREFIX = 'uploads';

export default function UploadAndList() {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [userSub, setUserSub] = useState('');
  const [s3Client, setS3Client] = useState(null);
  const [idToken, setIdToken] = useState('');


  const setup = async () => {
    const token = localStorage.getItem('idToken');
    if (!token) return alert("Not authenticated");
  
    const { credentials } = await configureAwsCredentials(token); // ✅ use token
    setIdToken(token); // ✅ store for later
  
    const s3 = new S3Client({ region: REGION, credentials });
    setS3Client(s3);
  
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log("✅ Using sub as folder:", payload.sub);
    setUserSub(payload.sub);
  };
  
  useEffect(() => {
    setup();
  }, []);

  const handleUpload = async () => {
    if (!file || !s3Client || !userSub) return alert("Setup incomplete");

    const payload = JSON.parse(atob(idToken.split('.')[1]));
    const email = payload.email;
    const uploadKey = `${FOLDER_PREFIX}/${payload.sub}/${file.name}`;
    
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: uploadKey,
      Body: await file.arrayBuffer(),
      ContentType: file.type,
      Metadata: {
        uploader_email: email
      }
    });
    
    try {
      await s3Client.send(command);
      alert("✅ Upload successful!");
      setFile(null);
      listFiles(); // Refresh
    } catch (err) {
      console.error("Upload error:", err);
      alert("❌ Upload failed");
    }
  };

  const listFiles = async () => {
    if (!s3Client || !userSub) return;

    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: `${FOLDER_PREFIX}/${userSub}/`,
    });

    try {
      const response = await s3Client.send(command);
      const rawFiles = response.Contents || [];

      const signedFiles = await Promise.all(
        rawFiles.map(async (f) => {
          const url = await getSignedUrl(
            s3Client,
            new GetObjectCommand({ Bucket: BUCKET_NAME, Key: f.Key }),
            { expiresIn: 3600 }
          );
          return {
            name: f.Key.split('/').pop(),
            url,
          };
        })
      );

      setFiles(signedFiles);
    } catch (err) {
      console.error("List error:", err);
      alert("❌ Could not list files");
    }
  };

  const handleDelete = async (key) => {
    try {
      await s3Client.send(new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      }));
      alert("🗑️ File deleted");
      listFiles(); // Refresh list
    } catch (err) {
      console.error("Delete error:", err);
      alert("❌ Failed to delete file");
    }
  };

  return (
    <div className="container my-5">
      <div className="card p-4 shadow">
        <h2 className="mb-4">Upload Excel File</h2>

        <div className="input-group mb-3">
          <input
            type="file"
            accept=".xlsx"
            className="form-control"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button
            className="btn btn-primary"
            onClick={handleUpload}
            disabled={!file}
          >
            Upload
          </button>
        </div>

        <hr />

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Your Files</h4>
          <button className="btn btn-success" onClick={listFiles}>
            Refresh List
          </button>
        </div>

        {files.length === 0 ? (
          <p className="text-muted">No files uploaded yet.</p>
        ) : (
          <ul className="list-group">
            {files.map((f, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                <a
                  href={f.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-decoration-none"
                >
                  {f.name}
                </a>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(`${FOLDER_PREFIX}/${userSub}/${f.name}`)}
                >
                  🗑️ Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}


