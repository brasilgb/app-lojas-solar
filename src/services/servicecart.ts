import axios from 'axios';

let BASE_URL = '';

let requestCustom: any;
let data: any;

const servicecart = axios.create({
    withCredentials: true,
});

servicecart.interceptors.request.use(async request => {
    request.baseURL =
        'https://services.gruposolar.com.br:8086/servicesgruposolar/servlet/isCobol';
    BASE_URL =
        'https://services.gruposolar.com.br:8086/servicesgruposolar/servlet/isCobol';

    requestCustom = request;
    data = request.data;
    return request;
});

servicecart.interceptors.response.use(
    response => response,
    async _error => {
        console.log('Abrindo sessão com o servidor novamente');

        const axiosNew = axios.create({
            baseURL: BASE_URL,
            withCredentials: true,
        });

        let session = await axiosNew
            .get('(pagamentos)?company=1')
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
            originalResponse = await servicecart.post(
                `${requestCustom.url}`,
                data,
            );
        } else {
            originalResponse = await servicecart.get(`${requestCustom.url}`);
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

export default servicecart;
