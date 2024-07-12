import axios from 'axios';

const api = axios.create({
	baseURL: 'http://api-travelagent-0.us-east-2.elb.amazonaws.com', // rota censurada para evitar consumo do gpt-3
	headers: {
		'Content-Type': 'application/json'
	}
});

export default api;
