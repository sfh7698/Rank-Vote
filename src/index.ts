import { createServer } from 'http';
import app from './app';
import { generalLogger } from './utils/loggers';

const server = createServer(app);

const port = process.env.PORT || 3000;

server.listen(port, () => {
    generalLogger.info(`Server is running at http://localhost:${port}`);
});

export default server;

