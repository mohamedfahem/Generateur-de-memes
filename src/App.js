import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImages, faPlus, faTrash, faShareAlt, faDownload, faSave, faRedo } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons'; // Import brand icons
import html2canvas from 'html2canvas';
import './App.css';

function App() {
  const [activeSection, setActiveSection] = useState('createMeme');
  const [image, setImage] = useState(null);
  const [text, setText] = useState('');
  const [savedMemes, setSavedMemes] = useState([]);
  const [memeUrl, setMemeUrl] = useState('');

  useEffect(() => {
    const memes = JSON.parse(localStorage.getItem('memes')) || [];
    setSavedMemes(memes);
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setText(''); // Reset text when a new image is uploaded
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const downloadMeme = () => {
    const memeElement = document.getElementById('meme');
    html2canvas(memeElement).then((canvas) => {
      const link = document.createElement('a');
      link.download = 'meme.png';
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  const saveMeme = () => {
    const memeElement = document.getElementById('meme');
    html2canvas(memeElement).then((canvas) => {
      const memeUrl = canvas.toDataURL();
      const updatedMemes = [...savedMemes, memeUrl];
      setSavedMemes(updatedMemes);
      localStorage.setItem('memes', JSON.stringify(updatedMemes));
      setMemeUrl(memeUrl); // Save the current meme URL for sharing
    });
  };

  // Delete meme function
  const deleteMeme = (index) => {
    const updatedMemes = savedMemes.filter((_, i) => i !== index);
    setSavedMemes(updatedMemes);
    localStorage.setItem('memes', JSON.stringify(updatedMemes));
  };

  const toggleSection = (section) => {
    setActiveSection(section);
  };

  // Share functions
  const shareOnTwitter = (memeUrl) => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(memeUrl)}`;
    window.open(twitterUrl, '_blank');
  };
  
  const shareOnFacebook = (memeUrl) => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(memeUrl)}`;
    window.open(facebookUrl, '_blank');
  };
  
  const shareOnInstagram = () => {
    alert("Instagram does not support sharing directly via links. Please download the meme and upload it manually.");
  };

  const refreshMeme = () => {
    setImage(null);
    setText('');
    setMemeUrl('');
  };

  return (
    <div className="App">
      <nav className="navbar">
        <button onClick={() => toggleSection('createMeme')} className={activeSection === 'createMeme' ? 'active' : ''}>
          <FontAwesomeIcon icon={faPlus} /> Create Meme
        </button>
        <button onClick={() => toggleSection('gallery')} className={activeSection === 'gallery' ? 'active' : ''}>
          <FontAwesomeIcon icon={faImages} /> Open Gallery
        </button>
      </nav>

      {/* Create Meme Section */}
      {activeSection === 'createMeme' && (
        <div className="meme-section">
          <h1>Create a Meme</h1>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          
          {/* Conditionally render the text input only if an image is uploaded */}
          {image && (
            <input
              type="text"
              placeholder="Enter your meme text"
              value={text}
              onChange={handleTextChange}
              className="meme-text-input" // Add class for styling
            />
          )}

          <div id="meme" style={{ position: 'relative', display: 'inline-block', marginTop: '20px' }}>
            {image && <img src={image} alt="Uploaded meme" style={{ width: '300px' }} />}
            {text && (
              <h2 style={{ position: 'absolute', top: '10px', left: '10px', color: 'black', textShadow: '2px 2px 4px black' }}>
                {text}
              </h2>
            )}
          </div>
          <div style={{ marginTop: '20px' }}>
            <button onClick={downloadMeme}>
              <FontAwesomeIcon icon={faDownload} /> Download Meme
            </button>
            <button onClick={saveMeme} style={{ marginLeft: '10px' }}>
              <FontAwesomeIcon icon={faSave} /> Save Meme
            </button>
            <button onClick={refreshMeme} style={{ marginLeft: '10px' }}>
              <FontAwesomeIcon icon={faRedo} /> Refresh
            </button>
          </div>
          {/* Share Buttons */}
          {memeUrl && (
            <div className="share-buttons" style={{ marginTop: '20px' }}>
              <button onClick={shareOnFacebook.bind(null, memeUrl)}>
              Share on <FontAwesomeIcon icon={faFacebook} />
              </button>
              <button onClick={shareOnTwitter.bind(null, memeUrl)}>
              Share on <FontAwesomeIcon icon={faTwitter} />
              </button>
              <button onClick={shareOnInstagram}>
              Share on <FontAwesomeIcon icon={faInstagram} />
              </button>
            </div>
          )}
        </div>
      )}
      {/* Gallery Section */}
      {activeSection === 'gallery' && (
        <div className="gallery-section">
          <h1>Saved Memes</h1>
          <div className="meme-gallery">
            {savedMemes.map((meme, index) => (
              <div key={index} className="gallery-meme-container">
                <img src={meme} alt={`Meme ${index}`} className="gallery-meme" />
                <div className="meme-actions">
                  <button className="delete-btn" onClick={() => deleteMeme(index)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                  <div className="share-buttons">
                    <button onClick={() => shareOnFacebook(meme)}>
                      <FontAwesomeIcon icon={faFacebook} />
                    </button>
                    <button onClick={() => shareOnTwitter(meme)}>
                      <FontAwesomeIcon icon={faTwitter} />
                    </button>
                    <button onClick={shareOnInstagram}>
                      <FontAwesomeIcon icon={faInstagram} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
