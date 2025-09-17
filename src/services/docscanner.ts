import axios from 'axios';

let BASE_URL = '';

let requestCustom: any;
let data: any;

const docscanner = axios.create({
    withCredentials: true,
});

docscanner.interceptors.request.use(async request => {
    // request.baseURL = process.env.EXPO_PUBLIC_API_URL;
    // BASE_URL = `${process.env.EXPO_PUBLIC_API_URL}`;
    request.baseURL ='https://services.gruposolar.com.br:8086/servicesgruposolar/servlet/isCobol/';
    BASE_URL ='https://services.gruposolar.com.br:8086/servicesgruposolar/servlet/isCobol/';

    requestCustom = request;
    data = request.data;
    return request;
});

docscanner.interceptors.response.use(
    response => response,
    async _error => {
        console.log('Abrindo sessão com o servidor novamente');

        const axiosNew = axios.create({
            baseURL: BASE_URL,
            withCredentials: true,
        });

        let session = await axiosNew
            .get('(docscanner)')
            .then(resp => resp)
            .catch(_err => {
                return {
                    status: 404,
                    success: false,
                    message: 'Não foi possível conectar ao servidor 1',
                };
            });

        if (session.status !== 200) {
            session = {
                status: 404,
                success: false,
                message: 'Não foi possível conectar ao servidor 2',
            };

            return session;
        }

        console.log('Refazendo a chamada original...');
        let originalResponse;
        if (
            requestCustom.method === 'POST' ||
            requestCustom.method === 'post'
        ) {
            originalResponse = await docscanner.post(
                `${requestCustom.url}`,
                data,
            );
        } else {
            originalResponse = await docscanner.get(`${requestCustom.url}`);
        }
        if (originalResponse.status !== 200) {
            session = {
                status: 404,
                success: false,
                message: 'Não foi possível conectar ao servidor 3',
            };
            return session;
        }
        return originalResponse;
    },
);

export default docscanner;
