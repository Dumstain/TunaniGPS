import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Artesanos = () => {
  // Estados para cada campo del modelo Artesano
  const [artesanos, setArtesanos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [apellido_paterno, setApellidoPaterno] = useState('');
  const [apellido_materno, setApellidoMaterno] = useState('');
  const [tel, setTel] = useState('');
  const [email, setEmail] = useState('');
  const [rfc, setRfc] = useState('');
  const [ine, setIne] = useState('');
  const [numero_tarjeta, setNumeroTarjeta] = useState('');
  const [enfoque, setEnfoque] = useState('');
  const [descripcion, setDescripcion] = useState('');
  
  // Suponiendo que ya tienes un estado para la cooperativa o su ID
  const [cooperativas, setCooperativas] = useState([]);
  const [cooperativaSeleccionada, setCooperativaSeleccionada] = useState('');


  useEffect(() => {
    fetchArtesanos();
    fetchCooperativas();
  }, []);

  const fetchCooperativas = async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/cooperativas/');
    setCooperativas(response.data);
  };

  const fetchArtesanos = async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/artesanos/');
    setArtesanos(response.data);
  };

  const agregarArtesano = async () => {
    const nuevoArtesano = {
      nombre,
      apellido_paterno,
      apellido_materno,
      tel,
      email,
      rfc,
      ine,
      numero_tarjeta,
      enfoque,
      descripcion,
      cooperativa: cooperativaSeleccionada, // Cambiado a cooperativa_id
      // Añade aquí cooperativa o su ID según cómo esté manejado en tu backend
    };
    await axios.post('http://127.0.0.1:8000/api/artesanos/agregar/', nuevoArtesano);
    fetchArtesanos(); // Recargar la lista después de agregar
  };

  const eliminarArtesano = async (id) => {
    await axios.delete(`http://127.0.0.1:8000/api/artesanos/eliminar/${id}/`);
    fetchArtesanos(); // Recargar la lista después de eliminar
  };

  return (
    <div>
      <h2>Lista de Artesanos</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido Paterno</th>
            <th>Apellido Materno</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>RFC</th>
            <th>INE</th>
            <th>Número de Tarjeta</th>
            <th>Enfoque</th>
            <th>Descripción</th>
            <th>Cooperativa</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {artesanos.map((artesano) => (
            <tr key={artesano.id}>
              <td>{artesano.nombre}</td>
              <td>{artesano.apellido_paterno}</td>
              <td>{artesano.apellido_materno}</td>
              <td>{artesano.tel}</td>
              <td>{artesano.email}</td>
              <td>{artesano.rfc}</td>
              <td>{artesano.ine}</td>
              <td>{artesano.numero_tarjeta}</td>
              <td>{artesano.enfoque}</td>
              <td>{artesano.descripcion}</td>
              <td>{artesano.cooperativa}</td>
              <td>
                <button onClick={() => eliminarArtesano(artesano.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Agregar Artesano</h2>
      <table>
        <tbody>
          <tr>
            <td>Nombre:</td>
            <td>
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" />
            </td>
          </tr>
          <tr>
            <td>Apellido Paterno:</td>
            <td>
              <input type="text" value={apellido_paterno} onChange={(e) => setApellidoPaterno(e.target.value)} placeholder="Apellido Paterno" />
            </td>
          </tr>
          <tr>
            <td>Apellido Materno:</td>
            <td>
              <input type="text" value={apellido_materno} onChange={(e) => setApellidoMaterno(e.target.value)} placeholder="Apellido Materno" />
            </td>
          </tr>
          <tr>
            <td>Teléfono:</td>
            <td>
              <input type="text" value={tel} onChange={(e) => setTel(e.target.value)} placeholder="Teléfono" />
            </td>
          </tr>
          <tr>
            <td>Email:</td>
            <td>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            </td>
          </tr>
          <tr>
            <td>RFC:</td>
            <td>
              <input type="text" value={rfc} onChange={(e) => setRfc(e.target.value)} placeholder="RFC" />
            </td>
          </tr>
          <tr>
            <td>INE:</td>
            <td>
              <input type="text" value={ine} onChange={(e) => setIne(e.target.value)} placeholder="INE" />
            </td>
          </tr>
          <tr>
            <td>Número de Tarjeta:</td>
            <td>
              <input type="text" value={numero_tarjeta} onChange={(e) => setNumeroTarjeta(e.target.value)} placeholder="Número de Tarjeta" />
            </td>
          </tr>
          <tr>
            <td>Enfoque:</td>
            <td>
              <input type="text" value={enfoque} onChange={(e) => setEnfoque(e.target.value)} placeholder="Enfoque" />
            </td>
          </tr>
          <tr>
            <td>Descripción:</td>
            <td>
              <input type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Descripción" />
            </td>
          </tr>
          <tr>
  <td>Cooperativa:</td>
  <td>
  <select value={cooperativaSeleccionada} onChange={(e) => setCooperativaSeleccionada(e.target.value)}>
  <option value="">Seleccione una cooperativa</option>
  {cooperativas.map((cooperativa) => (
    <option key={cooperativa.id} value={cooperativa.id}>
      {cooperativa.nombre} {/* Asumiendo que el objeto de cooperativa tiene una propiedad 'nombre' */}
    </option>
  ))}
</select>
  </td>
</tr>
          {/* Aquí puedes añadir más campos según sea necesario */}
          <tr>
            <td colSpan="2">
              <button onClick={agregarArtesano}>Agregar Artesano</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Artesanos;
