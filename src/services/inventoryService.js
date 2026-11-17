import api from './api';

export const getMovements = async (params = {}) => {
    const response = await api.get('/inventory/movements', { params });
    return response.data;
};

export const createMovement = async (movement) => {
    const response = await api.post('/inventory/movements', movement);
    return response.data;
};
