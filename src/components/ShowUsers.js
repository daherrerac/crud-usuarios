import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import UserForm from './UserForm'; 
import UserTable from './UserTable';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

const ShowUsers = () => {
    const url = 'http://localhost:5000/api/users';
    const [users, setUsers] = useState([]);
    const [formValues, setFormValues] = useState({ id: '', nombre: '', email: '', password: '' });
    const [operation, setOperation] = useState(1);
    const [title, setTitle] = useState('Registrar Usuario');
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = async () => {
        try {
            const response = await axios.get(url + "/getall");
            setUsers(response.data.users); 
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
        }
    };
    
    

    const openModal = (op, id = '', nombre = '', email = '', password = '') => {
        setFormValues({ id, nombre, email, password });
        setOperation(op);
        setTitle(op === 1 ? 'Registrar Usuario' : 'Editar Usuario');
        setModalOpen(true);
    };

    const validar = () => {
        const { nombre, email, password } = formValues;
        console.log("Formulario"+  nombre);
        if (nombre.trim() === '') {
            show_alerta('Escribe el nombre del usuario', 'warning');
        } else if (email.trim() === '') {
            show_alerta('Escribe el email del usuario', 'warning');
        } else if (password.trim() === '') {
            show_alerta('Escribe la contraseña del usuario', 'warning');
        } else {
            const parametros = { nombre: nombre.trim(), email: email.trim(), password };
            if (operation === 1) {
                enviarSolicitud('POST', parametros);
                console.log(parametros);
            } else {
                enviarSolicitud('PUT', parametros, formValues.id);
            }
        }
    };

    const enviarSolicitud = async (metodo, parametros, userId = null) => {
        let requestUrl = userId ? `${url}/${userId}` : url;
        if(metodo === 'POST')
            requestUrl = requestUrl + '/create';        
        try {
            const response = await axios({ method: metodo, url: requestUrl, data: parametros });
            show_alerta(response.statusText || 'Operación exitosa', 'success');
            if (response.status === 200 || response.status === 201) {
                getUsers();   
                cerrarModal();
            }
        } catch (error) {
            show_alerta('Error en la solicitud', 'error');
            console.error(error);
        }
    };

    const deleteUser = (id, nombre) => {
        Swal.fire({
            title: `¿Seguro de eliminar al usuario ${nombre}?`,
            icon: 'question',
            text: 'No se podrá dar marcha atrás',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                enviarSolicitud('DELETE', {}, id);
            } else {
                show_alerta('El usuario NO fue eliminado', 'info');
            }
        });
    };

    const cerrarModal = () => {
        setModalOpen(false);
        setFormValues({ id: '', nombre: '', email: '', password: '' });
    };

    const show_alerta = (mensaje, icon) => {
        Swal.fire({
            title: mensaje,
            icon: icon,
            confirmButtonText: 'OK'
        });
    };

    return (
        <>
            {/* Navbar */}
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Gestión de Usuarios
                    </Typography>
                    <Button variant="contained" color="secondary" onClick={() => openModal(1)}>
                        Añadir Usuario
                    </Button>
                </Toolbar>
            </AppBar>

            {/* Contenido principal */}
            <Container sx={{ mt: 4 }}>
                <UserTable
                    users={users}
                    openModal={openModal}
                    deleteUser={deleteUser}
                />
            </Container>

            {/* Modal para crear/editar usuario */}
            <UserForm
                title={title}
                formValues={formValues}
                setFormValues={setFormValues}
                validar={validar}
                modalOpen={modalOpen} 
                cerrarModal={cerrarModal}
            />
        </>
    );
};

export default ShowUsers;
