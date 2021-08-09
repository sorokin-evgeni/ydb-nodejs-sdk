import {AuthenticatedService, ClientOptions} from './utils';
import {NPersQueue} from "../proto/bundle";
import getLogger, {Logger} from './logging';
import {Endpoint} from './discovery';
import {IAuthService} from './credentials';
import {util} from "protobufjs";
import Driver from './driver';
import PersQueueServiceAPI = NPersQueue.PersQueueService;
import EventEmitter = util.EventEmitter;

export default class PersqueueClient extends EventEmitter {
    private schemeServices: Map<Endpoint, PersqueueService>;

    constructor(private driver: Driver) {
        super();
        this.schemeServices = new Map();
    }

    private async getPersqueueService(): Promise<PersqueueService> {
        const endpoint = await this.driver.getEndpoint();
        if (!this.schemeServices.has(endpoint)) {
            const {authService, settings} = this.driver;
            const service = new PersqueueService(endpoint, authService, settings.clientOptions);
            this.schemeServices.set(endpoint, service);
        }
        return this.schemeServices.get(endpoint) as PersqueueService;
    }

    public async initSession(initOptions: Partial<NPersQueue.ReadRequest.IInit>) {
        const service = await this.getPersqueueService();
        return service.initSession(initOptions);
    }
}

class PersqueueService extends AuthenticatedService<PersQueueServiceAPI> {
    private logger: Logger;
    public endpoint: Endpoint;

    constructor(endpoint: Endpoint, authService: IAuthService, clientOptions?: ClientOptions) {
        const host = endpoint.toString();
        super(
            host,
            'NPersQueue.PersQueueService',
            PersQueueServiceAPI,
            authService,
            clientOptions,
        );
        this.endpoint = endpoint;
        this.logger = getLogger();

        this.logger.debug('PersqueueService have been created.');
    }

    public async initSession(initOptions: Partial<NPersQueue.ReadRequest.IInit>) {
        // const settings = this.settings;
        // const proxyCookie = proxy.cookie;
        //
        // const init = NPersQueue.ReadRequest.Init.fromObject({
        //     proxyCookie,
        //     ...settings,
        // });
        //
        // this.logger.debug("read init message: %o", init.toJSON());
        //
        // return new NPersQueue.ReadRequest({ init, credentials: {} });
        return this.api.readSession({
            credentials: {},
            init: {
                ...initOptions,
                proxyCookie: 123456789
            }
        }, (error, session) => {
            this.logger.debug('NPersQueue: session have been initialized.')
            this.logger.debug(JSON.stringify(error));
            this.logger.debug(JSON.stringify(session));
        })
    }
}
