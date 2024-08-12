import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/CreateService.css';

const CreateService = ({setService}) => {


    const [NewNombre, setNewNombre] = useState('');
    const [NewPrecio, setNewPrecio] = useState('');
    const [NewCategoria, setNewCategoria] = useState('');
    const [NewModalidad, setNewModalidad] = useState('presencial');
    const [NewDescripcion, setNewDescripcion] = useState('');
    
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const addService = async (e) => {
      const categoria = await axios.get('http://localhost:5432/Categoria', NewCategoria)
      const idCategoria = categoria.data.id;
      console.log(idCategoria + "ssssss");
      e.preventDefault(); 
      let check = validateForm();
      console.log(check)
      if (check)  {
        const newService = {
          idCreador: 1,
          idCategoria: idCategoria,
          Nombre: NewNombre,
          Descripcion: NewDescripcion,
          Foto: image.name,
          Precio: NewPrecio
        };
        try {
          console.log(newService);
          const response = await axios.post('http://localhost:5432/Servicio', newService);
          const idServicio = response.data.id;
          console.log(idServicio + "ssssss");
          setNewNombre('');
          setNewPrecio('');
          setNewCategoria('');
          setNewModalidad('presencial');
          setNewDescripcion('')
          navigate(`/horario?id=${idServicio}`);
        } catch (error) {
          console.error('Error al agregar service:', error);
        }
      }
    };
    
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setNewModalidad({
        ...NewModalidad,
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

    if (!NewNombre) formErrors.Nombre = "El Nombre es requerido.";
    if (!NewPrecio || !/^\d+(,\d{3})*(\.\d{2})?$/.test(NewPrecio)) {
      formErrors.precio = "El precio debe estar en formato de dinero. Ej: $123.45";
    }
    if (!NewCategoria) formErrors.Categoria = "La categoría es requerida.";
    if (!NewModalidad) formErrors.modalidad = "La modalidad es requerida.";
    if (!NewDescripcion) formErrors.Descripcion = "La descripción es requerida.";
    if (!image) formErrors.image = "La imagen es requerida.";

    setErrors(formErrors);

    return Object.keys(formErrors).length === 0;
  };


  return (
    <div className="create-service-container">
      <h1>Crear servicio</h1>
      <form onSubmit={addService}>
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
              <input type="file" id="imageInput"  accept="image/*" onChange={handleImageChange} />
            </label>
            {errors.image && <p className="error-text">{errors.image}</p>}
          </div>
          <div className="form-group description-group">
            <label htmlFor="Descripcion">Descripcion</label>
            <textarea
              id="Descripcion"
              name="Descripcion"
              value={NewDescripcion}
              onChange={(e) => setNewDescripcion(e.target.value)}
              placeholder="Descripción"
            ></textarea>
            {errors.Descripcion && <p className="error-text">{errors.Descripcion}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="Nombre">Nombre</label>
            <input
              type="text"
              id="Nombre"
              name="Nombre"
              value={NewNombre}
              onChange={(e) => setNewNombre(e.target.value)}
              placeholder="Nombre"
            />
            {errors.Nombre && <p className="error-text">{errors.Nombre}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="precio">Precio</label>
            <input
              type="int"
              id="precio"
              name="precio"
              value={NewPrecio}
              onChange={(e) => setNewPrecio(e.target.value)}
              placeholder="$0.00"
            />
            {errors.precio && <p className="error-text">{errors.precio}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="Categoria">Categoría</label>
            <input
              type="text"
              id="Categoria"
              name="Categoria"
              value={NewCategoria}
              onChange={(e) => setNewCategoria(e.target.value)}
              placeholder="Categoría"
            />
            {errors.Categoria && <p className="error-text">{errors.Categoria}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="modalidad">Modalidad</label>
            <select id="modalidad" name="modalidad" value={NewModalidad} onChange={handleInputChange}>
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
