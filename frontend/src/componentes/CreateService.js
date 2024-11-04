import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/CreateService.css';
import { UserContext } from '../context/UserContext';

const CreateService = ({ setService }) => {
  
  const [NewNombre, setNewNombre] = useState('');
  const [NewPrecio, setNewPrecio] = useState('');
  const [NewCategoria, setNewCategoria] = useState('');
  const [NewModalidad, setNewModalidad] = useState('presencial');
  const [NewDescripcion, setNewDescripcion] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [categorias, setCategorias] = useState([]);
  const {token} = useContext(UserContext)
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get('http://localhost:5000/Categoria');
        setCategorias(response.data);
      } catch (error) {
        console.error('Error al obtener categorías:', error);
      }
    };
    
    fetchCategorias();
  }, []);
  
  const addService = async (e) => {
    e.preventDefault();
    let check = validateForm();
    
    if (check) {
      try {
        const categoria = categorias.find((cat) => cat.Nombre === NewCategoria);
        if (!categoria) {
          alert('No se encontró la categoría. La página se recargará.');
          window.location.reload();
        } else {
          const newService = {
            idCategoria: categoria.id,
            Nombre: NewNombre,
            Descripcion: NewDescripcion,
            Foto: image.name,
            Precio: NewPrecio,
          };
          
          const response = await axios.post('http://localhost:5000/Servicio', newService, {
            headers: {
            'Authorization': `Bearer ${token}`
            }});
          const idServicio = response.data.id;
          navigate(`/horario?id=${idServicio}`);
        }
      } catch (error) {
        console.error('Error al agregar servicio:', error);
      }
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'modalidad') {
      setNewModalidad(value);
    }
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
    
    if (!NewNombre) formErrors.Nombre = 'El Nombre es requerido.';
    if (!NewPrecio || !/^\d+(,\d{3})*(\.\d{2})?$/.test(NewPrecio)) {
      formErrors.precio = 'El precio debe estar en formato de dinero. Ej: $123.45';
    }
    if (!NewCategoria) formErrors.Categoria = 'La categoría es requerida.';
    if (!NewModalidad) formErrors.modalidad = 'La modalidad es requerida.';
    if (!NewDescripcion) formErrors.Descripcion = 'La descripción es requerida.';
    if (!image) formErrors.image = 'La imagen es requerida.';
    
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
              <input type="file" id="imageInput" accept="image/*" onChange={handleImageChange} />
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
              type="text"
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
            <select
              id="Categoria"
              name="Categoria"
              value={NewCategoria}
              onChange={(e) => setNewCategoria(e.target.value)}  // Al seleccionar una opción, se actualiza el estado
            >
              <option value="">Seleccione una categoría</option> {/* Opción por defecto */}
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.Nombre}>
                  {categoria.Nombre}
                </option>
              ))}
            </select>
            {errors.Categoria && <p className="error-text">{errors.Categoria}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="modalidad">Modalidad</label>
            <select id="modalidad" name="modalidad" value={NewModalidad} onChange={handleInputChange}>
              <option value="presencial">Presencial</option>
              <option value="sincronica">Virtual sincrónica</option>
              <option value="asincronica">Virtual asincrónica</option>
            </select>
            {errors.modalidad && <p className="error-text">{errors.modalidad}</p>}
          </div>
          <button type="submit" className="submit-button">Siguiente</button>
        </div>
      </form>
    </div>
  );
};

export default CreateService;
