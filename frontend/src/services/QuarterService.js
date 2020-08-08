import axios       from 'axios'
import { API_URL } from './config'

export class QuarterService {

  getAll = () => axios.get(`${API_URL}/quarters/all`)

  getQuartersData = () => axios.get(`${API_URL}/quarters/all_quarters`)

  getPresentQuarterData = () => axios.get(`${API_URL}/quarters/present`)

  getQuarters = () => axios.get(`${API_URL}/quarters/quarters`)

  getYears = () => axios.get(`${API_URL}/quarters/years`)

  getServices = (username, quarter, year) => axios.get(`${API_URL}/quarters/services/service_owners`, { params : { username, quarter, year } })

  getServicesByRole = (username, role, quarter, year) => axios.get(`${API_URL}/quarters/services/role`, { params : { username, role, quarter, year } })
  
  uploadOne = (newService, quarter, year) => axios.post(`${API_URL}/quarters/services/upload_one`, { newService, quarter, year })

  updateOne = (row, quarter, year) => axios.put(`${API_URL}/quarters/services/update_one`, { row, quarter, year } )

  deleteOne = (row, quarter, year) => axios.post(`${API_URL}/quarters/services/delete_one`, { row, quarter, year })
  
  updateServices = (_id, quarter, year, start, end, services) => axios.put(`${API_URL}/quarters/services/update_services`, {_id, quarter, year, start, end, services } )

  addServices = (quarter, year, start, end, services) => axios.put(`${API_URL}/quarters/services/add_services`, { quarter, year, start, end, services } )

  deleteServices = (_id, quarter, year) => axios.delete(`${API_URL}/quarters/services/delete_services`, { params : { _id, quarter, year } } )

}