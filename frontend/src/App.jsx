import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);

  const handlePredict = async () => {
    if (!image) {
      alert("Please upload an image first");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    const response = await axios.post(
      "http://127.0.0.1:5000/predict",
      formData
    );

    setResult(response.data);
  };

  return (
    <div className="app">

      <div className="header">
        <h1>Aerial GCP Pose Estimation</h1>
        <p>
          AI Powered Ground Control Point Detection using YOLOv8
        </p>
      </div>

      <div className="dashboard">

        <div className="left-panel">

          <h2>Upload Image</h2>

          <label className="upload-box">

            <input
              type="file"
              hidden
              onChange={(e) => {
                setImage(e.target.files[0]);
                setPreview(
                  URL.createObjectURL(
                    e.target.files[0]
                  )
                );
              }}
            />

            <div>
              📤 Click to Upload Aerial Image
            </div>

          </label>

          <button
            className="btn"
            onClick={handlePredict}
          >
            Detect Marker
          </button>

        </div>

        <div className="right-panel">

          {preview ? (
            <img
              src={preview}
              alt="preview"
              className="preview"
            />
          ) : (
            <div className="placeholder">
              Image Preview
            </div>
          )}

        </div>

      </div>

      {result && (

        <div className="results">

          <div className="card">
            <h3>Detected Shape</h3>
            <p>{result.shape}</p>
          </div>

          <div className="card">
            <h3>X Coordinate</h3>
            <p>{result.x.toFixed(2)}</p>
          </div>

          <div className="card">
            <h3>Y Coordinate</h3>
            <p>{result.y.toFixed(2)}</p>
          </div>

        </div>

      )}

    </div>
  );
}

export default App;