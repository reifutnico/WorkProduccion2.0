import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/CreateService.css';

const CreateService = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '$',
    categoria: '',
    modalidad: 'presencial',
    descripcion: ''
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    let formErrors = {};

    if (!formData.nombre) formErrors.nombre = "El nombre es requerido.";
    if (!formData.precio || !/^\$\d+(,\d{3})*(\.\d{2})?$/.test(formData.precio)) {
      formErrors.precio = "El precio debe estar en formato de dinero. Ej: $123.45";
    }
    if (!formData.categoria) formErrors.categoria = "La categoría es requerida.";
    if (!formData.modalidad) formErrors.modalidad = "La modalidad es requerida.";
    if (!formData.descripcion) formErrors.descripcion = "La descripción es requerida.";
    if (!image) formErrors.image = "La imagen es requerida.";

    setErrors(formErrors);

    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log(formData, image);
      navigate('/horario');
    }
  };

  return (
    <div className="create-service-container">
      <h1>Crear servicio</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="image-upload">
            <label htmlFor="imageInput">
              {imagePreview ? (
                <img src={imagePreview} alt="Vista previa" className="image-preview" />
              ) : (
                <div className="image-placeholder">
                  <span className="icon">📷</span>
                  <span className="text">Subir imagen</span>
                </div>
              )}
              <input type="file" id="imageInput" accept="image/*" onChange={handleImageChange} />
            </label>
            {errors.image && <p className="error-text">{errors.image}</p>}
          </div>
          <div className="form-group description-group">
            <label htmlFor="descripcion">Descripcion</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              placeholder="Descripción"
            ></textarea>
            {errors.descripcion && <p className="error-text">{errors.descripcion}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Nombre"
            />
            {errors.nombre && <p className="error-text">{errors.nombre}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="precio">Precio</label>
            <input
              type="text"
              id="precio"
              name="precio"
              value={formData.precio}
              onChange={handleInputChange}
              placeholder="$0.00"
            />
            {errors.precio && <p className="error-text">{errors.precio}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="categoria">Categoría</label>
            <input
              type="text"
              id="categoria"
              name="categoria"
              value={formData.categoria}
              onChange={handleInputChange}
              placeholder="Categoría"
            />
            {errors.categoria && <p className="error-text">{errors.categoria}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="modalidad">Modalidad</label>
            <select id="modalidad" name="modalidad" value={formData.modalidad} onChange={handleInputChange}>
              <option value="presencial">Presencial</option>
              <option value="sincronica">Virtual sincrónica</option>
              <option value="asincronica">Virtual asincrónica</option>
            </select>
          </div>
          <button type="submit" className="submit-button">Siguiente</button>
        </div>
      </form>
    </div>
  );
};

export default CreateService;
