import axios from 'axios';

const servicepay = axios.create({
    baseURL: 'http://services.gruposolar.com.br:8084/api',
    headers: {
        'Content-Type': 'application/json',
        'API-KEY': 'lPq#IdlnSRfkZPwb@3@pe6R1S4Gl0za@RmBX!g8Z',
    },
});

export default servicepay;
