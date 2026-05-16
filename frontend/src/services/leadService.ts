import axios from 'axios';

const getAuthHeader = (token: string) => ({ headers: { Authorization: `Bearer ${token}` } });

export const fetchLeads = async (token: string, params: any) => {
  const response = await axios.get('/api/leads', { ...getAuthHeader(token), params });
  return response.data;
};

export const addLead = async (token: string, leadData: any) => {
  const response = await axios.post('/api/leads', leadData, getAuthHeader(token));
  return response.data;
};

export const deleteLead = async (token: string, id: string) => {
  const response = await axios.delete(`/api/leads/${id}`, getAuthHeader(token));
  return response.data;
};

export const exportLeads = async (token: string) => {
  const response = await axios.get('/api/leads/export', { ...getAuthHeader(token), responseType: 'blob' });
  return response;
};
