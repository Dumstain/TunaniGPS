import axios from 'axios';

const handleImageUpload = async (event) => {
    const files = event.target.files;
    const formData = new FormData();
    for (let file of files) {
        formData.append('imagen', file);
    }
    try {
        const response = await axios.post(`http://localhost:8000/api/subir-foto-cooperativa/${cooperativaId}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log('Imagenes subidas', response.data);
    } catch (error) {
        console.error('Error subiendo imagenes', error);
    }
};

return (
    <div>
        <input type="file" multiple onChange={handleImageUpload} />
    </div>
);
