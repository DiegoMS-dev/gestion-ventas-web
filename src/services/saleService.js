import api from './api';

export const getSales = async () => {
    const response = await api.get('/sales');
    return response.data;
};

export const getSale = async (id) => {
    const response = await api.get(`/sales/${id}`);
    return response.data;
};

export const createSale = async (sale) => {
    const response = await api.post('/sales', sale);
    return response.data;
};

export const updateSaleStatus = async (id, status) => {
    const response = await api.patch(`/sales/${id}/status`, { status });
    return response.data;
};
